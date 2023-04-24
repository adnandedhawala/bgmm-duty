import { Card, Divider, message } from "antd";
import { LoginForm } from "components";
import { SignInLayout } from "layouts/signIn";
import { login, saveAuthToken, verifyUser } from "fe-helpers";
import { useGlobalContext } from "context/global";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const { toggleLoader } = useGlobalContext();
  const router = useRouter();

  const redirectBasedOnUser = () => {
    router.push("/task/list");
  };

  const handleLogin = (values, form) => {
    toggleLoader(true);
    login(values)
      .then(response => {
        saveAuthToken(response.data);
        message.success("Logged in successfully!");
        form.resetFields();
        redirectBasedOnUser();
      })
      .catch(error => {
        message.error(error);
      })
      .finally(() => {
        toggleLoader(false);
      });
  };

  useEffect(() => {
    verifyUser()
      .then(user => {
        if (user.user_role) redirectBasedOnUser();
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  }, []);

  return (
    <Card className="w-full sm:w-10/12 md:w-8/12 lg:w-5/12">
      <h1 className="text-6xl text-center">LOGO</h1>
      <Divider className="text-gray-800" />
      <LoginForm handleSubmit={handleLogin} />
    </Card>
  );
}

Home.PageLayout = SignInLayout;
