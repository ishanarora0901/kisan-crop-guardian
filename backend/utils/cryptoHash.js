const crypto = require('crypto');

/**
 * Generates SHA-256 hash of any payload or string
 */
function sha256(data) {
  const serialized = typeof data === 'object' ? JSON.stringify(data) : String(data);
  return crypto.createHash('sha256').update(serialized).digest('hex');
}

/**
 * Computes block hash given header parameters and nonce
 */
function calculateBlockHash(index, previousHash, timestamp, dataHash, nonce) {
  return sha256(`${index}-${previousHash}-${timestamp}-${dataHash}-${nonce}`);
}

/**
 * Computes Merkle Root from an array of block hashes
 */
function calculateMerkleRoot(hashes) {
  if (!hashes || hashes.length === 0) return sha256('EMPTY_MERKLE_ROOT');
  if (hashes.length === 1) return hashes[0];

  let currentLevel = [...hashes];
  while (currentLevel.length > 1) {
    const nextLevel = [];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        nextLevel.push(sha256(currentLevel[i] + currentLevel[i + 1]));
      } else {
        nextLevel.push(sha256(currentLevel[i] + currentLevel[i]));
      }
    }
    currentLevel = nextLevel;
  }
  return currentLevel[0];
}

module.exports = {
  sha256,
  calculateBlockHash,
  calculateMerkleRoot,
};
