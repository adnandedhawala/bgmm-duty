import { DeleteOutlined, UserAddOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Tag, Tooltip } from "antd";
import { USER_ROLES } from "appConstants";
import { useWindowDimensions } from "hooks/useWindowDimensions";

export const UserListTable = ({
  data,
  handleDelete,
  activateUser,
  resetUserPassword,
  loading,
}) => {
  const { height } = useWindowDimensions();
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      width: 150,
    },
    {
      title: "Is Active",
      dataIndex: "is_active",
      key: "is_active",
      render: data =>
        data.toString() === "true" ? (
          <Tag color="blue">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
      width: 75,
    },
    {
      title: "User Role",
      dataIndex: "user_role",
      key: "user_role",
      render: value => (value ? <Tag>{value}</Tag> : "-"),
      width: 75,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: value => (value ? <Tag>{value.name}</Tag> : "-"),
      width: 150,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        if (
          [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(record.user_role)
        )
          return (
            <Popconfirm
              title="Are you sure ?"
              description="You are reseting password for this user!!"
              onConfirm={() => resetUserPassword(record.key)}
            >
              <Button
                className="!text-sm flex items-center justify-center"
                size="small"
              >
                Reset Password
              </Button>
            </Popconfirm>
          );

        if (record.is_active)
          return (
            <div className="flex items-center">
              <Tooltip title={"Deactivate " + record.name}>
                <Popconfirm
                  title="Are you sure ?"
                  description="You are removing this user!!"
                  onConfirm={() => handleDelete(record.key)}
                >
                  <Button
                    className="!text-sm flex items-center justify-center mr-2"
                    icon={<DeleteOutlined />}
                    size="middle"
                    danger
                  />
                </Popconfirm>
              </Tooltip>
              <Popconfirm
                title="Are you sure ?"
                description="You are reseting password for this user!!"
                onConfirm={() => resetUserPassword(record.key)}
              >
                <Button
                  className="!text-sm flex items-center justify-center"
                  size="small"
                >
                  Reset Password
                </Button>
              </Popconfirm>
            </div>
          );

        return (
          <Popconfirm
            title="Are you sure ?"
            description="You are activating this user!!"
            onConfirm={() => activateUser(record.key)}
          >
            <Button
              className="!text-sm flex items-center justify-center"
              icon={<UserAddOutlined />}
              size="middle"
            />
          </Popconfirm>
        );
      },
      width: 200,
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={false}
      size="small"
      loading={loading}
      scroll={{ y: height - 300 }}
    />
  );
};
