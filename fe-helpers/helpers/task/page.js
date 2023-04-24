import { TASK_STATUS } from "appConstants";
import {
  createTask,
  deleteTask,
  editTask,
  getTask,
  getTaskList,
} from "fe-helpers/services";
import { getDefaultTaskFields } from "fe-helpers/utlis";
import moment from "moment";

export const getTaskListHelper = ({
  pageParams,
  successFn,
  errorFn,
  endFn,
}) => {
  getTaskList(pageParams)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const getTaskHelper = ({ taskId, successFn, errorFn, endFn }) => {
  getTask(taskId)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const createTaskHelper = ({
  values,
  userData,
  successFn,
  errorFn,
  endFn,
}) => {
  createTask({
    ...values,
    status: TASK_STATUS.DRAFT,
    logs: [
      {
        created_by: userData._id,
        created_on: moment(new Date()),
        description:
          "Task is created by " +
          userData.name +
          " on " +
          moment(new Date()).format("DD-MM-YYYY hh:mm:ss A"),
      },
    ],
    ...getDefaultTaskFields(userData),
  })
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const editTaskHelper = ({
  values,
  taskId,
  userData,
  successFn,
  errorFn,
  endFn,
}) => {
  const defaultDatabaseFields = getDefaultTaskFields(userData);
  editTask(taskId, {
    ...values,
    updated_by: defaultDatabaseFields.updated_by,
    updated_on: defaultDatabaseFields.updated_on,
  })
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const deleteTaskHelper = ({ taskId, successFn, errorFn, endFn }) => {
  deleteTask(taskId)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};
