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
    // console.log(error);
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
const edit = async (payload) => {
  try {
    // console.log("payload", payload);

    const { id, ...updateData } = payload;
    const userData = await Post.findOne({ where: { id }, attributes: { exclude: ["password", "roleId"] } });
    // Check user exists or not
    if (!userData) {
      throw appError("User not found", 404);
    }

    const updatedUser = await userData.update({
      ...updateData,
    });
    return {
      message: "Update successfully",
      data: updatedUser,
    };
  } catch (error) {
    // console.log(error);

    throw appError("User System Problem", 500);
  }
};
const deleteData = async (payload) => {
  try {
    const { id } = payload;
    const postData = await Post.findOne({ where: { id } });
    // Check user exists or not
    if (!postData) {
      throw appError("Post not found", 404);
    }

    const updatedUser = await postData.update({
      deleted_at: new Date(),
    });
    return {
      message: "Post Deleted successfully",
      data: "",
    };
  } catch (error) {
    throw appError("Post system Problem ", 500);
  }
};
export { list, add, edit, deleteData };
