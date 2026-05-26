import AppError from "./../utility/AppError.js";
import { uploadBinaryFile } from "./../utility/Upload.js";
import { DEFAULT_ROLE } from "../utility/DefaultValues.js";
import Post from "../model/Post.model.js";
import User from "../model/User.model.js";

const list = async (payload) => {
  try {
    const response = await Post.findAll({
      include: [{ model: User, as: "author" }],
    });

    return {
      message: "List fetched successfully",
      data: response,
    };
  } catch (error) {
    console.log(error);
    throw new AppError("System problem", 500);
  }
};
const add = async (payload) => {
  try {
    const { title, content, userId, file } = payload;
    //check required fields
    if (!title || !content || !userId) {
      throw new AppError("Field is empty", 400);
    }

    //upload image
    let finalImage = null;
    if (file) {
      const up = await uploadBinaryFile({ file: file, folder: "posts" });
      finalImage = up.url;
    }
    const result = await Post.create({
      title,
      content,
      userId,
      imageUrl: finalImage,
    });
    return {
      message: "Data add Successfully",
      data: result,
    };
  } catch (error) {
    throw new AppError("System problem", 500);
    // console.log(error);
  }
};
const edit = (payload) => {};
const deleteData = (payload) => {};
export { list, add, edit, deleteData };
