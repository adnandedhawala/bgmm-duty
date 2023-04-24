import { RISK_PRIORITY, TASK_STATUS } from "appConstants";
import * as yup from "yup";

export const createTaskSchema = yup.object().shape({
  task_id: yup.string(),
  title: yup.string().required("title is required"),
  finding: yup.string(),
  risk_rating: yup
    .string()
    .oneOf(Object.values(RISK_PRIORITY), "invalid risk rating"),
  recommendation: yup.string(),
  management_response: yup.string(),
  action_items: yup.string(),
  owner: yup.array().of(yup.string()),
  approved_by: yup.array().of(yup.string()),
  department: yup.string(),
  target_date: yup.date(),
  status: yup
    .string()
    .required("status is required")
    .oneOf(Object.values(TASK_STATUS), "invalid task status"),
  date_of_completion: yup.date(),
  tags: yup.array().of(yup.string()),
  remarks: yup.array().of(
    yup.object().shape({
      created_by: yup.string(),
      created_on: yup.date(),
      description: yup.string(),
    })
  ),
  logs: yup.array().of(
    yup.object().shape({
      created_by: yup.string(),
      created_on: yup.date(),
      description: yup.string(),
    })
  ),
  created_by: yup.string().required(),
  created_on: yup.date().required(),
  updated_on: yup.date().required(),
  updated_by: yup.string().required(),
});

export const updateTaskSchema = yup.object().shape({
  task_id: yup.string(),
  title: yup.string(),
  finding: yup.string(),
  risk_rating: yup
    .string()
    .oneOf(Object.values(RISK_PRIORITY), "invalid risk rating"),
  recommendation: yup.string(),
  management_response: yup.string(),
  action_items: yup.string(),
  owner: yup.array().of(yup.string()),
  approved_by: yup.array().of(yup.string()),
  department: yup.string(),
  target_date: yup.date(),
  status: yup.string().oneOf(Object.values(TASK_STATUS), "invalid task status"),
  date_of_completion: yup.date(),
  tags: yup.array().of(yup.string()),
  is_approved_admin: yup.bool(),
  is_approved_hod: yup.bool(),
  remarks: yup.object().shape({
    created_by: yup.string(),
    created_on: yup.date(),
    description: yup.string(),
  }),
  logs: yup.object().shape({
    created_by: yup.string(),
    created_on: yup.date(),
    description: yup.string(),
  }),
  created_by: yup.string(),
  created_on: yup.date(),
  updated_on: yup.date().required(),
  updated_by: yup.string().required(),
});
