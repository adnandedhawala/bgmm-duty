import {
  createDepartmentSchema,
  editDepartmentSchema,
} from "be-helpers/validators";
import { Department, User } from "models";

const invalidDepartmentMessage = "invalid Department Id";

export const getDepartmentsController = async (_request, response) => {
  try {
    const departmentList = await Department.find({}).populate({
      path: "hod",
      model: "User",
    });
    response.status(200).json({ data: departmentList });
  } catch (error) {
    response.status(500).send(error.message);
  }
};

export const addDepartmentController = async (request, response) => {
  const { data } = request.body;
  if (!data) return response.status(400).end("data is missing!");
  createDepartmentSchema
    .validate(data)
    .then(async createObject => {
      const existingDepartment = await Department.findOne({
        name: createObject.name,
      });
      if (existingDepartment)
        response.status(400).send("Department already exists");
      else {
        try {
          const department = new Department(createObject);
          await department.save();
          response.status(200).send("Department created successfully !");
        } catch (error) {
          response.status(500).send(error.message);
        }
      }
    })
    .catch(error => {
      response.status(400).send(error.message);
    });
};

export const editDepartmentController = async (request, response) => {
  const { data } = request.body;
  const { departmentId } = request.query;
  if (!departmentId) return response.status(404).send(invalidDepartmentMessage);
  if (!data) return response.status(400).end("data is missing!");
  editDepartmentSchema
    .validate(data)
    .then(async editObject => {
      const existingDepartment = await Department.findOne({
        name: editObject.name,
      });
      if (existingDepartment)
        response.status(400).send("Department already exists");
      else {
        try {
          const result = await Department.findByIdAndUpdate(
            departmentId,
            editObject
          );
          if (result) {
            response.status(200).send("Department Edited Successfully!");
          } else {
            response.status(400).send("Incorrect Department id");
          }
        } catch (error) {
          response.status(500).send(error.message);
        }
      }
    })
    .catch(error => {
      response.status(400).send(error.message);
    });
};

export const getDepartmentbyIdController = async (request, response) => {
  const { departmentId } = request.query;
  if (!departmentId) return response.status(404).send(invalidDepartmentMessage);
  try {
    const data = await Department.findById(departmentId);
    if (data) {
      response.status(200).json({ data });
    } else {
      response.status(404).send("Data not found");
    }
  } catch (error) {
    response.status(500).send(error.message);
  }
};

export const deleteDepartmentController = async (request, response) => {
  const { departmentId } = request.query;
  if (!departmentId) return response.status(404).send(invalidDepartmentMessage);
  try {
    const result = await Department.findByIdAndRemove(departmentId);
    if (result) {
      await User.updateMany({ department: departmentId }, { department: "" });
      await Department.updateMany(
        { department: departmentId },
        { department: "" }
      );
      return response.status(200).send("Department deleted successfully");
    }
    return response.status(404).send("Department id not found");
  } catch (error) {
    response.status(500).send(error.message);
  }
};
