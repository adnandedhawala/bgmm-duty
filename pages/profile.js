import { useEffect, useState } from "react";
import { PAGE_LIST, USER_ROLES } from "appConstants";
import { Mainlayout } from "layouts/main";
import { useMainLayoutContext } from "context/mainLayout";
import { useGlobalContext } from "context/global";
import { Avatar, Button, Card, message, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ChangePasswordModal } from "components";
import { changePassword } from "fe-helpers";

export default function Profile() {
  const { resetPage, setPageTitle } = useMainLayoutContext();
  const { userData, changeSelectedSidebarKey, toggleLoader } =
    useGlobalContext();

  const [showChangePasswordModal, setshowChangePasswordModal] = useState(false);

  const initPage = () => {
    setPageTitle("Profile");
    changeSelectedSidebarKey(PAGE_LIST.PROFILE);
  };

  const showChangePassword = () => {
    setshowChangePasswordModal(true);
  };

  const handleChangePassword = (values, form) => {
    toggleLoader(true);
    changePassword({
      userId: userData._id,
      password: values.oldPassword,
      newPassword: values.password,
    })
      .then(() => {
        message.success("Password changed successfully");
        form.resetFields();
        setshowChangePasswordModal(false);
      })
      .catch(error => {
        message.error(error);
      })
      .finally(() => {
        toggleLoader(false);
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
      <Card className="mt-16 relative md:w-9/12 xl:w-6/12 mx-auto">
        <Avatar
          className="absolute bg-slate-400 top-0 left-1/2 translate-x-[-50%] translate-y-[-50%]"
          size={100}
          icon={<UserOutlined />}
        />
        <div className="mt-10 flex flex-col items-center">
          <h2 className="text-3xl mb-2">{userData.name}</h2>
          <p className="text-lg text-gray-500 mb-2">
            Role : <Tag>{userData.user_role}</Tag>
          </p>
          <p className="text-lg text-gray-500 mb-2">{userData.email}</p>
          <p className="text-lg text-gray-500 mb-2">{userData.contact}</p>
          <div className="text-lg text-gray-500 mb-2">
            <Button onClick={showChangePassword} size="large" type="primary">
              Change Password
            </Button>
          </div>
        </div>
      </Card>
      {showChangePasswordModal ? (
        <ChangePasswordModal
          handleOk={handleChangePassword}
          handleCancel={() => setshowChangePasswordModal(false)}
          showModal={showChangePassword}
        />
      ) : null}
    </>
  );
}

Profile.PageLayout = Mainlayout;

export async function getServerSideProps() {
  return {
    props: { access: Object.values(USER_ROLES) }, // will be passed to the page component as props
  };
}
