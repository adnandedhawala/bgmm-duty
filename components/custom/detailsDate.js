/* eslint-disable jsx-a11y/no-autofocus */
import { EditOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Tooltip } from "antd";
import moment from "moment";
import { useState } from "react";

export const DetailsDate = ({
  dataIndex,
  label,
  tooltip,
  value,
  isEditable,
  initializeEditValue,
  clickSubmit,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const setEditMode = () => {
    initializeEditValue(dataIndex, null);
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
              type: "object",
              required: true,
              message: "Please select date",
            },
          ]}
        >
          <DatePicker autoFocus format="DD/MM/YYYY" size="middle" />
        </Form.Item>
      ) : (
        <p className="text-lg font-light">
          {value ? moment(value).format("DD MMMM, YYYY") : "-"}
        </p>
      )}
    </div>
  );
};
