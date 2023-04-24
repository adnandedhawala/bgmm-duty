import nc from "next-connect";
import {
  checkAuth,
  checkSuperAdminOrAdmin,
  connectDB,
} from "be-helpers/middlewares";
import { ncErrorHandlers } from "be-helpers/utils";
import {
  deleteTagController,
  editTagController,
  getTagbyIdController,
} from "be-helpers/controllers";

export default nc(ncErrorHandlers)
  .use(connectDB)
  .use(checkAuth)
  .use(checkSuperAdminOrAdmin)
  .get(getTagbyIdController)
  .patch(editTagController)
  .delete(deleteTagController);
