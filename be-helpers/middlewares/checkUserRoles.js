import { USER_ROLES } from "appConstants";

export const checkSuperAdminOrAdmin = (request, response, next) => {
  const { userData } = request;
  if (![USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(userData.user_role))
    return response.status(401).send("user not authorized");

  return next();
};
