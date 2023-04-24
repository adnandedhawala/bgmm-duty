import { Button, Form, Input, Select } from "antd";
import { USER_ROLES } from "appConstants";

export const AddUserForm = ({ handleSubmit, departmentList = [] }) => {
  const [form] = Form.useForm();
  const userRole = Form.useWatch("user_role", form);
  const onFinish = values => {
    handleSubmit(values, form);
  };
  return (
    <Form
      name="login"
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      form={form}
      requiredMark={false}
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
      <Form.Item
        label={<span>Email</span>}
        name="email"
        rules={[
          {
            required: true,
            message: "Please enter email!",
          },
          {
            type: "email",
            message: "Please enter a valid email",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={<span>Contact</span>}
        name="contact"
        rules={[
          {
            required: true,
            message: "Please enter contact number!",
          },
          {
            pattern: /^\d{10}$/,
            message: "Please enter a valid number",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="user_role"
        label="User Role"
        rules={[
          {
            required: true,
            message: "Please select user role!",
          },
        ]}
      >
        <Select placeholder="Select user role">
          {Object.values(USER_ROLES)
            .filter(value => value !== USER_ROLES.SUPER_ADMIN)
            .map(value => (
              <Select.Option key={value} value={value}>
                {value}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>

      {[USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(userRole) ? null : (
        <Form.Item
          name="department"
          label="Department"
          rules={[
            {
              required: true,
              message: "Please select department!",
            },
          ]}
        >
          <Select placeholder="Select a department">
            {departmentList.map(value => (
              <Select.Option key={value._id} value={value._id}>
                {value.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      )}

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
