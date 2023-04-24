import { RISK_PRIORITY, TASK_STATUS } from "appConstants";
import { find } from "lodash";

export const getTaskStatusColor = status => {
  const statusColorArray = Object.values(TASK_STATUS).map(value => {
    let color = "";
    switch (value) {
      case TASK_STATUS.DRAFT: {
        color = "#bbbbbb";
        break;
      }

      case TASK_STATUS.IN_PROGRESS: {
        color = "#E9A74B";
        break;
      }
      case TASK_STATUS.IN_REVIEW: {
        color = "#ED6937";
        break;
      }
      case TASK_STATUS.COMPLETED: {
        color = "#22B432";
        break;
      }
      case TASK_STATUS.CLOSED: {
        color = "#B61E23";
        break;
      }

      default: {
        color = "default";
        break;
      }
    }
    return { status: value, color };
  });
  return find(statusColorArray, { status }).color;
};
export const getRiskPriorityColor = status => {
  const statusColorArray = Object.values(RISK_PRIORITY).map(value => {
    let color = "";
    switch (value) {
      case RISK_PRIORITY.HIGH: {
        color = "#F25556";
        break;
      }
      case RISK_PRIORITY.MEDIUM: {
        color = "#E99E21";
        break;
      }
      case RISK_PRIORITY.LOW: {
        color = "#4EC761";
        break;
      }
      default: {
        color = "#bbbbbb";
        break;
      }
    }
    return { status: value, color };
  });
  return find(statusColorArray, { status }).color;
};

export const getDefaultColor = () => "default";

export const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1);
