import axiosClient from './axiosClient';

export const userApi = {
  register(data) {
    const url = '/user/register';
    return axiosClient.post(url, data);
  },
};
