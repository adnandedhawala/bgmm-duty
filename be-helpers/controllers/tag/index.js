import { createTagSchema, editTagSchema } from "be-helpers/validators";
import { Tag, Task } from "models";

const invalidTagMessage = "invalid Tag Id";

export const getTagsController = async (_request, response) => {
  try {
    const tagList = await Tag.find({}, "_id name description color");
    response.status(200).json({ data: tagList });
  } catch (error) {
    response.status(500).send(error.message);
  }
};

export const addTagController = async (request, response) => {
  const { data } = request.body;
  if (!data) return response.status(400).end("data is missing!");
  createTagSchema
    .validate(data)
    .then(async createObject => {
      const existingTag = await Tag.findOne({
        name: createObject.name,
      });
      if (existingTag) return response.status(400).send("Tag already exists");
      else {
        try {
          const tag = new Tag(createObject);
          await tag.save();
          return response.status(200).send("Tag created successfully !");
        } catch (error) {
          return response.status(500).send(error.message);
        }
      }
    })
    .catch(error => {
      response.status(400).send(error.message);
    });
};

export const editTagController = async (request, response) => {
  const { data } = request.body;
  const { tagId } = request.query;
  if (!tagId) return response.status(404).send(invalidTagMessage);
  if (!data) return response.status(400).end("data is missing!");
  editTagSchema
    .validate(data)
    .then(async editObject => {
      try {
        const result = await Tag.findByIdAndUpdate(tagId, editObject);
        if (result) {
          response.status(200).send("Tag Edited Successfully!");
        } else {
          response.status(400).send("Incorrect Tag id");
        }
      } catch (error) {
        response.status(500).send(error.message);
      }
    })
    .catch(error => {
      response.status(400).send(error.message);
    });
};

export const getTagbyIdController = async (request, response) => {
  const { tagId } = request.query;
  if (!tagId) return response.status(404).send(invalidTagMessage);
  try {
    const data = await Tag.findById(tagId);
    if (data) {
      response.status(200).json({ data });
    } else {
      response.status(404).send("Data not found");
    }
  } catch (error) {
    response.status(500).send(error.message);
  }
};

export const deleteTagController = async (request, response) => {
  const { tagId } = request.query;
  if (!tagId) return response.status(404).send(invalidTagMessage);
  try {
    const result = await Tag.findByIdAndRemove(tagId);
    if (result) {
      await Task.updateMany({ tags: tagId }, { $pull: { tags: tagId } });
      return response.status(200).send("Tag deleted successfully");
    }
    return response.status(404).send("Tag id not found");
  } catch (error) {
    response.status(500).send(error.message);
  }
};
