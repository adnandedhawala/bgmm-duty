import { Divider, Drawer, Menu } from "antd";
import { PAGE_LIST, USER_ROLES } from "appConstants";
import { useGlobalContext } from "context/global";
import { useRouter } from "next/router";
import { logout } from "fe-helpers";

const getItem = (label, key, icon, children, type) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
};

export const MainLayoutSidebar = ({
  showSidebarMenu,
  handleClose,
  userRole,
}) => {
  const { selectedSidebarKey, changeSelectedSidebarKey } = useGlobalContext();
  const router = useRouter();

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case PAGE_LIST.LOGOUT: {
        logout();
        router.push("/");
        break;
      }

      case PAGE_LIST.TASK_LIST: {
        router.push("/task/list");
        handleClose();
        break;
      }

      case PAGE_LIST.DASHBOARD: {
        router.push("/dashboard");
        handleClose();
        break;
      }

      case PAGE_LIST.PROFILE: {
        router.push("/profile");
        handleClose();
        break;
      }

      case PAGE_LIST.USERS: {
        router.push("/users");
        handleClose();
        break;
      }

      case PAGE_LIST.SETTINGS: {
        router.push("/settings");
        handleClose();
        break;
      }

      default: {
        changeSelectedSidebarKey(key.toString());
        break;
      }
    }
  };

  const menuItems = [
    getItem("Dashboard", PAGE_LIST.DASHBOARD),
    getItem("Settings", PAGE_LIST.SETTINGS),
    getItem("Users", PAGE_LIST.USERS),
    getItem("Task List", PAGE_LIST.TASK_LIST),
    getItem("Profile", PAGE_LIST.PROFILE),
    getItem("Logout", PAGE_LIST.LOGOUT),
  ];

  const getMenuItemsBasedOnRoles = () => {
    if (![USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(userRole)) {
      return menuItems.filter(
        value => !["Dashboard", "Settings", "Users"].includes(value.label)
      );
    }
    return menuItems;
  };

  return (
    <Drawer
      width={250}
      className="sidebar"
      placement="left"
      onClose={handleClose}
      closable={false}
      open={showSidebarMenu}
    >
      <div className="px-6 pt-6">
        <h1 className="text-3xl text-center">LOGO</h1>
        <Divider />
      </div>
      <Menu
        onClick={handleMenuClick}
        theme="light"
        mode="inline"
        selectedKeys={[selectedSidebarKey]}
        items={getMenuItemsBasedOnRoles()}
      />
    </Drawer>
  );
};
