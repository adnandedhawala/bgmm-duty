/* eslint-disable unicorn/no-nested-ternary */
import { Tag } from "antd";
import { RISK_PRIORITY, TASK_STATUS, USER_ROLES } from "appConstants";
import { RichText } from "components";
import { getTaskStatusColor, getRiskPriorityColor } from "fe-helpers/utlis";
import moment from "moment";

export const getTaskTableColumns = ({ actions, userData, departmentList }) => {
  const { openTask } = actions;
  const columns = [
    {
      title: "Id",
      dataIndex: "task_id",
      key: "task_id",
      sorter: (a, b) => {
        return (
          Number(a.task_id.split("-")[1]) - Number(b.task_id.split("-")[1])
        );
      },
      render: (text, value) => (
        <Tag className=" cursor-pointer" onClick={() => openTask(value._id)}>
          {text}
        </Tag>
      ),
      fixed: "left",
      width: 100,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: text => (text ? <Tag>{text.name}</Tag> : "-"),
      filters: departmentList.map(value => ({
        text: value.name,
        value: value._id,
      })),
      onFilter: (value, record) => record.department?._id === value,
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: status => (
        <Tag color={getTaskStatusColor(status)}>
          {status.split("_").join(" ")}
        </Tag>
      ),
      width: 150,
      filters: Object.values(TASK_STATUS).map(value => ({
        text: value.split("_").join(" "),
        value,
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Risk Rating",
      dataIndex: "risk_rating",
      key: "risk_rating",
      render: status => (
        <Tag color={getRiskPriorityColor(status)}>{status}</Tag>
      ),
      filters: Object.values(RISK_PRIORITY).map(value => ({
        text: value.split("_").join(" "),
        value,
      })),
      onFilter: (value, record) => record.risk_rating === value,
      width: 150,
    },
    {
      title: "Is Overdue",
      dataIndex: "target_date",
      key: "target_date",
      render: (date, record) =>
        record.status === TASK_STATUS.IN_PROGRESS &&
        date &&
        moment(date).isBefore(new Date(), "days")
          ? "yes"
          : "no",
      filters: ["yes", "no"].map(value => ({
        text: value,
        value: value === "yes",
      })),
      onFilter: (value, record) =>
        record.status === TASK_STATUS.IN_PROGRESS &&
        moment(record.target_date).isBefore(new Date(), "days") === value,
      width: 120,
    },
    {
      title: "Target Date",
      dataIndex: "target_date",
      key: "target_date",
      render: date =>
        date ? <span>{moment(date).format("DD-MM-YYYY")}</span> : "-",
      width: 150,
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      render: owner => (
        <div className="flex flex-col">
          {owner.map(value => (
            <p className="mb-2" key={value._id}>
              {value.name}
            </p>
          ))}
        </div>
      ),
      width: 200,
    },
    {
      title: "Is Pending HOD Approval",
      dataIndex: "hod_approval",
      key: "hod_approval",
      render: (_, record) => {
        return record.status === TASK_STATUS.IN_REVIEW
          ? record.is_approved_hod
            ? "no"
            : "yes"
          : "-";
      },
      filters: ["yes", "no"].map(value => ({
        text: value,
        value: value === "yes",
      })),
      onFilter: (value, record) =>
        record.status === TASK_STATUS.IN_REVIEW &&
        record.is_approved_hod === !value,
      width: 120,
    },
    {
      title: "Is Pending Admin Approval",
      dataIndex: "admin_approval",
      key: "admin_approval",
      render: (_, record) => {
        return record.status === TASK_STATUS.IN_REVIEW
          ? record.is_approved_hod
            ? "yes"
            : "no"
          : "-";
      },
      filters: ["yes", "no"].map(value => ({
        text: value,
        value: value === "yes",
      })),
      onFilter: (value, record) =>
        record.status === TASK_STATUS.IN_REVIEW &&
        record.is_approved_hod === value,
      width: 120,
    },
    {
      title: "Findings",
      dataIndex: "finding",
      key: "finding",
      width: 300,
      render: text => (text ? <RichText value={text} /> : "-"),
    },
    {
      title: "Management response",
      dataIndex: "management_response",
      key: "management_response",
      width: 300,
      render: text => (text ? <RichText value={text} /> : "-"),
    },
    {
      title: "Action Items",
      dataIndex: "action_items",
      key: "action_items",
      width: 300,
      render: text => (text ? <RichText value={text} /> : "-"),
    },
  ];

  return columns.filter(value =>
    [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(userData.user_role)
      ? true
      : value.dataIndex !== "department"
  );
};
