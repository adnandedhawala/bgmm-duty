import {
  getTaskStatsForAdmin,
  getTaskStatsPerDepartment,
} from "fe-helpers/services";

export const getTaskStatsPerDepartmentHelper = ({
  successFn,
  errorFn,
  endFn,
}) => {
  getTaskStatsPerDepartment()
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const getTaskStatsForAdminHelper = ({ successFn, errorFn, endFn }) => {
  getTaskStatsForAdmin()
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};
