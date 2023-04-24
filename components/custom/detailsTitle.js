import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, Tooltip } from "antd";
import { useState } from "react";

export const DetailsTitle = ({
  dataIndex,
  value,
  label,
  tooltip,
  isEditable,
  initializeEditValue,
  clickSubmit,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const setEditMode = () => {
    initializeEditValue(dataIndex, value);
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
              required: true,
              message: "Please enter title",
            },
            { min: 3, message: "title should have min 3 characters" },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
      ) : (
        <p className="text-3xl">{value}</p>
      )}
    </div>
  );
};
