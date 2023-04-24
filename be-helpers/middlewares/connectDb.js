/* eslint-disable unicorn/prevent-abbreviations */
import mongoose from "mongoose";

const connectionUrl =
  "mongodb+srv://" +
  process.env.DB_USER +
  ":" +
  process.env.DB_PASS +
  "@" +
  process.env.DB_HOST +
  "/" +
  process.env.DB_NAME;

export const connectDB = async (_request, _response, next) => {
  try {
    if (!mongoose.connections[0].readyState) {
      await mongoose.connect(connectionUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    }
    return next();
  } catch (error) {
    throw new Error(error.message);
  }
};
