import {
  clearAuthToken,
  getApiUrl,
  getApplicationJsonHeader,
  getAuthHeader,
  getAuthToken,
  handleResponse,
  handleVerifyUser,
} from "fe-helpers/utlis";

export const login = loginInfo => {
  return fetch(getApiUrl("login"), {
    method: "POST",
    headers: {
      ...getApplicationJsonHeader(),
    },
    body: JSON.stringify({ data: loginInfo }),
  }).then(handleResponse);
};

export const logout = () => {
  clearAuthToken();
};

export const verifyUser = async () => {
  const accessToken = getAuthToken();
  if (!accessToken) throw "access token not found!";
  return fetch(getApiUrl("verify"), {
    method: "POST",
    headers: {
      ...getApplicationJsonHeader(),
    },
    body: JSON.stringify({ data: accessToken }),
  }).then(handleVerifyUser);
};

export const changePassword = async ({ userId, password, newPassword }) => {
  let url = getApiUrl("auth") + "/" + userId + "/changePassword";
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
    body: JSON.stringify({ data: { password, newPassword } }),
  });
  return handleResponse(response);
};

export const resetPassword = async ({ userId }) => {
  let url = getApiUrl("auth") + "/" + userId + "/resetPassword";
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
  });
  return handleResponse(response);
};
