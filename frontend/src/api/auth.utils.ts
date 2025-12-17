export const decodeJWT = (token: string) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeJWT(token);
  if (!decoded?.exp) return true;
  // console.log('Token expiration in hours, minutes and seconds:', new Date(decoded.exp * 1000).toISOString().substr(11, 8));
  // console.log('Current time in hours, minutes and seconds:', new Date().toISOString().substr(11, 8));
  return decoded.exp * 1000 < Date.now();
};