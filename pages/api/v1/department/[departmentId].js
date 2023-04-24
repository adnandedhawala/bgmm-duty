import nc from "next-connect";
import {
  checkAuth,
  checkSuperAdminOrAdmin,
  connectDB,
} from "be-helpers/middlewares";
import { ncErrorHandlers } from "be-helpers/utils";
import {
  deleteDepartmentController,
  editDepartmentController,
  getDepartmentbyIdController,
} from "be-helpers/controllers";

export default nc(ncErrorHandlers)
  .use(connectDB)
  .use(checkAuth)
  .use(checkSuperAdminOrAdmin)
  .get(getDepartmentbyIdController)
  .patch(editDepartmentController)
  .delete(deleteDepartmentController);
