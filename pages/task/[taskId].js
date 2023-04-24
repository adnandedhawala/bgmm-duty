import { Card, Col, Divider, Form, message, Row, Skeleton } from "antd";
import { PAGE_LIST, TASK_STATUS, USER_ROLES } from "appConstants";
import { UserLogCard } from "components";
import { TimeAlert } from "components/alerts";
import { DetailsAlert } from "components/custom/detailsAlert";
import { DetailsCta } from "components/custom/detailsCta";
import { DetailsTaskId } from "components/custom/detailsTaskId";
import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import { useTaskDetailsContext } from "context/taskDetails";
import {
  editTaskHelper,
  getDepartmentListHelper,
  getTaskHelper,
  getUserListHelper,
  createLogByKey,
  checkIsTaskPageReadyBasedOnUser,
  getDetailsElements,
  setTaskDetails,
  deleteTaskHelper,
  setIsTimeVisible,
  getTagListHelper,
} from "fe-helpers";
import { Mainlayout } from "layouts/main";
import { isEmpty } from "lodash";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
export default function TaskItem() {
  const { resetPage, setPageTitle, isPageLoaded, setShowBack } =
    useMainLayoutContext();
  const { userData, toggleLoader, changeSelectedSidebarKey } =
    useGlobalContext();
  const { currentTask, setCurrentTask, resetTaskDetails } =
    useTaskDetailsContext();
  const [taskForm] = Form.useForm();
  const router = useRouter();
  const { taskId } = router.query;

  const [task, setNewTask] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [isTaskPageReady, setIsTaskPageReady] = useState(false);
  const [isDepartmentListReady, setIsDepartmentListReady] = useState(false);
  const [isUserListReady, setIsUserListReady] = useState(false);
  const [isTagListReady, setIsTagListReady] = useState(false);

  const initPage = () => {
    getTaskHelper({
      taskId,
      successFn: async data => {
        const taskData = data.data;
        if (
          [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(
            userData.user_role
          )
        ) {
          await getDepartmentListHelper({
            successFn: departmentData => {
              setDepartmentList(departmentData.data);
              setIsDepartmentListReady(true);
            },
            errorFn: () => {},
            endFn: () => {},
          });
          await getTagListHelper({
            successFn: tagData => {
              setTagList(tagData.data);
              setIsTagListReady(true);
            },
            errorFn: () => {},
            endFn: () => {},
          });
        }
        if (userData.user_role !== USER_ROLES.MEMBER) {
          await getUserListHelper({
            successFn: userListData => {
              setUserList(
                userListData.data.filter(
                  user =>
                    ![USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(
                      user.user_role
                    )
                )
              );
              setIsUserListReady(true);
            },
            errorFn: () => {},
            endFn: () => {},
          });
        }
        setCurrentTask(taskData);
      },
      errorFn: () => {},
      endFn: () => {},
    });
    setPageTitle("");
    changeSelectedSidebarKey(PAGE_LIST.TASK_LIST);
    setShowBack(true);
  };

  const editTaskWithCallback = ({ taskDetails, callback }) => {
    editTaskHelper({
      taskId,
      userData,
      values: taskDetails,
      successFn: () => {
        getTaskHelper({
          taskId,
          successFn: data => {
            const taskData = data.data;
            setCurrentTask(taskData);
          },
          errorFn: () => {},
          endFn: () => {
            toggleLoader(false);
            if (callback) {
              callback();
            }
          },
        });
      },
      errorFn: error => {
        message.error(error);
      },
      endFn: () => {
        toggleLoader(false);
      },
    });
  };

  const clickSubmit = callback => {
    toggleLoader(true);
    taskForm
      .validateFields()
      .then(values => {
        const taskDetails = { ...values };

        if (Object.keys(values)[0] === "remarks") {
          taskDetails.remarks = {
            created_on: moment(new Date()),
            created_by: userData._id,
            description: values.remarks,
          };
        }

        if (Object.keys(values)[0] === "target_date") {
          taskDetails.target_date = moment(values.target_date.$d);
        }

        if (
          Object.keys(values)[0] === "status" &&
          ![
            TASK_STATUS.IN_REVIEW,
            TASK_STATUS.CLOSED,
            TASK_STATUS.COMPLETED,
          ].includes(taskDetails.status) &&
          userData.user_role !== USER_ROLES.MEMBER
        ) {
          taskDetails.approved_by = [];
          if (
            [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(
              userData.user_role
            )
          ) {
            taskDetails.is_approved_admin = false;
          }
          taskDetails.is_approved_hod = false;
        }

        taskDetails.logs = createLogByKey(
          Object.keys(values)[0],
          taskDetails,
          userData._id
        );

        editTaskWithCallback({ taskDetails, callback });
      })
      .catch(error => {
        if (error && error.errorFields) {
          let validationError = error.errorFields[0];
          validationError.errors.map(value => message.error(value));
        }
      })
      .finally(() => {
        toggleLoader(false);
      });
  };

  const approveTask = () => {
    toggleLoader(true);
    const approvalArray = currentTask.approved_by.map(value => value._id);
    let taskDetails = {
      approved_by: [...approvalArray, userData._id],
    };

    taskDetails.logs = createLogByKey("approved_by", taskDetails, userData._id);

    if (userData.user_role === USER_ROLES.HOD) {
      taskDetails.is_approved_hod = true;
    }
    if (
      [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(userData.user_role)
    ) {
      taskDetails.is_approved_admin = true;
    }

    editTaskWithCallback({
      taskDetails,
      callback: () => message.success("Task Approved"),
    });
  };

  const removeApproval = clearAll => {
    const approvalArray = currentTask.approved_by.map(value => value._id);

    let taskDetails = {
      approved_by: clearAll
        ? []
        : approvalArray.filter(value => value._id !== userData._id),
    };

    if (
      [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(userData.user_role)
    ) {
      taskDetails.is_approved_admin = false;
    }
    if (userData.user_role === USER_ROLES.HOD) {
      taskDetails.is_approved_hod = false;
    }

    taskDetails.logs = createLogByKey("revoked_by", taskDetails, userData._id);

    editTaskWithCallback({
      taskDetails,
      callback: () => message.success("Approval Revoked"),
    });
  };

  const markTaskCompletedOrClosed = status => {
    toggleLoader(true);
    let taskDetails = {
      status: status,
      date_of_completion: moment(new Date()),
    };

    taskDetails.logs = createLogByKey("status", taskDetails, userData._id);

    editTaskWithCallback({
      taskDetails,
      callback: () => message.success("Task is " + status),
    });
  };

  const deleteTask = () => {
    toggleLoader(true);
    deleteTaskHelper({
      taskId,
      successFn: () => {
        toggleLoader(false);
        message.success("Task Deleted SuccessFully");
        router.push("/task/list");
      },
      errorFn: error => {
        message.error(error);
      },
      endFn: () => {
        toggleLoader(false);
      },
    });
  };

  const initializeEditValue = (key, value) => {
    taskForm.setFieldValue(key, value);
  };

  useEffect(() => {
    return () => {
      resetPage();
      resetTaskDetails();
    };
  }, []);

  useEffect(() => {
    if (isPageLoaded) {
      initPage();
    }
  }, [isPageLoaded]);

  useEffect(() => {
    setIsTaskPageReady(
      checkIsTaskPageReadyBasedOnUser({
        user_role: userData.user_role,
        isDepartmentListReady,
        isUserListReady,
        isTagListReady,
      })
    );
  }, [isDepartmentListReady, isUserListReady, isTagListReady]);

  useEffect(() => {
    if (!isEmpty(currentTask) && isTaskPageReady) {
      setNewTask(
        setTaskDetails({
          departmentList,
          tagList,
          userData,
          userList,
          currentTask,
          clickSubmit,
          initializeEditValue,
        })
      );
    }
  }, [currentTask, isTaskPageReady]);

  return (
    <>
      <Form form={taskForm} name="taskDetails">
        {isTaskPageReady ? (
          <Card
            extra={
              <DetailsCta
                deleteTask={deleteTask}
                markTaskCompletedOrClosed={markTaskCompletedOrClosed}
                approveTask={approveTask}
                status={currentTask.status}
                userData={userData}
                approvedBy={currentTask.approved_by}
                removeApproval={removeApproval}
              />
            }
            title={<DetailsTaskId value={currentTask.task_id} />}
          >
            <DetailsAlert
              approvedBy={currentTask.approved_by}
              status={currentTask.status}
            />
            {[TASK_STATUS.IN_PROGRESS].includes(currentTask.status) &&
            currentTask.target_date ? (
              <TimeAlert
                time={currentTask.target_date}
                unit="days"
                isVisible={setIsTimeVisible({ status: currentTask.status })}
              />
            ) : null}

            <Row gutter={[32, 16]}>
              <Col xs={24} lg={16}>
                {getDetailsElements({ taskList: task, parent: "main" })}
              </Col>
              <Col xs={24} lg={8}>
                {getDetailsElements({ taskList: task, parent: "sidebar" })}
                {isEmpty(currentTask) ? null : (
                  <>
                    <Divider />
                    <UserLogCard
                      title="Created by"
                      name={currentTask.created_by.name}
                      userRole={currentTask.created_by.user_role}
                      time={currentTask.created_at}
                    />
                    <UserLogCard
                      title="Updated by"
                      name={currentTask.updated_by.name}
                      userRole={currentTask.updated_by.user_role}
                      time={currentTask.updated_at}
                    />
                  </>
                )}
              </Col>
            </Row>
          </Card>
        ) : (
          <Card>
            <Skeleton active />
          </Card>
        )}
      </Form>
    </>
  );
}

TaskItem.PageLayout = Mainlayout;

export async function getServerSideProps() {
  return {
    props: { access: Object.values(USER_ROLES) }, // will be passed to the page component as props
  };
}
