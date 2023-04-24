import {
  getApiUrl,
  getApplicationJsonHeader,
  getAuthHeader,
  handleResponse,
} from "fe-helpers/utlis";

export const getTagList = () => {
  let url = getApiUrl("tag");
  return fetch(url, {
    method: "GET",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
  }).then(handleResponse);
};

export const deleteTag = id => {
  let url = getApiUrl("tag") + "/" + id;
  return fetch(url, {
    method: "DELETE",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
  }).then(handleResponse);
};

export const addTag = data => {
  let url = getApiUrl("tag");
  return fetch(url, {
    method: "POST",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
    body: JSON.stringify({ data }),
  }).then(handleResponse);
};

export const editTag = (id, data) => {
  let url = getApiUrl("tag") + "/" + id;
  return fetch(url, {
    method: "PATCH",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
    body: JSON.stringify({ data }),
  }).then(handleResponse);
};
