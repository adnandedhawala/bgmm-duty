export const saveAuthToken = token => {
  localStorage.setItem("bmt_user", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("bmt_user");
};

export const clearAuthToken = () => {
  localStorage.removeItem("bmt_user");
};

export const getAuthHeader = () => {
  const accessToken = localStorage.getItem("bmt_user");
  return { authorization: accessToken };
};

export const getApplicationJsonHeader = () => ({
  "Content-Type": "application/json",
});
