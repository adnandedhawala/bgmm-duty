import { Button, Form, Input } from "antd";

export const CreateTaskForm = ({ onFinish, disableSubmit }) => {
  const [createTaskForm] = Form.useForm();

  const handleSubmit = values => {
    onFinish(values, createTaskForm);
  };

  return (
    <Form
      name="createTask"
      layout="vertical"
      onFinish={handleSubmit}
      autoComplete="off"
      form={createTaskForm}
    >
      <Form.Item
        label={<span>Title</span>}
        name="title"
        rules={[
          {
            required: true,
            message: "Please enter title!",
          },
          {
            min: 3,
            message: "title must be minimum 3 characters",
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item className="text-center">
        <Button
          className="mt-8 w-full uppercase"
          type="primary"
          htmlType="submit"
          disabled={disableSubmit}
        >
          Create Task
        </Button>
      </Form.Item>
    </Form>
  );
};
