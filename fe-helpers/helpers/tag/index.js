import { addTag, deleteTag, editTag, getTagList } from "fe-helpers";

export const getTagListHelper = async ({ successFn, errorFn, endFn }) => {
  await getTagList()
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const deleteTagHelper = async ({ successFn, errorFn, endFn, id }) => {
  await deleteTag(id)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const editTagHelper = async ({
  successFn,
  errorFn,
  endFn,
  id,
  data,
}) => {
  await editTag(id, data)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};

export const addTagHelper = async ({ successFn, errorFn, endFn, data }) => {
  await addTag(data)
    .then(data => successFn(data))
    .catch(error => errorFn(error))
    .finally(() => endFn());
};
