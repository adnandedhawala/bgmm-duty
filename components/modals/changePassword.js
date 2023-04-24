import { Modal } from "antd";
import { ChangePasswordForm } from "components";

export const ChangePasswordModal = ({ handleOk, handleCancel, showModal }) => {
  return (
    <Modal
      title="Change Password"
      open={showModal}
      onCancel={handleCancel}
      footer={false}
    >
      <ChangePasswordForm handleSubmit={handleOk} />
    </Modal>
  );
};
