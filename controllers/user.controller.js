import { list as listService, details as detailService, add as addService, edit as editService, deleteData as deleteDataService } from "./../services/user.service.js";
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
export const details = async (req, res, next) => {
  try {
    const data = await detailService({
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
    const data = await addService({ ...req.body, image: req.file });

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
    const data = await editService({ ...req.body, ...req.params });

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
