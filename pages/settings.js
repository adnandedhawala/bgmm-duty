import { Button, Col, message, Row } from "antd";
import { PAGE_LIST, USER_ROLES } from "appConstants";
import {
  AddDepartmentModal,
  AddTagModal,
  CardWithTable,
  DepartmentListTable,
  TagListTable,
} from "components";
import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import {
  addDepartmentHelper,
  addTagHelper,
  deleteDepartmentHelper,
  deleteTagHelper,
  editDepartmentHelper,
  editTagHelper,
  getDepartmentListHelper,
  getTagListHelper,
} from "fe-helpers";
import { Mainlayout } from "layouts/main";
import { useEffect, useState } from "react";

export default function Settings() {
  const { resetPage, setPageTitle } = useMainLayoutContext();
  const { changeSelectedSidebarKey } = useGlobalContext();
  const [departmentList, setDepartmentList] = useState([]);
  const [departmentTableLoading, setDepartmentTableLoading] = useState(false);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [tagList, setTagList] = useState([]);
  const [showAddTag, setShowAddTag] = useState(false);
  const [tagTableLoading, setTagTableLoading] = useState(false);

  const getDepartmentList = () => {
    setDepartmentTableLoading(true);

    getDepartmentListHelper({
      successFn: data => {
        setDepartmentList(data.data);
      },
      errorFn: () => {},
      endFn: () => {
        setDepartmentTableLoading(false);
      },
    });
  };

  const getTagList = () => {
    setTagTableLoading(true);

    getTagListHelper({
      successFn: data => {
        setTagList(data.data);
      },
      errorFn: () => {},
      endFn: () => {
        setTagTableLoading(false);
      },
    });
  };

  const initPage = () => {
    setPageTitle("Settings");
    changeSelectedSidebarKey(PAGE_LIST.SETTINGS);
    getDepartmentList();
    getTagList();
  };

  const deleteDepartment = id => {
    deleteDepartmentHelper({
      id,
      successFn: data => {
        message.success(data);
        getDepartmentList();
      },
      errorFn: () => {},
      endFn: () => {},
    });
  };

  const editDepartment = (id, data, onSuccess) => {
    editDepartmentHelper({
      data,
      id,
      successFn: () => {
        onSuccess();
        getDepartmentList();
      },
      errorFn: () => {},
      endFn: () => {},
    });
  };

  const addDepartment = (data, form) => {
    addDepartmentHelper({
      successFn: responseData => {
        message.success(responseData);
        form.resetFields();
        setShowAddDepartment(false);
        getDepartmentList();
      },
      errorFn: error => {
        message.error(error);
      },
      endFn: () => {},
      data,
    });
  };

  const deleteTag = id => {
    deleteTagHelper({
      id,
      successFn: data => {
        message.success(data);
        getTagList();
      },
      errorFn: () => {},
      endFn: () => {},
    });
  };

  const editTag = (id, data, onSuccess) => {
    editTagHelper({
      data,
      id,
      successFn: () => {
        onSuccess();
        getTagList();
      },
      errorFn: () => {},
      endFn: () => {},
    });
  };

  const addTag = (data, form) => {
    addTagHelper({
      successFn: responseData => {
        message.success(responseData);
        form.resetFields();
        setShowAddTag(false);
        getTagList();
      },
      errorFn: error => {
        message.error(error);
      },
      endFn: () => {},
      data,
    });
  };

  useEffect(() => {
    initPage();
    return () => {
      resetPage();
    };
  }, []);

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} xl={8}>
          <CardWithTable
            title="Department table"
            tableComponent={DepartmentListTable}
            extra={
              <Button onClick={() => setShowAddDepartment(true)} type="primary">
                Add
              </Button>
            }
            tableProps={{
              data: departmentList.map((value, index) => ({
                ...value,
                index: index + 1,
                key: value._id,
              })),
              loading: departmentTableLoading,
              handleDelete: deleteDepartment,
              handleEdit: editDepartment,
            }}
          />
        </Col>
        <Col xs={24} md={12}>
          <CardWithTable
            title="Tags table"
            tableComponent={TagListTable}
            extra={
              <Button onClick={() => setShowAddTag(true)} type="primary">
                Add
              </Button>
            }
            tableProps={{
              data: tagList.map((value, index) => ({
                ...value,
                index: index + 1,
                key: value._id,
              })),
              loading: tagTableLoading,
              handleDelete: deleteTag,
              handleEdit: editTag,
            }}
          />
        </Col>
      </Row>
      {showAddDepartment ? (
        <AddDepartmentModal
          showModal={showAddDepartment}
          handleCancel={() => setShowAddDepartment(false)}
          handleOk={addDepartment}
        />
      ) : null}
      {showAddTag ? (
        <AddTagModal
          showModal={showAddTag}
          handleCancel={() => setShowAddTag(false)}
          handleOk={addTag}
        />
      ) : null}
    </>
  );
}

Settings.PageLayout = Mainlayout;

export async function getServerSideProps() {
  return {
    props: { access: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN] }, // will be passed to the page component as props
  };
}
