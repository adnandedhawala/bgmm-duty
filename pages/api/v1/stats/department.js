import nc from "next-connect";
import { checkAuth, connectDB } from "be-helpers/middlewares";
import { ncErrorHandlers } from "be-helpers/utils";
import { getDepartmentWiseTaskStatsController } from "be-helpers/controllers";

export default nc(ncErrorHandlers)
  .use(connectDB)
  .use(checkAuth)
  .get(getDepartmentWiseTaskStatsController);
