import { Modal } from "antd";
import { CreateTaskForm } from "components/forms/createTask";

export const AddTaskModal = ({
  handleOk,
  handleCancel,
  showAddTaskModal,
  disableSubmit,
}) => {
  return (
    <Modal
      title="create Task"
      open={showAddTaskModal}
      onCancel={handleCancel}
      okText="Add"
      footer={false}
    >
      <CreateTaskForm disableSubmit={disableSubmit} onFinish={handleOk} />
    </Modal>
  );
};
