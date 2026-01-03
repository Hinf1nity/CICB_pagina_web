export const decodeJWT = (token: string) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  return !decoded?.exp || decoded.exp * 1000 < Date.now();
};
