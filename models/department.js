import { Schema } from "mongoose";

export const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is missing"],
    },
    hod: {
      type: String,
      ref: "User",
    },
  },
  { timestamps: true }
);
