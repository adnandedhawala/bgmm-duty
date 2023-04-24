import { Button, Card, message } from "antd";
import { PAGE_LIST, USER_ROLES } from "appConstants";
import { AddUserModal, UserListTable } from "components";
import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import {
  activateUserHelper,
  addUserHelper,
  deleteUserHelper,
  getDepartmentListHelper,
  getUserListHelper,
  resetPasswordHelper,
} from "fe-helpers";
import { Mainlayout } from "layouts/main";
import { useEffect, useState } from "react";

export default function UsersListPage() {
  const { resetPage, setPageTitle } = useMainLayoutContext();
  const { changeSelectedSidebarKey, toggleLoader } = useGlobalContext();
  const [userList, setUserList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [userTableLoading, setUserTableLoading] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);

  const getUserList = () => {
    setUserTableLoading(true);

    getUserListHelper({
      successFn: data => {
        setUserList(data.data);
      },
      errorFn: () => {},
      endFn: () => {
        setUserTableLoading(false);
      },
      showAll: true,
    });
  };

  const getDepartmentList = () => {
    getDepartmentListHelper({
      successFn: data => {
        setDepartmentList(data.data);
      },
      errorFn: () => {},
      endFn: () => {},
    });
  };

  const initPage = () => {
    setPageTitle("Users List");
    changeSelectedSidebarKey(PAGE_LIST.USERS);
    getUserList();
    getDepartmentList();
  };

  const deleteUser = id => {
    deleteUserHelper({
      id,
      successFn: data => {
        message.success(data);
        getUserList();
      },
      errorFn: error => {
        message.error(error);
      },
      endFn: () => {},
    });
  };

  const activateUser = id => {
    activateUserHelper({
      id,
      successFn: data => {
        message.success(data);
        getUserList();
      },
      errorFn: error => {
        message.error(error);
      },
      endFn: () => {},
    });
  };

  const addUser = (data, form) => {
    addUserHelper({
      data: {
        ...data,
        contact: "+91" + data.contact,
        password: "sms515253",
      },
      successFn: data => {
        message.success(data);
        form.resetFields();
        setShowAddUser(false);
        getUserList();
      },
      errorFn: error => {
        message.error(error);
      },
      endFn: () => {},
    });
  };

  const resetUserPassword = userId => {
    toggleLoader(true);
    resetPasswordHelper({
      userId,
      successFn: data => {
        message.success(data);
      },
      errorFn: error => {
        message.error(error);
      },
      endFn: () => {
        toggleLoader(false);
      },
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
      <Card>
        <div className="flex justify-end mb-4">
          <Button onClick={() => setShowAddUser(true)} type="primary">
            Add User
          </Button>
        </div>
        <UserListTable
          data={userList.map((value, index) => ({
            ...value,
            index: index + 1,
            key: value._id,
          }))}
          handleDelete={deleteUser}
          activateUser={activateUser}
          resetUserPassword={resetUserPassword}
          loading={userTableLoading}
        />
      </Card>
      {showAddUser ? (
        <AddUserModal
          showModal={showAddUser}
          handleCancel={() => setShowAddUser(false)}
          handleOk={addUser}
          departmentList={departmentList}
        />
      ) : null}
    </>
  );
}

UsersListPage.PageLayout = Mainlayout;

export async function getServerSideProps() {
  return {
    props: { access: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN] }, // will be passed to the page component as props
  };
}
