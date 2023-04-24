import nc from "next-connect";
import { ncErrorHandlers } from "be-helpers/utils";
import {
  checkAuth,
  checkSuperAdminOrAdmin,
  connectDB,
} from "be-helpers/middlewares";
import { addUserController, getUsersController } from "be-helpers/controllers";

export default nc(ncErrorHandlers)
  .use(connectDB)
  .use(checkAuth)
  .get(getUsersController)
  .use(checkSuperAdminOrAdmin)
  .post(addUserController);
