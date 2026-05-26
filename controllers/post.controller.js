import { list as listService, add as addService, edit as editService, deleteData as deleteDataService } from "./../services/post.service.js";
export const list = async (req, res, next) => {
  try {
    const data = await listService({
      ...req.query,
      ...req.params,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
export const add = async (req, res, next) => {
  try {
    const data = await addService({ ...req.body, file: req.file });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
export const edit = async (req, res, next) => {
  try {
    const data = await addService({ ...req.body, ...req.query });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
export const deleteData = async (req, res, next) => {
  try {
    const data = await deleteDataService(req.body, { ...req.query });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
