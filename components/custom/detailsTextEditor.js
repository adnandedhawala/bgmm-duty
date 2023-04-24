import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Tooltip } from "antd";
import { RichText, TextEditor } from "components/inputs";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";

export const DetailsTextEditor = ({
  dataIndex,
  value,
  tooltip,
  label,
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
              message: "Please enter findings",
            },
            { min: 3, message: "findings should have min 3 characters" },
          ]}
        >
          <TextEditor />
        </Form.Item>
      ) : (
        <RichText value={value} />
      )}
    </div>
  );
};
