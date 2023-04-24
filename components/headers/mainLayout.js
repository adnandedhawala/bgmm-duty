import { Avatar, Button, Layout, Popover, Tag, Tooltip } from "antd";
import { MenuUnfoldOutlined, LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { logout } from "fe-helpers";
const { Header } = Layout;

export const MainLayoutHeader = ({
  toggleMenu,
  pageTitle,
  handleBack,
  showBack,
  userData,
}) => {
  const router = useRouter();
  const handleMenuButtonClick = () => {
    toggleMenu();
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Header className="w-full fixed top-0 left-0 flex items-center !px-8 z-10 !bg-[#1E293B]">
      <div className="w-full flex items-center">
        <Button
          className="bg-white p-0 flex items-center justify-center !text-lg"
          icon={<MenuUnfoldOutlined size={24} />}
          onClick={handleMenuButtonClick}
        />
        <h3 className="text-white ml-8 text-2xl font-medium">
          {showBack ? (
            <Tooltip title="Go Back">
              <LeftOutlined
                onClick={handleBack}
                className="mr-2 hover:cursor-pointer"
              />
            </Tooltip>
          ) : null}

          {pageTitle}
        </h3>
        <div className="ml-auto flex items-center">
          <Popover
            placement="bottomRight"
            content={
              <div>
                <p className="mb-2 text-lg">{userData.name}</p>
                <Tag className="mb-2">{userData.user_role}</Tag>
                <p className="mb-4 text-sm">
                  {userData.department ? userData.department.name : ""}
                </p>
                <Button onClick={handleLogout} size="small" type="primary">
                  Logout
                </Button>
              </div>
            }
          >
            <Avatar className="bg-gray-400" size={40}>
              {userData.user_role}
            </Avatar>
          </Popover>
        </div>
      </div>
    </Header>
  );
};
