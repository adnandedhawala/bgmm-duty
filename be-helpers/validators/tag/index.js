import * as yup from "yup";

export const createTagSchema = yup.object().shape({
  name: yup.string().required("name is required").min(3, "name too short"),
  description: yup.string(),
  color: yup.string(),
});

export const editTagSchema = yup.object().shape({
  name: yup.string().min(3, "name too short"),
  description: yup.string(),
  color: yup.string(),
});
