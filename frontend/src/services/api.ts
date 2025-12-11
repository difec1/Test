import axios from 'axios';
import { useAuthStore } from '../store/auth';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:1337/api',
});

client.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export const loginUser = async (identifier: string, password: string) => {
  const { data } = await client.post('/auth/local', { identifier, password });
  return data;
};

export const registerUser = async (username: string, email: string, password: string) => {
  const { data } = await client.post('/auth/local/register', { username, email, password });
  return data;
};

export const fetchGoals = async () => {
  const { data } = await client.get('/goals/user');
  return data;
};

export const createGoalFromText = async (text: string) => {
  const { data } = await client.post('/goals/fromText', { text });
  return data;
};

export const sendChat = async (history: any[], message: string) => {
  const { data } = await client.post('/chat', { history, message });
  return data;
};

export const fetchAnalysis = async () => {
  const { data } = await client.get('/analysis/summary');
  return data;
};

export const fetchTransactions = async () => {
  const { data } = await client.get('/transactions/user');
  return data;
};

export const analyzeAndCreateTransaction = async (payload: any) => {
  const { data } = await client.post('/transactions/analyzeAndCreate', payload);
  return data;
};
