import moment from "moment";

export const getDefaultTaskFields = user => {
  return {
    created_by: user._id,
    created_on: moment(new Date()),
    updated_on: moment(new Date()),
    updated_by: user._id,
  };
};
