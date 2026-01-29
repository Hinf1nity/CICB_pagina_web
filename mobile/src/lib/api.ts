import ky from 'ky';

export const api = ky.create({
  prefixUrl: 'https://697ad05c0e6ff62c3c5a2dc1.mockapi.io/api',
});