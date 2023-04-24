import { Modal } from "antd";
import { AddDepartmentForm } from "components/forms";

export const AddDepartmentModal = ({ handleOk, handleCancel, showModal }) => {
  return (
    <Modal
      title="Add Department"
      open={showModal}
      onCancel={handleCancel}
      okText="Add"
      footer={false}
    >
      <AddDepartmentForm handleSubmit={handleOk} />
    </Modal>
  );
};
