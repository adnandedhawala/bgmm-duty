import { GlobalProvider } from "context/global";
import { MainLayoutProvider } from "context/mainLayout";
import { TaskProvider } from "context/task";
import { TaskDetailsProvider } from "context/taskDetails";
import "styles/globals.scss";

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalProvider>
        <MainLayoutProvider>
          <TaskProvider>
            <TaskDetailsProvider>
              {Component.PageLayout ? (
                <Component.PageLayout {...pageProps}>
                  <Component {...pageProps} />
                </Component.PageLayout>
              ) : (
                <Component {...pageProps} />
              )}
            </TaskDetailsProvider>
          </TaskProvider>
        </MainLayoutProvider>
      </GlobalProvider>
    </>
  );
}
