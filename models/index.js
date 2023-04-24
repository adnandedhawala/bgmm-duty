import mongoose, { model } from "mongoose";
import { departmentSchema } from "./department";
import { settingSchema } from "./setting";
import { tagSchema } from "./tag";
import { taskSchema } from "./task";
import { userSchema } from "./user";

export const User = mongoose.models.User || model("User", userSchema);
export const Department =
  mongoose.models.Department || model("Department", departmentSchema);
export const Tag = mongoose.models.Tag || model("Tag", tagSchema);
export const Setting =
  mongoose.models.Setting || model("Setting", settingSchema);
export const Task = mongoose.models.Task || model("Task", taskSchema);
