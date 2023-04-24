import { RISK_PRIORITY, TASK_STATUS } from "appConstants";
import { Schema } from "mongoose";

export const taskSchema = new Schema(
  {
    task_id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    finding: {
      type: String,
    },
    risk_rating: {
      type: String,
      enum: Object.values(RISK_PRIORITY),
      default: RISK_PRIORITY.LOW,
    },
    recommendation: {
      type: String,
    },
    management_response: {
      type: String,
    },
    action_items: {
      type: String,
    },
    is_approved_admin: {
      type: Schema.Types.Boolean,
      default: false,
    },
    is_approved_hod: {
      type: Schema.Types.Boolean,
      default: false,
    },
    owner: [{ type: String, ref: "User" }],
    approved_by: [{ type: String, ref: "User" }],
    department: {
      type: String,
      ref: "Department",
    },
    target_date: {
      type: Date,
    },
    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.DRAFT,
    },
    date_of_completion: {
      type: Date,
    },
    remarks: [
      {
        created_by: { type: String, ref: "User" },
        created_on: { type: String },
        description: { type: String },
      },
    ],
    logs: [
      {
        created_by: { type: String, ref: "User" },
        created_on: { type: String },
        description: { type: String },
      },
    ],
    tags: [
      {
        type: String,
        ref: "Tag",
      },
    ],
    created_by: {
      type: String,
      ref: "User",
    },
    created_on: {
      type: Date,
    },
    updated_on: {
      type: Date,
    },
    updated_by: {
      type: String,
      ref: "User",
    },
  },
  {
    timestamps: {
      createdAt: "created_on",
      updatedAt: "updated_on",
    },
  }
);
