/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable security/detect-object-injection */
/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable sonarjs/no-duplicate-string */
import { TASK_STATUS, USER_ROLES } from "appConstants";
import {
  getTaskListPopulationQuery,
  getTaskPopulationQuery,
} from "be-helpers/utils";
import { createTaskSchema, updateTaskSchema } from "be-helpers/validators";
import { isEmpty } from "lodash";
import { Setting, Task } from "models";
import { ObjectId } from "mongodb";

export const getTasksController = async (request, response) => {
  const { page, page_size } = request.query;
  const { user_role, department, _id } = request.userData;
  const findQuery = {};
  const dataFields =
    "_id task_id finding risk_rating department management_response action_items owner target_date status tags is_approved_hod";
  try {
    if (user_role === USER_ROLES.HOD) {
      findQuery.department = department._id;
    }
    if (user_role === USER_ROLES.MEMBER) {
      findQuery.owner = { $in: [_id] };
    }
    await (!page && !page_size
      ? Task.find({ ...findQuery }, dataFields)
          .sort({ updated_on: "desc" })
          .populate(getTaskListPopulationQuery)
          .exec((_error, tasks) => {
            response.status(200).json({ data: tasks });
          })
      : Task.find({ ...findQuery }, dataFields)
          .limit(page_size)
          .skip(page_size * page)
          .sort({ updated_on: "desc" })
          .populate(getTaskListPopulationQuery)
          .exec((_error, tasks) => {
            Task.find({ ...findQuery })
              .count()
              .exec(function (_error, count) {
                response
                  .status(200)
                  .json({ data: tasks, count, page, page_size });
              });
          }));
  } catch (error) {
    response.status(500).send(error.message);
  }
};

export const createTaskController = async (request, response) => {
  const { data } = request.body;
  if (!data) return response.status(400).end("data is missing!");
  createTaskSchema
    .validate(data)
    .then(async createObject => {
      const settings = await Setting.findOne({
        settingId: process.env.DB_SETTINGS_ID,
      });
      if (settings) {
        const newTaskData = {
          ...createObject,
          task_id: "bmt-" + settings.task_number,
        };
        try {
          const task = new Task(newTaskData);
          const saveResponse = await task.save();
          if (saveResponse) {
            await Setting.findOneAndUpdate(
              { settingId: process.env.DB_SETTINGS_ID },
              { $inc: { task_number: 1 } }
            );
          }
          return response.status(200).send(saveResponse);
        } catch (error) {
          return response.status(500).send(error.message);
        }
      } else {
        return response.status(500).send("Something went wrong!");
      }
    })
    .catch(error => {
      response.status(400).send(error.message);
    });
};

export const getTaskByIdController = async (request, response) => {
  const { taskId } = request.query;
  if (!taskId) return response.status(404).send("invalid task id");
  try {
    const data = await Task.findById(taskId).populate(getTaskPopulationQuery);
    if (data) {
      response.status(200).json({ data });
    } else {
      response.status(404).send("Data not found");
    }
  } catch (error) {
    response.status(500).send(error.message);
  }
};

const checkAdminKeys = keys => {
  const adminFields = new Set([
    "title",
    "finding",
    "risk_rating",
    "recommendation",
    "date_of_completion",
    "tags",
    "created_by",
    "created_on",
    "department",
    "target_date",
    "is_approved_admin",
  ]);
  return keys.some(value => adminFields.has(value));
};
const checkAdminAndHodKeys = keys => {
  const adminFields = new Set([
    "title",
    "finding",
    "risk_rating",
    "recommendation",
    "date_of_completion",
    "tags",
    "created_by",
    "created_on",
    "department",
    "target_date",
    "is_approved_admin",
  ]);
  const hodFields = new Set([
    "management_response",
    "action_items",
    "owner",
    "approved_by",
    "is_approved_hod",
  ]);
  return (
    keys.some(value => adminFields.has(value)) ||
    keys.some(value => hodFields.has(value))
  );
};

export const updateTaskController = async (request, response) => {
  const { taskId } = request.query;
  const { data } = request.body;
  const { user_role } = request.userData;
  if (!taskId) return response.status(404).send("invalid task id");
  if (!data) return response.status(400).end("data is missing!");
  updateTaskSchema
    .validate(data, { stripUnknown: true })
    .then(async editObject => {
      if (
        ![USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(user_role) &&
        checkAdminKeys(Object.keys(editObject))
      )
        return response.status(400).send("bad request");
      if (
        user_role === USER_ROLES.MEMBER &&
        checkAdminAndHodKeys(Object.keys(editObject))
      )
        return response.status(400).send("bad request");
      if (
        ![USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(user_role) &&
        editObject.status &&
        [TASK_STATUS.DRAFT, TASK_STATUS.CLOSED, TASK_STATUS.COMPLETED].includes(
          editObject.status
        )
      )
        return response.status(400).send("bad request");

      const taskUpdateObject = { ...editObject };
      let setObject = { ...editObject };

      setObject = Object.entries(setObject)
        .filter(([key]) => !["logs", "remarks"].includes(key))
        .reduce((setObject, [key, value]) => {
          setObject[key] = value;
          return setObject;
        }, {});

      let pushObject = Object.entries(taskUpdateObject)
        .filter(([key]) => ["logs", "remarks"].includes(key))
        .reduce((object, [key, value]) => {
          object[key] = value;
          return object;
        }, {});

      Object.keys(pushObject.logs).forEach(key => {
        if (!pushObject.logs[key]) {
          delete pushObject.logs[key];
        }
      });
      Object.keys(pushObject.remarks).forEach(key => {
        if (!pushObject.remarks[key]) {
          delete pushObject.remarks[key];
        }
      });
      Object.keys(pushObject).forEach(key => {
        if (Object.keys(pushObject[key]).length === 0) {
          delete pushObject[key];
        }
      });

      let updateObject = {
        $set: setObject,
      };
      if (!isEmpty(pushObject)) {
        updateObject.$push = pushObject;
      }
      try {
        const data = await Task.findOneAndUpdate(
          {
            _id: ObjectId(taskId),
          },
          updateObject,
          { new: true }
        );
        return data
          ? response.status(200).json({ data })
          : response.status(404).send("Data not found");
      } catch (error) {
        return response.status(500).send(error.message);
      }
    })
    .catch(error => {
      return response.status(400).send(error.message);
    });
};

export const deleteTaskController = async (request, response) => {
  const { taskId } = request.query;
  if (!taskId) return response.status(404).send("invalid task id");
  try {
    const result = await Task.findByIdAndRemove(taskId);
    return result
      ? response.status(200).send("Task deleted successfully")
      : response.status(404).send("Task id not found");
  } catch (error) {
    response.status(500).send(error.message);
  }
};
