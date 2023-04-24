import { Alert } from "antd";
import { TASK_STATUS, USER_ROLES } from "appConstants";

export const DetailsAlert = ({ status, approvedBy }) => {
  const getAlertType = () => {
    if (status === TASK_STATUS.IN_REVIEW) {
      if (
        approvedBy.length === 2 ||
        approvedBy
          .map(value => value.user_role)
          .some(role =>
            [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(role)
          )
      )
        return "info";
      return "warning";
    }
    if (status === TASK_STATUS.COMPLETED) return "success";
    if (status === TASK_STATUS.CLOSED) return "error";
    return "info";
  };

  const getAlertTitle = () => {
    if (status === TASK_STATUS.IN_REVIEW) {
      if (approvedBy.length < 2) {
        if (
          approvedBy
            .map(value => value.user_role)
            .some(role =>
              [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(role)
            )
        ) {
          return "Task can be marked as completed";
        }
        return "Task is awaiting approval";
      }
      return "Task can be marked as completed";
    }
    if (status === TASK_STATUS.COMPLETED) return "Task is marked COMPLETED";
    if (status === TASK_STATUS.CLOSED) return "Task is marked CLOSED";
    return "";
  };

  const getAlertDescription = () => {
    if (status === TASK_STATUS.IN_REVIEW && approvedBy.length === 0)
      return "Approvals pending from HOD and ADMIN";
    if (status === TASK_STATUS.IN_REVIEW && approvedBy.length === 1) {
      return approvedBy[0].user_role === USER_ROLES.HOD
        ? "To be Approved By ADMIN"
        : "";
    }
    if (status === TASK_STATUS.IN_REVIEW && approvedBy.length === 2)
      return (
        "This task is Approved by " +
        approvedBy.map(value => value.user_role).join(", ")
      );
    return "";
  };

  if (
    [TASK_STATUS.IN_REVIEW, TASK_STATUS.CLOSED, TASK_STATUS.COMPLETED].includes(
      status
    )
  ) {
    return (
      <Alert
        message={getAlertTitle()}
        description={getAlertDescription()}
        type={getAlertType()}
        showIcon
        className="mb-6"
      />
    );
  }

  return null;
};
