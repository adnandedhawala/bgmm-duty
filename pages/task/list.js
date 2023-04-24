/* eslint-disable unicorn/no-nested-ternary */
import { Button, Card, Col, message, Row, Table } from "antd";
import { useMainLayoutContext } from "context/mainLayout";
import { Mainlayout } from "layouts/main";
import { useEffect, useMemo, useState } from "react";
import {
  AddTaskModal,
  TaskListStatsCard,
  TaskStatsBarCard,
  TaskStatsDonutCard,
} from "components";
import {
  PAGE_LIST,
  RISK_PRIORITY,
  TASK_STATUS,
  USER_ROLES,
} from "appConstants";
import {
  createTaskHelper,
  getDepartmentListHelper,
  getRiskPriorityColor,
  getTaskListHelper,
  getTaskStatsPerDepartmentHelper,
  getTaskStatusColor,
  getTaskTableColumns,
} from "fe-helpers";
import { useGlobalContext } from "context/global";
import { useRouter } from "next/router";
import { useTaskContext } from "context/task";
import { useWindowDimensions } from "hooks/useWindowDimensions";
import { find } from "lodash";
import {
  CarryOutTwoTone,
  HourglassTwoTone,
  WarningOutlined,
} from "@ant-design/icons";
export default function TaskList() {
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [taskStats, setTaskStats] = useState({});
  // const [areStatsLoaded, setAreStatsLoaded] = useState(false);

  const { setPageTitle, resetPage, isPageLoaded } = useMainLayoutContext();
  const { userData, toggleLoader, changeSelectedSidebarKey } =
    useGlobalContext();
  const { loading, taskList, setTaskList, setLoading, resetTaskList } =
    useTaskContext();
  const { height } = useWindowDimensions();
  const router = useRouter();
  const tableColumns = useMemo(() => {
    const actions = {
      openTask: id => {
        router.push("/task/" + id);
      },
    };
    return getTaskTableColumns({ actions, userData, departmentList });
  }, [departmentList]);

  const createNewTask = (values, form) => {
    setLoading(true);
    setIsSubmitDisabled(true);
    createTaskHelper({
      values,
      userData,
      successFn: data => {
        form.resetFields();
        setShowAddTaskModal(false);
        router.push("/task/" + data._id);
      },
      errorFn: error => {
        message.error(error);
      },
      endFn: () => {
        setLoading(false);
        setIsSubmitDisabled(false);
      },
    });
  };

  const getDepartmentList = () => {
    getDepartmentListHelper({
      successFn: data => {
        setDepartmentList(data.data);
      },
      errorFn: () => {},
      endFn: () => {},
    });
  };

  const getTaskStats = () => {
    if ([USER_ROLES.MEMBER, USER_ROLES.HOD].includes(userData.user_role)) {
      getTaskStatsPerDepartmentHelper({
        successFn: data => {
          setTaskStats(data.data[0]);
        },
        errorFn: () => {},
        endFn: () => {},
      });
    }
  };

  const initPage = () => {
    toggleLoader(true);
    getTaskListHelper({
      successFn: data => setTaskList(data.data),
      errorFn: () => {},
      endFn: () => {
        toggleLoader(false);
      },
    });
    setPageTitle("Task List");
    changeSelectedSidebarKey(PAGE_LIST.TASK_LIST);
    if (
      [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(userData.user_role)
    ) {
      getDepartmentList();
    }
    getTaskStats();
  };

  useEffect(() => {
    if (isPageLoaded) initPage();
  }, [isPageLoaded]);

  useEffect(() => {
    return () => {
      resetPage();
      resetTaskList();
    };
  }, []);

  return (
    <>
      {[USER_ROLES.HOD, USER_ROLES.MEMBER].includes(userData.user_role) ? (
        <Row className="mb-6" gutter={[24, 24]}>
          <Col xs={24} md={12} xl={6}>
            <TaskStatsDonutCard
              labels={Object.values(TASK_STATUS).map(value =>
                value.split("_").join(" ")
              )}
              colorArray={Object.values(TASK_STATUS).map(value =>
                getTaskStatusColor(value)
              )}
              chartData={Object.values(TASK_STATUS).map(value =>
                taskStats?.counts
                  ? find(taskStats.counts, { status: value })
                    ? find(taskStats.counts, { status: value }).count
                    : 0
                  : 0
              )}
              chartTitle="Task Status"
            />
          </Col>
          <Col xs={24} md={12} xl={6}>
            <TaskStatsBarCard
              labels={Object.values(RISK_PRIORITY).map(value =>
                value.split("_").join(" ")
              )}
              colorArray={Object.values(RISK_PRIORITY).map(value =>
                getRiskPriorityColor(value)
              )}
              chartData={Object.values(RISK_PRIORITY).map(value =>
                taskStats?.counts
                  ? find(taskStats.counts, { status: value })
                    ? find(taskStats.counts, { status: value }).count
                    : 0
                  : 0
              )}
              chartTitle="Risk Priority"
            />
          </Col>
          <Col xs={12} md={8} xl={6}>
            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <TaskListStatsCard
                  value={taskStats?.total || 0}
                  title="Total Tasks"
                  icon={<CarryOutTwoTone />}
                />
              </Col>
              <Col xs={24}>
                <TaskListStatsCard
                  value={
                    find(taskStats?.counts, { status: "OVERDUE" })
                      ? find(taskStats?.counts, { status: "OVERDUE" }).count
                      : 0
                  }
                  title="Task Overdue"
                  icon={<WarningOutlined className="text-red-500" />}
                />
              </Col>
            </Row>
          </Col>
          <Col xs={12} md={8} xl={6}>
            <Row gutter={[24, 24]}>
              <Col xs={24}>
                <TaskListStatsCard
                  value={
                    find(taskStats?.counts, { status: "PENDING_HOD_APPROVAL" })
                      ? find(taskStats?.counts, {
                          status: "PENDING_HOD_APPROVAL",
                        }).count
                      : 0
                  }
                  title="Pending HOD Approval"
                  icon={<HourglassTwoTone twoToneColor="#ED6937" />}
                />
              </Col>
              <Col xs={24}>
                <TaskListStatsCard
                  value={
                    find(taskStats?.counts, {
                      status: "PENDING_ADMIN_APPROVAL",
                    })
                      ? find(taskStats?.counts, {
                          status: "PENDING_ADMIN_APPROVAL",
                        }).count
                      : 0
                  }
                  title="Pending Admin Approval"
                  icon={<HourglassTwoTone twoToneColor="#ED6937" />}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      ) : null}

      <Card
        className="w-full"
        extra={
          [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(
            userData.user_role
          ) ? (
            <div className="flex items-center">
              <Button onClick={() => setShowAddTaskModal(true)} type="primary">
                Add Task
              </Button>
            </div>
          ) : null
        }
      >
        <Table
          columns={tableColumns}
          loading={loading}
          dataSource={taskList.map(value => ({ ...value, key: value._id }))}
          scroll={{ x: 100, y: height - 225 }}
          pagination={false}
          size="small"
        />
      </Card>
      {showAddTaskModal ? (
        <AddTaskModal
          handleCancel={() => setShowAddTaskModal(false)}
          handleOk={createNewTask}
          showAddTaskModal={showAddTaskModal}
          disableSubmit={isSubmitDisabled}
        />
      ) : null}
    </>
  );
}

TaskList.PageLayout = Mainlayout;

export async function getServerSideProps() {
  return {
    props: { access: Object.values(USER_ROLES) }, // will be passed to the page component as props
  };
}
