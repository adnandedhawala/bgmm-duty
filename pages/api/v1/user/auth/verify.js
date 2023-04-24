import nc from "next-connect";
import { ncErrorHandlers } from "be-helpers/utils";
import { verifyUserController } from "be-helpers/controllers";

export default nc(ncErrorHandlers).post(verifyUserController);
