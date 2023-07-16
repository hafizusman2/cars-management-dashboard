import axiosClient from './axiosClient';

export const carsApi = {
  add(formData) {
    const url = '/car';
    return axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getCarById(id) {
    const url = '/car/' + id;
    return axiosClient.get(url);
  },

  getCarByRegNo(regNo) {
    const url = '/car/regNo/' + regNo;
    return axiosClient.get(url);
  },

  getAll(search) {
    const url = '/car' + (search ? `?search=${search}` : '');
    return axiosClient.get(url);
  },
  updateCarById(id, formData) {
    const url = '/car/' + id;
    return axiosClient.patch(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  delete(id) {
    const url = '/car/' + id;
    return axiosClient.delete(url);
  },
};
