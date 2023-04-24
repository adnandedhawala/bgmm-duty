/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable jsx-a11y/no-autofocus */
import { Button, Card, Empty, Form, Input, Tag } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export const DetailsLogs = ({
  dataIndex,
  value,
  label,
  isEditable,
  addBtnText,
  initializeEditValue,
  clickSubmit,
}) => {
  const [viewMore, setViewMore] = useState(false);
  const [showViewMore, setShowViewMore] = useState(false);
  const toggleViewMore = () => setViewMore(!viewMore);

  const [isEditMode, setIsEditMode] = useState(false);
  const setEditMode = () => {
    initializeEditValue(dataIndex, "");
    setIsEditMode(true);
  };

  const handleClick = () => {
    clickSubmit(() => {
      setIsEditMode(false);
    });
  };

  useEffect(() => {
    setShowViewMore(value && value.length > 1);
  }, [value]);
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center mb-2">
        <h3 className="text-md text-primary font-semibold capitalize mr-2">
          {label}
        </h3>
        {isEditable && !isEditMode ? (
          <Button
            onClick={setEditMode}
            size="small"
            className="ml-auto"
            type="primary"
          >
            {addBtnText || "add"}
          </Button>
        ) : null}
        {isEditMode ? null : showViewMore ? (
          <Button
            onClick={toggleViewMore}
            size="small"
            className={isEditable ? "ml-2" : "ml-auto"}
            type="link"
          >
            {viewMore ? "view less" : "view more"}
          </Button>
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
          className="mb-2"
          name={dataIndex}
          rules={[
            {
              required: true,
              message: "Please enter " + label,
            },
            { min: 3, message: label + " should have min 3 characters" },
          ]}
        >
          <Input autoFocus />
        </Form.Item>
      ) : null}

      {Array.isArray(value) && value.length > 0 ? (
        value
          .sort((a, b) =>
            viewMore
              ? moment(a.created_on).valueOf() - moment(b.created_on).valueOf()
              : moment(b.created_on).valueOf() - moment(a.created_on).valueOf()
          )
          .filter((_, index) => (viewMore ? true : index < 1))
          .map(log => (
            <Card
              className="mb-2"
              bodyStyle={{ padding: "10px" }}
              key={log._id}
            >
              <h3>{log.description}</h3>
              <div className="mt-2 flex items-center text-xs justify-between">
                <div>
                  <span className="mr-1">{log.created_by.name}</span>
                  <Tag className="text-xs">
                    {log.created_by.user_role.split("_").join(" ")}
                  </Tag>
                </div>
                <span>
                  {moment(log.created_on).format("DD-MM-YYYY hh:mm:ss A")}
                </span>
              </div>
            </Card>
          ))
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={String("no " + label).toLowerCase()}
        />
      )}
    </div>
  );
};
