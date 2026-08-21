import React, { useState, useEffect } from 'react';
import {
  getAdminAnalyticsApi,
  getAdminUsersApi,
  broadcastEmergencyAlertApi,
  getAdminBlockchainLedgerApi,
  getAdminAuditLogsApi,
  updateUserByAdminApi,
  verifySpecialistApi,
} from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  BarChart3,
  Users,
  Tractor,
  Sprout,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  Crown,
  Radio,
  History,
  CheckCircle2,
  Lock,
  Layers,
  Search,
  Send,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [blockchainData, setBlockchainData] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics'); // analytics | users | broadcast | blockchain | audit
  const [loading, setLoading] = useState(true);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('Emergency Pest Outbreak Alert (Yellow Rust Vector)');
  const [broadcastMessage, setBroadcastMessage] = useState(
    'Atmospheric moisture patterns show accelerated fungal spread across Punjab & Haryana. Inspect flag leaves immediately and apply protective bio-fungicide.'
  );
  const [broadcastSeverity, setBroadcastSeverity] = useState('HIGH');
  const [broadcastRegion, setBroadcastRegion] = useState('All Regions');
  const [broadcastStatus, setBroadcastStatus] = useState('');

  // User search
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const loadAllAdminData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, usersRes, bcRes, logsRes] = await Promise.all([
        getAdminAnalyticsApi(),
        getAdminUsersApi({ search: userSearch, role: roleFilter }),
        getAdminBlockchainLedgerApi(),
        getAdminAuditLogsApi(),
      ]);

      setAnalytics(analyticsRes.data.analytics);
      setUsersList(usersRes.data.users || []);
      setBlockchainData(bcRes.data);
      setAuditLogs(logsRes.data.logs || []);
    } catch (err) {
      console.error('Error loading admin platform data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, [userSearch, roleFilter]);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      const res = await broadcastEmergencyAlertApi({
        title: broadcastTitle,
        message: broadcastMessage,
        severity: broadcastSeverity,
        targetRegion: broadcastRegion,
      });
      setBroadcastStatus(res.data.message);
      setTimeout(() => setBroadcastStatus(''), 5000);
      loadAllAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error broadcasting alert');
    }
  };

  const handleToggleUserActive = async (userId, currentStatus) => {
    try {
      await updateUserByAdminApi(userId, { isActive: !currentStatus });
      loadAllAdminData();
    } catch (err) {
      alert('Error updating user');
    }
  };

  const handleTogglePremium = async (userId, currentStatus) => {
    try {
      await updateUserByAdminApi(userId, { isPremium: !currentStatus });
      loadAllAdminData();
    } catch (err) {
      alert('Error updating user premium status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const COLORS = ['#10b981', '#f59e0b', '#f97316', '#ef4444'];

  const riskPieData = [
    { name: 'LOW Risk', value: 35, color: '#10b981' },
    { name: 'MEDIUM Risk', value: 42, color: '#f59e0b' },
    { name: 'HIGH Risk', value: 18, color: '#f97316' },
    { name: 'CRITICAL Risk', value: 5, color: '#ef4444' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Title & Navigation Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">
              System Administration & Telemetry
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-bold">
              Restricted /admin
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Admin Operations Portal</h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Platform Telemetry
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'users' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            User Ops ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'broadcast' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Broadcast Alerts
          </button>
          <button
            onClick={() => setActiveTab('blockchain')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'blockchain' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Blockchain Ledger
          </button>
        </div>
      </div>

      {/* TAB 1: TELEMETRY & KPIS */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          {/* Top 6 KPI Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Total Farmers</span>
              <p className="text-2xl font-black text-white mt-1">{analytics.totalFarmers}</p>
              <span className="text-[10px] text-emerald-400 font-semibold">Active Producers</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Active Farms</span>
              <p className="text-2xl font-black text-white mt-1">{analytics.activeFarms}</p>
              <span className="text-[10px] text-slate-400">Total Fields</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Active Crop Cycles</span>
              <p className="text-2xl font-black text-white mt-1">{analytics.activeCrops}</p>
              <span className="text-[10px] text-emerald-400 font-semibold">Under AI Monitoring</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Proactive Alerts</span>
              <p className="text-2xl font-black text-amber-400 mt-1">{analytics.totalAlerts}</p>
              <span className="text-[10px] text-rose-400 font-semibold">{analytics.activeCriticalAlerts} Critical</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Specialists</span>
              <p className="text-2xl font-black text-cyan-400 mt-1">{analytics.totalSpecialists}</p>
              <span className="text-[10px] text-cyan-400 font-semibold">ICAR Verified</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase">Crop Passports</span>
              <p className="text-2xl font-black text-emerald-400 mt-1">{analytics.totalBlockchainPassports}</p>
              <span className="text-[10px] text-slate-400 font-semibold">SHA-256 Stamped</span>
            </div>
          </div>

          {/* Regional Risk Pattern & Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 glass-panel p-6 rounded-3xl">
              <h3 className="font-extrabold text-base text-white mb-4">Regional Crop-Risk Matrix & Telemetry</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 font-bold">
                    <tr>
                      <th className="pb-3">Agricultural Region</th>
                      <th className="pb-3">Active Farms</th>
                      <th className="pb-3">Primary Crop</th>
                      <th className="pb-3">Calculated Risk Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200 font-medium">
                    {analytics.regionalDistribution?.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3 font-bold text-white">{r.region}</td>
                        <td className="py-3">{r.activeFarms}</td>
                        <td className="py-3 text-emerald-400">{r.primaryCrop}</td>
                        <td className="py-3 font-bold text-amber-400">{r.avgRisk}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4 glass-panel p-6 rounded-3xl flex flex-col items-center justify-center">
              <h3 className="font-extrabold text-sm text-white mb-2">Platform Risk Index Distribution</h3>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                    >
                      {riskPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] w-full text-center mt-2">
                <span className="text-emerald-400">● 35% Low</span>
                <span className="text-amber-400">● 42% Medium</span>
                <span className="text-orange-400">● 18% High</span>
                <span className="text-red-400">● 5% Critical</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-white">Registered Farmers & Specialists</h3>
              <p className="text-xs text-slate-400">Manage account permissions, premium subscriptions, and verification</p>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              >
                <option value="all">All Roles</option>
                <option value="farmer">Farmers</option>
                <option value="specialist">Specialists</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-bold">
                <tr>
                  <th className="pb-3">Name & Email</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Tier</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3">
                      <p className="font-bold text-white">{u.name}</p>
                      <p className="text-[11px] text-slate-400">{u.email}</p>
                    </td>
                    <td className="py-3">
                      <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[11px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        onClick={() => handleTogglePremium(u._id, u.isPremium)}
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          u.isPremium ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {u.isPremium ? '★ PRO MEMBER' : 'FREE TIER'}
                      </button>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          u.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleToggleUserActive(u._id, u.isActive)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-semibold"
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BROADCAST ALERTS */}
      {activeTab === 'broadcast' && (
        <div className="glass-panel p-6 rounded-3xl max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-purple-400 font-extrabold text-base mb-2">
            <Radio className="w-5 h-5" />
            <span>Platform Emergency Broadcast Dispatcher</span>
          </div>
          <p className="text-xs text-slate-400">
            Dispatch urgent agricultural warnings directly to all farmer dashboards and mobile endpoints simultaneously.
          </p>

          {broadcastStatus && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{broadcastStatus}</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Broadcast Alert Title</label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Severity Level</label>
                <select
                  value={broadcastSeverity}
                  onChange={(e) => setBroadcastSeverity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Target Geographic Zone</label>
                <input
                  type="text"
                  value={broadcastRegion}
                  onChange={(e) => setBroadcastRegion(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Alert Directives & Instructions</label>
              <textarea
                rows="4"
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all hover:scale-[1.02]"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Emergency Warning to All Farmers</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: BLOCKCHAIN LEDGER */}
      {activeTab === 'blockchain' && blockchainData && (
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-white">Global Blockchain Audit Ledger</h3>
              <p className="text-xs text-slate-400">
                {blockchainData.totalPassports} Active Passports · {blockchainData.totalMinedBlocks} Total Cryptographic Blocks
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              <span>SHA-256 Ledger Verified</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-bold">
                <tr>
                  <th className="pb-3">Block #</th>
                  <th className="pb-3">Passport & Crop</th>
                  <th className="pb-3">Event Title</th>
                  <th className="pb-3">Validator Node</th>
                  <th className="pb-3">SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200 font-mono text-[11px]">
                {blockchainData.recentBlocks?.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 font-bold text-emerald-400">#{b.index}</td>
                    <td className="py-3 font-sans">
                      <p className="font-bold text-white">{b.cropName}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{b.passportId}</p>
                    </td>
                    <td className="py-3 font-sans text-slate-200">{b.eventTitle}</td>
                    <td className="py-3 font-sans text-slate-400">{b.verifiedBy}</td>
                    <td className="py-3 text-emerald-400 truncate max-w-[200px]">{b.blockHash}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
