import {
  getApiUrl,
  getApplicationJsonHeader,
  getAuthHeader,
  handleResponse,
} from "fe-helpers/utlis";

export const getTaskStatsPerDepartment = () => {
  let url = getApiUrl("statsForDepartment");
  return fetch(url, {
    method: "GET",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
  }).then(handleResponse);
};

export const getTaskStatsForAdmin = () => {
  let url = getApiUrl("stats");
  return fetch(url, {
    method: "GET",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
  }).then(handleResponse);
};
