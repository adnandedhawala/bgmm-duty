import { Modal } from "antd";
import { AddDepartmentForm } from "components/forms";

export const AddTagModal = ({ handleOk, handleCancel, showModal }) => {
  return (
    <Modal
      title="Add Tag"
      open={showModal}
      onCancel={handleCancel}
      okText="Add"
      footer={false}
    >
      <AddDepartmentForm handleSubmit={handleOk} />
    </Modal>
  );
};
