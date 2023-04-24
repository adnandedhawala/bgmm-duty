/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable unicorn/no-nested-ternary */
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Form, Select, Tag, Tooltip } from "antd";
import { useState } from "react";

export const DetailsUsers = ({
  dataIndex,
  value,
  options,
  label,
  tooltip,
  isEditable,
  initializeEditValue,
  clickSubmit,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const setEditMode = () => {
    initializeEditValue(
      dataIndex,
      value.map(option => option._id)
    );
    setIsEditMode(true);
  };
  const handleClick = () => {
    clickSubmit(() => {
      setIsEditMode(false);
    });
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center mb-2">
        <h3 className="text-md text-primary font-semibold capitalize mr-2">
          {label}
        </h3>
        {isEditable && !isEditMode ? (
          <Tooltip className="cursor-pointer" title={tooltip}>
            <EditOutlined onClick={setEditMode} />
          </Tooltip>
        ) : null}
        {isEditable && isEditMode ? (
          <>
            <Button
              size="small"
              className="ml-auto"
              onClick={() => setIsEditMode(false)}
            >
              cancel
            </Button>
            <Button
              size="small"
              className="ml-2"
              type="primary"
              onClick={handleClick}
            >
              save
            </Button>
          </>
        ) : null}
      </div>

      {isEditMode ? (
        <Form.Item
          className="mb-0"
          name={dataIndex}
          rules={[
            {
              required: false,
              message: "please select " + label,
            },
          ]}
        >
          <Select autoFocus mode="multiple" size="middle" options={options} />
        </Form.Item>
      ) : (
        <div>
          {value && value.length > 0 ? (
            value.map(user => (
              <Card
                className="mb-2"
                key={user._id}
                bodyStyle={{ padding: "10px" }}
              >
                <div className="flex items-center mb-2">
                  <Avatar
                    size="small"
                    className="mr-2"
                    icon={<UserOutlined />}
                  />
                  <span className="text-sm font-light">{user.name}</span>
                </div>

                <div className="mt-2 flex flex-col text-xs font-light">
                  <div className="mb-2">
                    <Tag className="text-xs">
                      {user.user_role.split("_").join(" ")}
                    </Tag>
                    {user.department ? (
                      <Tag className="text-xs ml-2">{user.department.name}</Tag>
                    ) : null}
                  </div>
                  <div>
                    <span className="ml-auto">{user.contact}</span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <span>-</span>
          )}
        </div>
      )}
    </div>
  );
};
