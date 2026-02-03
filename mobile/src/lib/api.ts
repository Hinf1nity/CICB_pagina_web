import ky from 'ky';

export const api = ky.create({
  prefixUrl: 'http://192.168.0.100:8000/api',});