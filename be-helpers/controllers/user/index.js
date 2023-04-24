/* eslint-disable sonarjs/cognitive-complexity */
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { User, Department } from "models";
import { createUserSchema, editUserSchema } from "be-helpers/validators";
import { USER_ROLES } from "appConstants";

const invalidUserIdMessage = "invalid User Id";
const userNotFoundMessage = "User not found";

export const getUsersController = async (request, response) => {
  const { user_role, department } = request.userData;
  const { showAll } = request.query;
  let filterObject = {
    is_active: true,
  };
  if (showAll === "true") filterObject = {};
  if (user_role === USER_ROLES.HOD) {
    filterObject.department = department._id;
  }
  if (user_role === USER_ROLES.MEMBER)
    return response.status(200).json({ data: [] });
  try {
    const users = await User.find(
      { ...filterObject },
      "name contact department _id email user_role is_active"
    ).populate("department");
    return response.status(200).json({ data: users });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export const addUserController = async (request, response) => {
  const { data } = request.body;
  if (!data) response.status(400).end("user data is missing!");
  createUserSchema
    .validate(data)
    .then(async createObject => {
      // checking if user already exists
      const existingUser = await User.findOne({
        email: createObject.email.trim().toLowerCase(),
      });
      if (existingUser) return response.status(400).send("User already exists");

      const newUserData = { ...createObject, is_active: true };
      // checking if user_role has proper department
      if (
        (createObject.user_role === USER_ROLES.MEMBER ||
          createObject.user_role === USER_ROLES.HOD) &&
        !newUserData.department
      )
        return response.status(400).send("Department not selected");

      if (
        createObject.user_role === USER_ROLES.ADMIN ||
        createObject.user_role === USER_ROLES.SUPER_ADMIN
      ) {
        delete newUserData.department;
      }

      // checking if department exists
      if (newUserData.department) {
        const departmentData = await Department.findById(
          newUserData.department
        );
        if (!departmentData)
          return response.status(400).send("Selected Department doesnot exist");
      }
      try {
        const password = await bcrypt
          .genSalt(Number(process.env.SALT_ROUNDS))
          .then(salt => {
            return bcrypt.hash(newUserData.password, salt);
          })
          .then(hash => {
            return hash;
          });
        newUserData.password = password;
        const user = new User(newUserData);
        await user.save();
        return response.status(200).send("User added sucessfully!!");
      } catch (error) {
        return response.status(500).send(error.message);
      }
    })
    .catch(error => {
      return response.status(400).send(error.message);
    });
};

export const editUserController = async (request, response) => {
  const { data } = request.body;
  const { userId } = request.query;
  if (!userId) return response.status(404).send(invalidUserIdMessage);
  if (!data) return response.status(400).end("data is missing!");
  editUserSchema
    .validate(data)
    .then(async editObject => {
      // checking if user is new based on email
      if (editObject.email) {
        const existingUser = await User.findOne({
          email: editObject.email.trim().toLowerCase(),
        });
        if (existingUser)
          return response.status(400).send("User already exists");
      }

      try {
        const userData = await User.findById(userId);
        let editUserData = {
          name: userData.name,
          email: userData.email,
          contact: userData.contact,
          password: userData.password,
          user_role: userData.user_role,
        };
        if (userData.department) editUserData.department = userData.department;
        editUserData = { ...editUserData, ...editObject };
        // making sure that department exists for HOD and MEMBER
        if (
          [USER_ROLES.HOD, USER_ROLES.MEMBER].includes(
            editUserData.user_role
          ) &&
          !editUserData.department
        )
          return response.status(400).send("Department is required");

        if (
          [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN].includes(
            editUserData.user_role
          )
        )
          delete editUserData.department;

        // checking if department exists
        if (editUserData.department) {
          const departmentData = await Department.findById(
            editUserData.department
          );
          if (!departmentData)
            return response
              .status(400)
              .send("Selected Department doesnot exist");
        }

        const result = await User.findOneAndReplace(
          { _id: ObjectId(userId) },
          editUserData
        );

        return result
          ? response.status(200).send("User Edited Successfully!")
          : response.status(400).send(userNotFoundMessage);
      } catch (error) {
        response.status(500).send(error.message);
      }
    })
    .catch(error => {
      response.status(400).send(error.message);
    });
};

export const getUserbyIdController = async (request, response) => {
  const { userId } = request.query;
  if (!userId) return response.status(404).send(invalidUserIdMessage);
  try {
    const data = await User.findOne({
      _id: ObjectId(userId),
      is_active: true,
    }).populate("department");
    return data
      ? response.status(200).json({ data })
      : response.status(404).send(userNotFoundMessage);
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export const deleteUserController = async (request, response) => {
  const { userId } = request.query;
  if (!userId) return response.status(404).send(invalidUserIdMessage);
  try {
    const result = await User.findByIdAndUpdate(userId, {
      $set: { is_active: false },
    });
    return result
      ? response.status(200).send("User deleted successfully")
      : response.status(404).send(userNotFoundMessage);
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export * from "./login";
