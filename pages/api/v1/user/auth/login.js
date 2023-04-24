import nc from "next-connect";
import { ncErrorHandlers } from "be-helpers/utils";
import { connectDB } from "be-helpers/middlewares";
import { loginController } from "be-helpers/controllers";

export default nc(ncErrorHandlers).use(connectDB).post(loginController);
