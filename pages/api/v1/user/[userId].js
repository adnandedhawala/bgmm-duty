import nc from "next-connect";
import {
  checkAuth,
  checkSuperAdminOrAdmin,
  connectDB,
} from "be-helpers/middlewares";
import { ncErrorHandlers } from "be-helpers/utils";
import {
  deleteUserController,
  editUserController,
  getUserbyIdController,
} from "be-helpers/controllers";

export default nc(ncErrorHandlers)
  .use(connectDB)
  .use(checkAuth)
  .use(checkSuperAdminOrAdmin)
  .get(getUserbyIdController)
  .put(editUserController)
  .delete(deleteUserController);
