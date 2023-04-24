/* eslint-disable security/detect-unsafe-regex */
import { USER_ROLES } from "appConstants";
import * as yup from "yup";

const phoneRegExp = /^\+[1-9]\d{3,14}$/;
const invalidEmailMessage = "invalid email";
const requiredEmailMessage = "email is required";

const passwordRequired = "password is required";
const password8Characters = "password should be atleast 8 characters";

export const createUserSchema = yup.object().shape({
  name: yup.string().required("name is required").min(3, "name too short"),
  email: yup
    .string()
    .required(requiredEmailMessage)
    .lowercase()
    .trim()
    .email(invalidEmailMessage),
  contact: yup.string().required("contact is required").matches(phoneRegExp, {
    message: "invalid contact",
    excludeEmptyString: true,
  }),
  password: yup.string().required(passwordRequired).min(8, password8Characters),
  user_role: yup
    .string()
    .required("user role is required")
    .oneOf(Object.values(USER_ROLES), "invalid user role"),
  department: yup.string(),
});

export const editUserSchema = yup.object().shape({
  name: yup.string().min(3, "name too short"),
  email: yup.string().lowercase().trim().email(invalidEmailMessage),
  contact: yup.string().matches(phoneRegExp, {
    message: "invalid contact",
    excludeEmptyString: true,
  }),
  user_role: yup.string().oneOf(Object.values(USER_ROLES), "invalid user role"),
  department: yup.string(),
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required(requiredEmailMessage)
    .lowercase()
    .trim()
    .email(invalidEmailMessage),
  password: yup.string().required(passwordRequired).min(8, password8Characters),
});

export const changePasswordSchema = yup.object().shape({
  password: yup.string().required(passwordRequired).min(8, password8Characters),
  newPassword: yup
    .string()
    .required(passwordRequired)
    .min(8, password8Characters),
});
