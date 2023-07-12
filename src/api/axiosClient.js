import axios from 'axios';
import appConfig from '../config/appConfig';
import { getToken } from '../utils/authUtils';

const axiosClient = axios.create({
  baseURL: appConfig.apiUrl,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
