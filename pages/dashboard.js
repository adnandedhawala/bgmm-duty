/* eslint-disable unicorn/no-nested-ternary */
import { Col, Row } from "antd";
import { useMainLayoutContext } from "context/mainLayout";
import { Mainlayout } from "layouts/main";
import { useEffect, useState } from "react";
import {
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
  getRiskPriorityColor,
  getTaskStatsForAdminHelper,
  getTaskStatsPerDepartmentHelper,
  getTaskStatusColor,
} from "fe-helpers";
import { useGlobalContext } from "context/global";
import { find } from "lodash";
import {
  CarryOutTwoTone,
  HourglassTwoTone,
  WarningOutlined,
} from "@ant-design/icons";
import { TaskStatsStackedBarCard } from "components/cards/taskStatsStackedBar";
export default function Dashboard() {
  const [taskStats, setTaskStats] = useState({});
  const [taskStatsPerDepartment, setTaskStatsPerDepartment] = useState([]);

  const { setPageTitle, resetPage, isPageLoaded } = useMainLayoutContext();
  const { toggleLoader, changeSelectedSidebarKey } = useGlobalContext();

  const getTaskStats = () => {
    getTaskStatsForAdminHelper({
      successFn: data => {
        setTaskStats(data.data[0]);
        getTaskStatsPerDepartmentHelper({
          successFn: data => {
            setTaskStatsPerDepartment(data.data);
          },
          errorFn: () => {},
          endFn: () => {
            toggleLoader(false);
          },
        });
      },
      errorFn: () => {},
      endFn: () => {},
    });
  };

  const initPage = () => {
    toggleLoader(true);

    setPageTitle("Dashboard");
    changeSelectedSidebarKey(PAGE_LIST.DASHBOARD);

    getTaskStats();
  };

  useEffect(() => {
    if (isPageLoaded) initPage();
  }, [isPageLoaded]);

  useEffect(() => {
    return () => {
      resetPage();
    };
  }, []);

  return (
    <>
      <Row className="mb-6" gutter={[24, 24]}>
        <Col xs={12} md={8} xl={6}>
          <TaskListStatsCard
            value={taskStats?.total || 0}
            title="Total Tasks"
            icon={<CarryOutTwoTone />}
          />
        </Col>
        <Col xs={12} md={8} xl={6}>
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
        <Col xs={12} md={8} xl={6}>
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
        <Col xs={12} md={8} xl={6}>
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

        <Col xs={24} md={12} xl={12}>
          <TaskStatsDonutCard
            chartHeight={200}
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
        <Col xs={24} md={12} xl={12}>
          <TaskStatsBarCard
            chartHeight={200}
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
        <Col xs={24}>
          <TaskStatsStackedBarCard
            chartHeight={300}
            chartTitle="Department wise Status"
            labels={taskStatsPerDepartment.map(value => value._id)}
            chartData={taskStatsPerDepartment}
            legendTitle="Status"
          />
        </Col>
        <Col xs={24} md={12} xl={12}>
          <TaskStatsBarCard
            chartHeight={200}
            labels={taskStatsPerDepartment.map(value => value._id)}
            colorArray={taskStatsPerDepartment.map(() => "#ff6484")}
            chartData={taskStatsPerDepartment.map(value =>
              find(value.counts, { status: "OVERDUE" })
                ? find(value.counts, { status: "OVERDUE" }).count
                : 0
            )}
            chartTitle="Overdue Tasks"
          />
        </Col>
      </Row>
    </>
  );
}

Dashboard.PageLayout = Mainlayout;

export async function getServerSideProps() {
  return {
    props: { access: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN] }, // will be passed to the page component as props
  };
}
