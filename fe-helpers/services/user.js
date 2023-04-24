import {
  getApiUrl,
  getApplicationJsonHeader,
  getAuthHeader,
  handleResponse,
} from "fe-helpers/utlis";

export const getUserList = showAll => {
  let url = getApiUrl("user");
  let finalUrl = showAll ? url + "?showAll=true" : url;
  return fetch(finalUrl, {
    method: "GET",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
  }).then(handleResponse);
};

export const addUser = data => {
  let url = getApiUrl("user");
  return fetch(url, {
    method: "POST",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
    body: JSON.stringify({ data }),
  }).then(handleResponse);
};

export const deleteUser = id => {
  let url = getApiUrl("user") + "/" + id;
  return fetch(url, {
    method: "DELETE",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
  }).then(handleResponse);
};

export const editUser = (id, data) => {
  let url = getApiUrl("user") + "/" + id;
  return fetch(url, {
    method: "PUT",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
    body: JSON.stringify({ data }),
  }).then(handleResponse);
};
