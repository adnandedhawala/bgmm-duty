import { Schema } from "mongoose";

export const settingSchema = new Schema(
  {
    settingId: {
      type: String,
    },
    task_number: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
