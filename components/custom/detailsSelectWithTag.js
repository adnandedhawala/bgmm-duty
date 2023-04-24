/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable unicorn/no-nested-ternary */
import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Select, Tag, Tooltip } from "antd";
import { useMemo, useState } from "react";

const getOptionLabel = label => {
  if (typeof label === "string") return label.split("_").join(" ");
  return label.name;
};

export const DetailsSelectWithTag = ({
  dataIndex,
  value,
  label,
  tooltip,
  options,
  getTagColor,
  isMultiple,
  isEditable,
  initializeEditValue,
  clickSubmit,
}) => {
  const tagColor = useMemo(
    () => (typeof value === "string" ? getTagColor(value) : "default"),
    [value]
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const setEditMode = () => {
    const initValue = value
      ? typeof value === "string"
        ? value
        : isMultiple
        ? value.map(tagData => tagData._id)
        : options.find(option => option._id === value._id)?._id
      : "";
    initializeEditValue(dataIndex, initValue);
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
              message: "please select " + label,
            },
          ]}
        >
          {isMultiple ? (
            <Select autoFocus mode="multiple" size="middle" options={options} />
          ) : (
            <Select
              size="middle"
              autoFocus
              options={options.map(option => {
                if (typeof option === "string")
                  return {
                    label: getOptionLabel(option),
                    value: option,
                  };
                return { ...option };
              })}
            />
          )}
        </Form.Item>
      ) : (
        <div>
          {value ? (
            isMultiple ? (
              value.length > 0 ? (
                value.map(tag => (
                  <Tag color={tag.color || "#cccccc"} key={tag._id}>
                    {tag.name}
                  </Tag>
                ))
              ) : (
                <span> - </span>
              )
            ) : (
              <Tag color={tagColor}>{getOptionLabel(value)}</Tag>
            )
          ) : (
            <span>-</span>
          )}
        </div>
      )}
    </div>
  );
};
