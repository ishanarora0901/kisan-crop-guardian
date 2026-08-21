const CropPassport = require('../models/CropPassport');
const { sha256, calculateBlockHash, calculateMerkleRoot } = require('../utils/cryptoHash');

class BlockchainService {
  /**
   * Initializes a new Crop Passport with a cryptographic Genesis block
   */
  static async initializePassport({ cropCycle, farmer, farm, cropName, variety, season }) {
    const passportId = `CROP-PASS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const genesisTimestamp = new Date();
    const genesisData = {
      action: 'GENESIS_CREATION',
      passportId,
      cropCycleId: cropCycle._id.toString(),
      cropName,
      variety,
      farmName: farm.name,
      farmerId: farmer._id.toString(),
      initializationDate: genesisTimestamp.toISOString(),
    };

    const dataHash = sha256(genesisData);
    const previousHash = '0000000000000000000000000000000000000000000000000000000000000000';
    const blockHash = calculateBlockHash(0, previousHash, genesisTimestamp.getTime(), dataHash, 0);

    const genesisBlock = {
      index: 0,
      timestamp: genesisTimestamp,
      eventType: 'GENESIS',
      eventTitle: `Blockchain Crop Passport Initialized for ${cropName} (${variety})`,
      details: genesisData,
      dataHash,
      previousHash,
      blockHash,
      nonce: 0,
      verifiedBy: 'AI-Crop-Guardian-Core-Validator-01',
      ipfsCid: `bafybeicrop${sha256(dataHash).substring(0, 16)}`,
      signature: sha256(`sig-${blockHash}`),
    };

    const passport = new CropPassport({
      passportId,
      cropCycle: cropCycle._id,
      farmer: farmer._id,
      farm: farm._id,
      cropName,
      variety,
      season,
      merkleRootHash: blockHash,
      isTamperVerified: true,
      blocks: [genesisBlock],
      qrVerificationUrl: `https://aicropguardian.app/verify/${passportId}`,
      status: 'ACTIVE',
    });

    await passport.save();
    return passport;
  }

  /**
   * Adds an immutable agricultural milestone block to the passport
   */
  static async addBlock({ passportId, eventType, eventTitle, details, verifiedBy = 'AI-Crop-Guardian-Node-01' }) {
    const passport = await CropPassport.findOne({ passportId });
    if (!passport) {
      throw new Error(`Crop Passport not found for ID ${passportId}`);
    }

    const latestBlock = passport.blocks[passport.blocks.length - 1];
    const newIndex = latestBlock.index + 1;
    const timestamp = new Date();
    const dataHash = sha256(details);
    const previousHash = latestBlock.blockHash;
    const nonce = Math.floor(Math.random() * 10000);
    const blockHash = calculateBlockHash(newIndex, previousHash, timestamp.getTime(), dataHash, nonce);

    const newBlock = {
      index: newIndex,
      timestamp,
      eventType,
      eventTitle,
      details,
      dataHash,
      previousHash,
      blockHash,
      nonce,
      verifiedBy,
      ipfsCid: `bafybeiaction${sha256(dataHash).substring(0, 16)}`,
      signature: sha256(`sig-verifier-${blockHash}`),
    };

    passport.blocks.push(newBlock);

    // Recompute Merkle root for all blocks
    const blockHashes = passport.blocks.map((b) => b.blockHash);
    passport.merkleRootHash = calculateMerkleRoot(blockHashes);
    passport.isTamperVerified = this.verifyChainIntegrity(passport.blocks);

    await passport.save();
    return newBlock;
  }

  /**
   * Validates cryptographic consistency across all blocks
   */
  static verifyChainIntegrity(blocks) {
    if (!blocks || blocks.length === 0) return false;

    for (let i = 1; i < blocks.length; i++) {
      const current = blocks[i];
      const previous = blocks[i - 1];

      if (current.previousHash !== previous.blockHash) {
        return false;
      }

      const calculatedDataHash = sha256(current.details);
      if (calculatedDataHash !== current.dataHash) {
        return false;
      }
    }
    return true;
  }

  /**
   * Generates public verification summary for buyers, banks, and insurers
   */
  static async getVerificationSummary(passportId) {
    const passport = await CropPassport.findOne({ passportId })
      .populate('farmer', 'name email phone')
      .populate('farm', 'name locationName coordinates totalAreaAcres soilType')
      .populate('cropCycle');

    if (!passport) return null;

    const isValid = this.verifyChainIntegrity(passport.blocks);

    return {
      passportId: passport.passportId,
      cropName: passport.cropName,
      variety: passport.variety,
      season: passport.season,
      status: passport.status,
      isAuthentic: isValid,
      totalVerifiedMilestones: passport.blocks.length,
      merkleRootHash: passport.merkleRootHash,
      genesisBlockHash: passport.blocks[0]?.blockHash,
      latestBlockHash: passport.blocks[passport.blocks.length - 1]?.blockHash,
      timeline: passport.blocks.map((b) => ({
        index: b.index,
        timestamp: b.timestamp,
        eventType: b.eventType,
        title: b.eventTitle,
        details: b.details,
        verifiedBy: b.verifiedBy,
        ipfsCid: b.ipfsCid,
        blockHash: b.blockHash,
      })),
      farmDetails: passport.farm,
      farmerDetails: {
        name: passport.farmer?.name,
        contact: passport.farmer?.phone,
      },
    };
  }
}

module.exports = BlockchainService;
