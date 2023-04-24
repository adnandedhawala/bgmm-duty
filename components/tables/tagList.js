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
              required: dataIndex === "name",
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
export const TagListTable = ({ data, handleDelete, handleEdit, loading }) => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = record => record.key === editingKey;
  const edit = record => {
    form.setFieldsValue({
      name: record.name,
      color: record.color,
      description: record.description,
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
      width: 100,
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: 100,
      editable: true,
      render: data => (
        <div
          style={{ backgroundColor: data }}
          className="w-4 h-4 m-auto border border-black border-solid "
        ></div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      editable: true,
      width: 150,
      render: value => value || "-",
    },
    {
      title: "operation",
      dataIndex: "operation",
      width: 150,
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
              description="You are deleting a tag!!"
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
