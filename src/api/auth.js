import axiosClient from './axiosClient';
import { storeToken } from '../utils/authUtils';

export const authApi = {
  async login(data) {
    const url = '/auth';
    const res = await axiosClient.post(url, data);
    // also store token
    storeToken(res.data.data.token);
    return res;
  },
};
