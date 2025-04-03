import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'http://localhost:3000'; 

export const register = (username, password) =>
    axios.post(`${API_BASE}/register`, { username, password });

export const login = (username, password) =>
    axios.post(`${API_BASE}/login`, { username, password });

export const increment = async () => {
    const token = await AsyncStorage.getItem('token');
    return axios.post(`${API_BASE}/increment`, { token });
};

export const getMe = async () => {
    const token = await AsyncStorage.getItem('token');
    return axios.get(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

export const getLeaderboard = () =>
    axios.get(`${API_BASE}/leaderboard`);