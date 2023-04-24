import { message } from "antd";
import { logout, verifyUser } from "fe-helpers";
import { useRouter } from "next/router";
import { useCallback } from "react";

export const useAuthentication = () => {
  const router = useRouter();

  const getVerifiedUser = useCallback(async (allowedUsers, onSuccess) => {
    return verifyUser()
      .then(data => {
        if (allowedUsers.includes(data.user_role)) {
          return data;
        }
        throw "user access denied";
      })
      .then(userData => {
        if (onSuccess) {
          onSuccess(userData);
        }
        return userData;
      })
      .catch(error => {
        message.error(error);
        logout();
        router.push("/");
      });
  }, []);

  return { getVerifiedUser };
};
