import { Modal } from "antd";
import { AddUserForm } from "components/forms";

export const AddUserModal = ({
  handleOk,
  handleCancel,
  showModal,
  departmentList,
}) => {
  return (
    <Modal
      title="Add User"
      open={showModal}
      onCancel={handleCancel}
      okText="Add"
      footer={false}
    >
      <AddUserForm handleSubmit={handleOk} departmentList={departmentList} />
    </Modal>
  );
};
