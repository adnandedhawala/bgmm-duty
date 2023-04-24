import {
  getApiUrl,
  getApplicationJsonHeader,
  getAuthHeader,
  handleResponse,
} from "fe-helpers/utlis";

export const createTask = async taskDetails => {
  const response = await fetch(getApiUrl("task"), {
    method: "POST",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
    body: JSON.stringify({ data: taskDetails }),
  });
  return handleResponse(response);
};

export const editTask = async (taskId, taskDetails) => {
  let url = getApiUrl("task") + "/" + taskId;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
    body: JSON.stringify({ data: taskDetails }),
  });
  return handleResponse(response);
};

export const getTaskList = async pageParameters => {
  let url = getApiUrl("task");
  if (pageParameters) {
    url =
      url +
      "?page=" +
      pageParameters.page +
      "&page_size=" +
      pageParameters.page_size;
  }
  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
  });
  return handleResponse(response);
};

export const getTask = async id => {
  let url = getApiUrl("task") + "/" + id;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...getApplicationJsonHeader(),
      ...getAuthHeader(),
    },
  });
  return handleResponse(response);
};

export const deleteTask = async id => {
  let url = getApiUrl("task") + "/" + id;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
  });
  return handleResponse(response);
};
