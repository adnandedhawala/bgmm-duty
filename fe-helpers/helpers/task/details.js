/* eslint-disable security/detect-object-injection */
import { TASK_STATUS, USER_ROLES } from "appConstants";
import { capitalizeFirstLetter } from "fe-helpers/utlis";
import moment from "moment";
import { taskDetailsConfig } from "./config";

const wasChangedTo = " was changed to ";

export const detailsRenderer = config => {
  const { component: Component, ...properties } = config;
  if (!Component) return <div key={properties.key}>{properties.key}</div>;
  return <Component {...properties}></Component>;
};

export const getDetailsElements = ({ taskList, parent }) => {
  return taskList
    .filter(value => value.parent === parent)
    .sort((a, b) => a.order - b.order)
    .map(config => (
      <div className="mb-4" key={config.key}>
        {detailsRenderer(config)}
      </div>
    ));
};

export const createLogByKey = (key, values, created_by) => {
  const formattedKey = key.split("_").join(" ");
  let description = "";
  switch (key) {
    case "title": {
      description = capitalizeFirstLetter(
        formattedKey + wasChangedTo + values[key]
      );
      break;
    }

    case "remarks": {
      description = "New remark was added";
      break;
    }

    case "risk_rating":
    case "status": {
      description =
        capitalizeFirstLetter(formattedKey) + wasChangedTo + values[key];
      break;
    }

    case "target_date": {
      description =
        capitalizeFirstLetter(formattedKey) +
        wasChangedTo +
        moment(values[key]).format("DD/MM/YYYY");
      break;
    }

    case "approved_by": {
      description = "Task is approved";
      break;
    }

    case "revoked_by": {
      description = "Approval for the task is revoked";
      break;
    }

    default: {
      description = capitalizeFirstLetter(formattedKey) + " was updated";
      break;
    }
  }
  return {
    description,
    created_on: moment(new Date()),
    created_by: created_by,
  };
};

export const getStatusOptions = user_role => {
  const statusArray = Object.values(TASK_STATUS);
  return [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN].includes(user_role)
    ? statusArray.filter(
        value => ![TASK_STATUS.CLOSED, TASK_STATUS.COMPLETED].includes(value)
      )
    : statusArray.filter(value =>
        [TASK_STATUS.IN_PROGRESS, TASK_STATUS.IN_REVIEW].includes(value)
      );
};

export const getIsEditable = ({
  isEditable,
  canBeEditedBy,
  userRole,
  currentStatus,
  approvedBy,
}) => {
  let canEditBasedOnStatus = true;
  let canEditBasedOnApprovedBy = true;
  if (
    userRole === USER_ROLES.MEMBER &&
    ![TASK_STATUS.IN_PROGRESS].includes(currentStatus)
  ) {
    canEditBasedOnStatus = false;
  }

  if (
    userRole === USER_ROLES.HOD &&
    ![TASK_STATUS.IN_PROGRESS, TASK_STATUS.IN_REVIEW].includes(currentStatus)
  ) {
    canEditBasedOnStatus = false;
  }

  if (
    userRole === USER_ROLES.HOD &&
    approvedBy
      .map(value => value.user_role)
      .some(role =>
        [USER_ROLES.HOD, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(
          role
        )
      )
  ) {
    canEditBasedOnApprovedBy = false;
  }

  return (
    isEditable &&
    canBeEditedBy &&
    canBeEditedBy.includes(userRole) &&
    canEditBasedOnStatus &&
    canEditBasedOnApprovedBy
  );
};

export const checkIsTaskPageReadyBasedOnUser = ({
  user_role,
  isDepartmentListReady,
  isUserListReady,
  isTagListReady,
}) => {
  if (
    [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(user_role) &&
    (!isDepartmentListReady || !isUserListReady || !isTagListReady)
  ) {
    return false;
  }

  return !([USER_ROLES.HOD].includes(user_role) && !isUserListReady);
};

export const setTaskDetails = ({
  clickSubmit,
  initializeEditValue,
  currentTask,
  userData,
  userList,
  tagList,
  departmentList,
}) => {
  return taskDetailsConfig.map(details => {
    let returnObject = {
      ...details,
      clickSubmit: clickSubmit,
      initializeEditValue: initializeEditValue,
      value: currentTask[details.key],
      isEditable: getIsEditable({
        isEditable: details.isEditable,
        canBeEditedBy: details.canBeEditedBy,
        userRole: userData.user_role,
        currentStatus: currentTask.status,
        approvedBy: currentTask.approved_by,
      }),
    };
    if (details.dataIndex === "status") {
      returnObject.options = getStatusOptions(userData.user_role);
    }
    if (details.dataIndex === "owner") {
      const userDataList = [...userList];
      returnObject.options = userDataList.map(user => ({
        ...user,
        value: user._id,
        label: user.name,
      }));
    }
    if (details.dataIndex === "department") {
      returnObject.options = departmentList.map(department => ({
        ...department,
        value: department._id,
        label: department.name,
      }));
    }
    if (details.dataIndex === "tags") {
      returnObject.options = tagList.map(tag => ({
        ...tag,
        value: tag._id,
        label: tag.name,
      }));
    }
    return returnObject;
  });
};

export const setIsTimeVisible = ({ status }) => {
  return [TASK_STATUS.IN_PROGRESS, TASK_STATUS.IN_REVIEW].includes(status);
};
