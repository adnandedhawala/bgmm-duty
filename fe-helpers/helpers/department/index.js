import {
  addDepartment,
  deleteDepartment,
  editDepartment,
  getDepartmentList,
} from "fe-helpers";

export const getDepartmentListHelper = async ({
  successFn,
  errorFn,
  endFn,
}) => {
  await getDepartmentList()
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const deleteDepartmentHelper = async ({
  successFn,
  errorFn,
  endFn,
  id,
}) => {
  await deleteDepartment(id)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const editDepartmentHelper = async ({
  successFn,
  errorFn,
  endFn,
  id,
  data,
}) => {
  await editDepartment(id, data)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const addDepartmentHelper = async ({
  successFn,
  errorFn,
  endFn,
  data,
}) => {
  await addDepartment(data)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};
