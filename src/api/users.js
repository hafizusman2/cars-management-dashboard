import axiosClient from './axiosClient';

export const userApi = {
  register(data) {
    const url = '/user/register';
    return axiosClient.post(url, data);
  },

  getMe() {
    const url = '/user/me';
    return axiosClient.get(url);
  },

  getStats() {
    const url = '/stats';
    return axiosClient.get(url);
  },
};
