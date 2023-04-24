import { Alert } from "antd";
import moment from "moment";

export const TimeAlert = ({ time, unit, isVisible }) => {
  const diff = moment(time).diff(moment(), unit);
  const getAlertType = () => {
    if (diff < 10) return "error";
    if (diff > 10 && diff < 30) return "warning";
    return "info";
  };

  const getAlertTitle = () => {
    return diff > 0
      ? diff + " " + unit + " to complete the task"
      : "The task was to be completed " + Math.abs(diff) + " " + unit + " ago";
  };

  return isVisible ? (
    <Alert
      message={getAlertTitle()}
      type={getAlertType()}
      showIcon
      className="mb-6"
    />
  ) : null;
};
