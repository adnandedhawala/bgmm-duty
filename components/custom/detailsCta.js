/* eslint-disable sonarjs/cognitive-complexity */
import { Button, Tooltip } from "antd";
import {
  CheckSquareTwoTone,
  CloseSquareTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import { TASK_STATUS, USER_ROLES } from "appConstants";

const checkUserRoleInArray = (array = [], userRole) => {
  return array.some(element => element.user_role === userRole);
};

const checkUserInArray = (array = [], id) => {
  return array.some(element => element._id === id);
};

export const DetailsCta = ({
  userData,
  status,
  approvedBy,
  approveTask,
  markTaskCompletedOrClosed,
  deleteTask,
  removeApproval,
}) => {
  if ([USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(userData.user_role)) {
    return (
      <div className="flex items-center">
        {status === TASK_STATUS.IN_REVIEW &&
        !checkUserRoleInArray(approvedBy, USER_ROLES.ADMIN) &&
        !checkUserRoleInArray(approvedBy, USER_ROLES.SUPER_ADMIN) ? (
          <Button
            size="small"
            onClick={approveTask}
            className="mr-2"
            type="link"
          >
            Approve
          </Button>
        ) : null}
        {status === TASK_STATUS.IN_REVIEW &&
        checkUserInArray(approvedBy, userData._id) ? (
          <Button size="small" onClick={removeApproval} type="link">
            Remove Approval
          </Button>
        ) : null}
        {[TASK_STATUS.CLOSED, TASK_STATUS.COMPLETED].includes(status) ? null : (
          <>
            <Tooltip title="mark task as completed">
              <CheckSquareTwoTone
                onClick={() => markTaskCompletedOrClosed(TASK_STATUS.COMPLETED)}
                twoToneColor="#52c41a"
                className="mr-2 text-2xl"
              />
            </Tooltip>
            <Tooltip title="mark task as closed">
              <CloseSquareTwoTone
                onClick={() => markTaskCompletedOrClosed(TASK_STATUS.CLOSED)}
                twoToneColor="#FF4D4E"
                className="text-2xl mr-2"
              />
            </Tooltip>
          </>
        )}
        <Tooltip title="delete task">
          <DeleteTwoTone
            onClick={deleteTask}
            twoToneColor="#888888"
            className="text-2xl"
          />
        </Tooltip>
      </div>
    );
  }

  if ([USER_ROLES.HOD].includes(userData.user_role)) {
    return (
      <div className="flex items-center">
        {status === TASK_STATUS.IN_REVIEW &&
        !checkUserRoleInArray(approvedBy, USER_ROLES.HOD) &&
        !checkUserRoleInArray(approvedBy, USER_ROLES.ADMIN) &&
        !checkUserRoleInArray(approvedBy, USER_ROLES.SUPER_ADMIN) ? (
          <Button
            size="small"
            onClick={approveTask}
            className="mr-2"
            type="link"
          >
            Approve
          </Button>
        ) : null}
        {status === TASK_STATUS.IN_REVIEW &&
        checkUserInArray(approvedBy, userData._id) ? (
          <Button size="small" onClick={removeApproval} type="link">
            Remove Approval
          </Button>
        ) : null}
      </div>
    );
  }

  return null;
};
