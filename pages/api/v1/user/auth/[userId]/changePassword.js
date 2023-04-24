import nc from "next-connect";
import { checkAuth, connectDB } from "be-helpers/middlewares";
import { ncErrorHandlers } from "be-helpers/utils";
import { changePasswordController } from "be-helpers/controllers";

export default nc(ncErrorHandlers)
  .use(connectDB)
  .use(checkAuth)
  .patch(changePasswordController);
