import get from "lodash/get";

const prefix =
  (process.env.NEXT_PUBLIC_ROOT_API_URL || "http://localhost:3000") +
  "/api/v1/";

const API = {
  login: "user/auth/login",
  verify: "user/auth/verify",
  auth: "user/auth",
  settings: "settings",
  task: "task",
  department: "department",
  user: "user",
  stats: "stats",
  tag: "tag",
  statsForDepartment: "stats/department",
};

export const getApiUrl = urlName => prefix + get(API, urlName);
