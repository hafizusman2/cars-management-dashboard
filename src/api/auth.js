import axiosClient from './axiosClient';
import { storeToken } from '../utils/authUtils';
import { userApi } from './users';
import { getToken } from '../utils/authUtils';

export const authApi = {
  async login(data) {
    const url = '/auth';
    const res = await axiosClient.post(url, data);
    // also store token
    storeToken(res.data.data.token);
    return res;
  },
};

// Check if the user is authenticated
export const isAuthenticated = async () => {
  const token = await getToken();
  if (!token) {
    return false;
  }
  const user = await userApi.getMe();
  return user.data.data ? true : false;
};
