import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

// Request interceptor to attach JWT token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('crop_guardian_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const loginApi = (data) => API.post('/auth/login', data);
export const registerApi = (data) => API.post('/auth/register', data);
export const getMeApi = () => API.get('/auth/me');
export const togglePremiumApi = () => API.post('/auth/toggle-premium');
export const getDemoAccountsApi = () => API.get('/auth/demo-accounts');

// Farms & Crops
export const getFarmsApi = () => API.get('/farms');
export const createFarmApi = (data) => API.post('/farms', data);
export const getFarmByIdApi = (id) => API.get(`/farms/${id}`);
export const getCropCyclesApi = () => API.get('/crop-cycles');
export const createCropCycleApi = (data) => API.post('/crop-cycles', data);
export const getCropCycleByIdApi = (id) => API.get(`/crop-cycles/${id}`);
export const logSoilRecordApi = (cycleId, data) => API.post(`/crop-cycles/${cycleId}/soil`, data);

// Weather & AI Risk
export const getWeatherApi = (farmId) => API.get(`/weather/farm/${farmId}`);
export const getLatestRiskApi = (cycleId) => API.get(`/ai-risk/${cycleId}`);
export const recalculateRiskApi = (cycleId) => API.post(`/ai-risk/${cycleId}/recalculate`);
export const getAlertsApi = () => API.get('/ai-risk/alerts');
export const resolveAlertApi = (id) => API.put(`/ai-risk/alerts/${id}/resolve`);

// Disease Vision Scanner
export const scanDiseaseImageApi = (formData) =>
  API.post('/disease-detection/scan', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const getDiseaseHistoryApi = (cycleId) =>
  API.get('/disease-detection/history', { params: { cropCycleId: cycleId } });

// Historical & Financials
export const getHistoricalComparisonApi = (cycleId) => API.get(`/historical/comparison/${cycleId}`);
export const getHistoricalSeasonsApi = () => API.get('/historical/seasons');
export const getFinancialsApi = (cycleId) => API.get('/financials', { params: { cropCycleId: cycleId } });
export const recordFinancialsApi = (data) => API.post('/financials', data);

// What-If Simulator
export const runSimulationApi = (data) => API.post('/simulator/compare', data);

// Specialist Consultations
export const getSpecialistsApi = () => API.get('/consultations/specialists');
export const getConsultationsApi = () => API.get('/consultations');
export const getConsultationByIdApi = (id) => API.get(`/consultations/${id}`);
export const requestConsultationApi = (data) => API.post('/consultations', data);
export const sendConsultationMessageApi = (id, message) => API.post(`/consultations/${id}/messages`, { message });
export const prescribeAdviceApi = (id, data) => API.post(`/consultations/${id}/prescribe`, data);

// Blockchain Crop Passport
export const getPassportByCycleApi = (cycleId) => API.get(`/passport/cycle/${cycleId}`);
export const verifyPublicPassportApi = (passportId) => API.get(`/passport/verify/${passportId}`);
export const addPassportBlockApi = (passportId, data) => API.post(`/passport/${passportId}/block`, data);

// Admin Portal
export const getAdminAnalyticsApi = () => API.get('/admin/analytics');
export const getAdminUsersApi = (params) => API.get('/admin/users', { params });
export const updateUserByAdminApi = (id, data) => API.put(`/admin/users/${id}`, data);
export const verifySpecialistApi = (id, isVerified) => API.put(`/admin/specialists/${id}/verify`, { isVerified });
export const broadcastEmergencyAlertApi = (data) => API.post('/admin/broadcast-alert', data);
export const getAdminBlockchainLedgerApi = () => API.get('/admin/blockchain-ledger');
export const getAdminAuditLogsApi = () => API.get('/admin/audit-logs');

export default API;
