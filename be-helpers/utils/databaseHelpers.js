const userDetailFields = "_id name email contact user_role department";
export const getTaskListPopulationQuery = [
  {
    path: "department",
    model: "Department",
  },
  {
    path: "owner",
    model: "User",
    select: "_id name user_role",
  },
  {
    path: "tags",
    model: "Tag",
  },
];

export const getTaskPopulationQuery = [
  {
    path: "department",
    model: "Department",
  },
  {
    path: "remarks.created_by",
    model: "User",
    select: userDetailFields,
  },
  {
    path: "logs.created_by",
    model: "User",
    select: userDetailFields,
  },
  {
    path: "updated_by",
    model: "User",
    select: userDetailFields,
  },
  {
    path: "created_by",
    model: "User",
    select: userDetailFields,
  },
  {
    path: "approved_by",
    model: "User",
    select: userDetailFields,
    populate: {
      path: "department",
      model: "Department",
    },
  },
  {
    path: "owner",
    model: "User",
    select: userDetailFields,
    populate: {
      path: "department",
      model: "Department",
    },
  },
  {
    path: "tags",
    model: "Tag",
  },
];

export const getTaskProjectionQuery = {
  title: 0,
  recommendation: 0,
  approved_by: 0,
  date_of_completion: 0,
  remarks: 0,
  logs: 0,
  created_by: 0,
  created_on: 0,
  updated_on: 0,
  updated_by: 0,
};

export const getTaskTagLookup = {
  from: "Tag",
  localField: "tags",
  foreignField: "_id",
  as: "tags",
};

export const getTaskDepartmentLookup = {
  from: "Department",
  localField: "department",
  foreignField: "_id",
  as: "department",
};
export const getTaskOwnerLookup = {
  from: "User",
  localField: "owner",
  foreignField: "_id",
  as: "owner",
  pipeline: [
    {
      $project: {
        is_active: 0,
        email: 0,
        contact: 0,
      },
    },
  ],
};
