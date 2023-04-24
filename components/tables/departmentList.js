import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Popconfirm, Table } from "antd";
import { useState } from "react";
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProperties
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProperties}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
export const DepartmentListTable = ({
  data,
  handleDelete,
  handleEdit,
  loading,
}) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = record => record.key === editingKey;
  const edit = record => {
    form.setFieldsValue({
      name: record.name,
      _id: record._id,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };

  const handleSubmit = values => {
    handleEdit(editingKey, values, () => {
      setEditingKey("");
    });
  };
  const columns = [
    {
      title: "name",
      dataIndex: "name",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <div className="flex items-center">
            <Button className="mr-2" onClick={() => form.submit()} type="link">
              Save
            </Button>
            <Button className="mr-2" onClick={cancel} type="text">
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <Button
              className="!text-sm flex items-center justify-center mr-2"
              onClick={() => edit(record)}
              disabled={editingKey !== ""}
              icon={<EditOutlined />}
              size="middle"
            />
            <Popconfirm
              title="Are you sure ?"
              description="You are deleting a department!!"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button
                className="!text-sm flex items-center justify-center"
                disabled={editingKey !== ""}
                icon={<DeleteOutlined />}
                size="middle"
                danger
              />
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form onFinish={handleSubmit} form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
        size="small"
        loading={loading}
        scroll={{ y: 400 }}
      />
    </Form>
  );
};
