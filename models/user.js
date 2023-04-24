import { USER_ROLES } from "appConstants";
import { Schema } from "mongoose";

export const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is missing"],
    },
    email: {
      type: String,
      required: [true, "email is missing"],
    },
    contact: {
      type: String,
      required: [true, "contact number is missing"],
    },
    password: {
      type: String,
      required: [true, "password is missing"],
    },
    user_role: {
      type: String,
      required: [true, "user role is missing"],
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.MEMBER,
    },
    department: {
      type: String,
      ref: "Department",
    },
    is_active: {
      type: Schema.Types.Boolean,
      default: true,
    },
  },
  { timestamps: true }
);
