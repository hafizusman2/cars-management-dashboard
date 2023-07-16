import axiosClient from './axiosClient';

export const categoriesApi = {
  add({ name }) {
    const url = '/car-categories';
    return axiosClient.post(url, { name });
  },

  getCategoryById(id) {
    const url = '/car-categories/' + id;
    return axiosClient.get(url);
  },

  getAll() {
    const url = '/car-categories';
    return axiosClient.get(url);
  },
  updateCategoryById({ id, name }) {
    const url = '/car-categories/' + id;
    return axiosClient.patch(url, { name });
  },
  delete(id) {
    const url = '/car-categories/' + id;
    return axiosClient.delete(url);
  },
};
