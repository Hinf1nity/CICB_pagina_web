import ky from 'ky';

export const api = ky.create({
  prefixUrl: `${process.env.EXPO_PUBLIC_API_URL}/api`,
});

// prefixUrl: `${process.env.EXPO_PUBLIC_API_URL}/api`, http://${process.env.EXPO_PUBLIC_API_URL}:8000/api