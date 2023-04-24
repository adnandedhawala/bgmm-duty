import { Setting } from "models";

export const getSettingsController = async (_request, response) => {
  try {
    const settings = await Setting.findOne({
      settingId: process.env.DB_SETTINGS_ID,
    });
    return response.status(200).json({ data: settings });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export const updateSettingsController = async (_request, response) => {
  try {
    const newDocument = await Setting.findOneAndUpdate(
      { settingId: process.env.DB_SETTINGS_ID },
      { $inc: { task_number: 1 } },
      {
        new: true,
      }
    );
    return response.status(200).send(newDocument);
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
