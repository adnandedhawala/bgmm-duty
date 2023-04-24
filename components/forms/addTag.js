import { Button, Form, Input } from "antd";

export const AddTagForm = ({ handleSubmit }) => {
  const [form] = Form.useForm();
  const onFinish = values => {
    handleSubmit(values, form);
  };
  return (
    <Form
      name="addTag"
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      form={form}
    >
      <Form.Item
        label={<span>Name</span>}
        name="name"
        rules={[
          {
            required: true,
            message: "Please enter name!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item className="text-center">
        <Button
          className="mt-8 w-full uppercase"
          type="primary"
          htmlType="submit"
        >
          Add
        </Button>
      </Form.Item>
    </Form>
  );
};
