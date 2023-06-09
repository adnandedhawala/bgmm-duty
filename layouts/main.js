import { Card, ConfigProvider, Layout, message, Skeleton } from "antd";
import {
  FullPageLoader,
  MainLayoutHeader,
  MainLayoutSidebar,
} from "components";
import { useGlobalContext } from "context/global";
import { useMainLayoutContext } from "context/mainLayout";
import { getAuthToken } from "fe-helpers";
import { useAuthentication } from "hooks/useAuth";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const { Content, Sider, Footer } = Layout;

const themeToken = {
  colorPrimary: "#0d6696",
  colorInfo: "#0d6696",
  colorTextBase: "#444444",
  fontSize: 14,
  wireframe: true,
  fontFamily: "Roboto",
};

export const Mainlayout = ({ children, access }) => {
  const { showLoader, setUserData, userData } = useGlobalContext();
  const router = useRouter();
  const { getVerifiedUser } = useAuthentication();
  const {
    pageTitle,
    searchBar,
    cta,
    sidebar,
    statsInfo,
    showBack,
    isPageLoaded,
    setIsPageLoaded,
  } = useMainLayoutContext();

  const [showSidebarMenu, setShowSidebarMenu] = useState(false);

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    setIsPageLoaded(false);
    let accessToken = getAuthToken();
    if (accessToken) {
      getVerifiedUser(access, data => {
        setUserData(data);
      })
        .then(() => {
          setIsPageLoaded(true);
        })
        .catch(() => {
          setIsPageLoaded(false);
          router.push("/");
        });
    } else {
      message.info("invalid access token");
      router.push("/");
    }
  }, [access]);

  return (
    <>
      <Head>
        <title>Badri Mahal Task Mgmt</title>
        <meta name="description" content="Task Management Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfigProvider
        space={{ size: "small" }}
        componentSize="middle"
        theme={{ token: themeToken }}
      >
        <Layout className="min-h-screen relative px-8 pb-8 z-0">
          {showLoader ? <FullPageLoader /> : null}
          <div className="bg-[#1E293B] w-full h-[480px] absolute top-0 left-0 -z-[1]" />
          {isPageLoaded ? (
            <>
              <MainLayoutHeader
                showBack={showBack}
                handleBack={handleBack}
                pageTitle={pageTitle}
                toggleMenu={() => setShowSidebarMenu(true)}
                userData={userData}
              />
              <MainLayoutSidebar
                showSidebarMenu={showSidebarMenu}
                userRole={userData.user_role}
                handleClose={() => setShowSidebarMenu(false)}
              />
              <div className="mt-10" />
              {searchBar || cta ? (
                <div className=" h-16 mt-8 flex items-center ">
                  {searchBar || null}
                  <div className="ml-auto" />
                  {cta || null}
                </div>
              ) : null}
              <Layout className="bg-transparent mt-8">
                {sidebar ? (
                  <Sider
                    className="!bg-transparent mr-4 !max-w-[300px] !w-[300px] !basis-[300px]"
                    theme="light"
                  >
                    <Card className="w-full h-[400px]" title="sidebar" />
                  </Sider>
                ) : null}

                <Content>
                  {statsInfo ? (
                    <div className="h-48 mb-4">{statsInfo}</div>
                  ) : null}
                  <div>{children}</div>
                </Content>
              </Layout>
            </>
          ) : (
            <Layout className="px-8">
              <Content className="mt-16">
                <Skeleton
                  title
                  avatar
                  paragraph={{ rows: 10 }}
                  className="mb-16"
                  active
                />
              </Content>
              <Footer>
                <Skeleton active />
              </Footer>
            </Layout>
          )}
        </Layout>
      </ConfigProvider>
    </>
  );
};
