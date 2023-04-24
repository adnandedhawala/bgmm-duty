import nc from "next-connect";
import { ncErrorHandlers } from "be-helpers/utils";
import {
  checkAuth,
  checkSuperAdminOrAdmin,
  connectDB,
} from "be-helpers/middlewares";
import {
  deleteTaskController,
  getTaskByIdController,
  updateTaskController,
} from "be-helpers/controllers";

export default nc(ncErrorHandlers)
  .use(connectDB)
  .use(checkAuth)
  .get(getTaskByIdController)
  .put(updateTaskController)
  .use(checkSuperAdminOrAdmin)
  .delete(deleteTaskController);
