import * as yup from "yup";

export const createDepartmentSchema = yup.object().shape({
  name: yup.string().required("name is required").min(3, "name too short"),
  hod: yup.string(),
});

export const editDepartmentSchema = yup.object().shape({
  name: yup.string().min(3, "name too short"),
  hod: yup.string(),
});
