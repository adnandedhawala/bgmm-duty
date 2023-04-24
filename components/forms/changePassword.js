import { Button, Form, Input } from "antd";

export const ChangePasswordForm = ({ handleSubmit }) => {
  const [form] = Form.useForm();
  const onFinish = values => {
    handleSubmit(values, form);
  };
  return (
    <Form
      name="changePassword"
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      form={form}
    >
      <Form.Item
        name="oldPassword"
        label="Old Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="password"
        label="New Password"
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
          { min: 8, message: "Password should be minimum 8 characters" },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={["password"]}
        hasFeedback
        rules={[
          {
            required: true,
            message: "Please confirm your password!",
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Password entered here does not match new Password!")
              );
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item className="text-center">
        <Button
          className="mt-8 w-full uppercase"
          type="primary"
          htmlType="submit"
        >
          Change Password
        </Button>
      </Form.Item>
    </Form>
  );
};
