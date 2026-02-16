import { default as axiosClient } from 'axios';
import { env } from './env';
import { storage } from './storage';

export const axios = axiosClient.create({
  baseURL: 'http://192.168.1.11:3000',
  headers: {
    Authorization: `Bearer ${storage.getString('token')}`,
    Accept: 'application/json',
  },
  timeout: 30000,
});

axios.interceptors.request.use(
  async (config) => {
    console.log('=== Axios Request ===');
    console.log('AUTHORIZATION:', config.headers?.Authorization);
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Data:', config.data);
    console.log('===================');

    return config;
  },
  (error) => {
    console.log('Axios Request Error:', error);
    return Promise.reject(error);
  }
);
