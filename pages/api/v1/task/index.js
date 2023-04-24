import nc from "next-connect";
import { ncErrorHandlers } from "be-helpers/utils";
import {
  checkAuth,
  checkSuperAdminOrAdmin,
  connectDB,
} from "be-helpers/middlewares";
import {
  createTaskController,
  getTasksController,
} from "be-helpers/controllers";

export default nc(ncErrorHandlers)
  .use(connectDB)
  .use(checkAuth)
  .get(getTasksController)
  .use(checkSuperAdminOrAdmin)
  .post(createTaskController);
