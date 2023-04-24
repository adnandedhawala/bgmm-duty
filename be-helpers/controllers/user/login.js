import bcrypt from "bcrypt";
import { changePasswordSchema, loginSchema } from "be-helpers/validators";
import { sign, verify } from "jsonwebtoken";
import { User } from "models";
import { ObjectId } from "mongodb";

export const loginController = async (request, response) => {
  const { data } = request.body;
  if (!data) response.status(400).end("login data is missing!");
  loginSchema
    .validate(data)
    .then(async loginData => {
      const { email, password } = loginData;
      let userData = await User.findOne({ email, is_active: true }).populate(
        "department"
      );
      if (!userData) return response.status(400).send("user not found");

      const isPasswordCorrect = await bcrypt.compare(
        password,
        userData.password
      );
      if (isPasswordCorrect) {
        const tokenData = {
          name: userData.name,
          email: userData.email,
          user_role: userData.user_role,
          contact: userData.contact,
          _id: userData._id,
        };
        if (userData.department) {
          tokenData.department = userData.department;
        }
        const authToken = sign(
          tokenData,
          process.env.NEXT_PUBLIC_JWT_SECRET_SALT,
          {
            expiresIn: "4h",
          }
        );
        return response.status(200).send({ data: authToken });
      } else {
        return response.status(400).send("invalid credentials");
      }
    })
    .catch(error => {
      return response.status(400).send(error.message);
    });
};

export const verifyUserController = async (request, response) => {
  const { data } = request.body;
  if (!data || data === "")
    return response.status(401).end("token is missing!");
  try {
    const userData = verify(data, process.env.NEXT_PUBLIC_JWT_SECRET_SALT);
    return response.status(200).send(userData);
  } catch (error) {
    return error.name === "TokenExpiredError"
      ? response.status(403).send("user session has expired")
      : response.status(401).send("invalid access token");
  }
};

export const changePasswordController = async (request, response) => {
  const { data } = request.body;
  const { userId } = request.query;
  if (!userId) return response.status(404).send("invalid user Id");
  if (!data) return response.status(400).end("data is missing!");
  changePasswordSchema
    .validate(data)
    .then(async changePasswordData => {
      const { newPassword, password } = changePasswordData;
      let userData = await User.findOne({
        _id: ObjectId(userId),
        is_active: true,
      });
      if (!userData) return response.status(400).send("user not found");

      const isPasswordCorrect = await bcrypt.compare(
        password,
        userData.password
      );
      if (isPasswordCorrect) {
        const newUserPassword = await bcrypt
          .genSalt(Number(process.env.SALT_ROUNDS))
          .then(salt => {
            return bcrypt.hash(newPassword, salt);
          })
          .then(hash => {
            return hash;
          });
        await User.findByIdAndUpdate(userId, { password: newUserPassword });
        return response.status(200).send("password changed successfully");
      } else {
        return response.status(400).send("old password doesnot match");
      }
    })
    .catch(error => {
      return response.status(400).send(error.message);
    });
};

export const resetPasswordController = async (request, response) => {
  const { userId } = request.query;
  if (!userId) return response.status(404).send("invalid user Id");
  try {
    const newUserPassword = await bcrypt
      .genSalt(Number(process.env.SALT_ROUNDS))
      .then(salt => {
        return bcrypt.hash("sms515253", salt);
      })
      .then(hash => {
        return hash;
      });
    await User.findByIdAndUpdate(userId, { password: newUserPassword });
    return response.status(200).send("password reset successfully");
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
