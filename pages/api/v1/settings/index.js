import nc from "next-connect";
import { ncErrorHandlers } from "be-helpers/utils";
import {
  checkAuth,
  checkSuperAdminOrAdmin,
  connectDB,
} from "be-helpers/middlewares";
import {
  getSettingsController,
  updateSettingsController,
} from "be-helpers/controllers";

export default nc(ncErrorHandlers)
  .use(connectDB)
  .use(checkAuth)
  .use(checkSuperAdminOrAdmin)
  .get(getSettingsController)
  .put(updateSettingsController);
