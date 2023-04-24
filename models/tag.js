import { Schema } from "mongoose";

export const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is missing"],
    },
    description: {
      type: String,
    },
    color: {
      type: String,
      default: "#cccccc",
      required: [false, "color is missing"],
    },
  },
  { timestamps: true }
);
