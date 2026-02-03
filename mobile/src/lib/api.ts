import ky from 'ky';

export const api = ky.create({
  prefixUrl: `http://${process.env.EXPO_PUBLIC_API_URL}:8000/api`,
});