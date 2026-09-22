import axios from 'axios';

const API_BASE_URL = 'https://diabetes-pattern-recognition.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const getHealth = async () => {
  const res = await apiClient.get('/health');
  return res.data;
};

export const getDatasetSummary = async () => {
  const res = await apiClient.get('/dataset-summary');
  return res.data;
};

export const getDatasetAnalysis = async () => {
  const res = await apiClient.get('/dataset-analysis');
  return res.data;
};

export const getModels = async () => {
  const res = await apiClient.get('/models');
  return res.data;
};

export const getPerformance = async () => {
  const res = await apiClient.get('/performance');
  return res.data;
};

export const getConfusionMatrix = async (modelKey) => {
  const res = await apiClient.get(`/confusion-matrix/${modelKey}`);
  return res.data;
};

export const getFeatureImportance = async () => {
  const res = await apiClient.get('/feature-importance');
  return res.data;
};

export const getCorrelationMatrix = async () => {
  const res = await apiClient.get('/correlation');
  return res.data;
};

export const predictDiabetes = async (payload) => {
  const res = await apiClient.post('/predict', payload);
  return res.data;
};

export const triggerRetrain = async () => {
  const res = await apiClient.post('/train');
  return res.data;
};

export default apiClient;
