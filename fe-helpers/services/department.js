import {
  getApiUrl,
  getApplicationJsonHeader,
  getAuthHeader,
  handleResponse,
} from "fe-helpers/utlis";

export const getDepartmentList = () => {
  let url = getApiUrl("department");
  return fetch(url, {
    method: "GET",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
  }).then(handleResponse);
};

export const deleteDepartment = id => {
  let url = getApiUrl("department") + "/" + id;
  return fetch(url, {
    method: "DELETE",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
  }).then(handleResponse);
};

export const addDepartment = data => {
  let url = getApiUrl("department");
  return fetch(url, {
    method: "POST",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
    body: JSON.stringify({ data }),
  }).then(handleResponse);
};

export const editDepartment = (id, data) => {
  let url = getApiUrl("department") + "/" + id;
  return fetch(url, {
    method: "PATCH",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
    body: JSON.stringify({ data }),
  }).then(handleResponse);
};
