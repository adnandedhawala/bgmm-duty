import {
  addUser,
  deleteUser,
  editUser,
  getUserList,
  resetPassword,
} from "fe-helpers";

export const getUserListHelper = ({
  successFn,
  errorFn,
  endFn,
  showAll = false,
}) => {
  getUserList(showAll)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const deleteUserHelper = ({ successFn, errorFn, endFn, id }) => {
  deleteUser(id)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const activateUserHelper = ({ successFn, errorFn, endFn, id }) => {
  editUser(id, { is_active: true })
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const addUserHelper = ({ successFn, errorFn, endFn, data }) => {
  addUser(data)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const resetPasswordHelper = ({ successFn, errorFn, endFn, userId }) => {
  resetPassword({ userId })
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};
