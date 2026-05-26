import AppError from "./../utility/AppError.js";
import bcrypt from "bcrypt";
import { uploadBinaryFile } from "./../utility/Upload.js";
import { DEFAULT_ROLE } from "../utility/DefaultValues.js";
import User from "../model/User.model.js";
import Role from "../model/Role.model.js";
import { where } from "sequelize";
const list = async (payload) => {
  try {
    const response = await User.findAll({
      where: { deleted_at: null },
      include: [{ model: Role, as: "role" }],
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
const details = async (payload) => {
  try {
    const response = await User.findOne({
      where: { deleted_at: null },
      include: [{ model: Role, as: "role" }],
    });

    return {
      message: "Details  fetched successfully",
      data: response,
    };
  } catch (error) {
    // console.log(error);
    throw new AppError("System problem", 500);
  }
};

const add = async (payload) => {
  try {
    const { name, email, password, image, roleId } = payload;
    //check required fields
    if (!name || !email || !password) {
      throw new AppError("Field is empty", 400);
    }
    //check if the user is already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new AppError("User already existed and try resetting the password", 400);
    }
    //validate the roleId
    let finalRoleId = roleId;
    if (!finalRoleId) {
      const defaultRole = await Role.findOne({
        where: { codeName: "USER" },
      });

      finalRoleId = defaultRole.id;
    } else {
      const roleExists = await Role.findByPk(finalRoleId);
      if (!roleExists) {
        throw new AppError("Invalid roleId");
      }
    }
    //hash password
    const hashPassword = await bcrypt.hash(password, 10);

    //upload image
    let finalImage = null;
    if (image) {
      const up = await uploadBinaryFile({ file: image, folder: "users" });
      console.log("up data", up);
      finalImage = up.url;
    }
    const result = await User.create({
      ...payload,
      imageUrl: finalImage,
      password: hashPassword,
      roleId: finalRoleId,
    });
    return {
      message: "Data add Successfully",
      data: result,
    };
  } catch (error) {
    // throw new AppError("System problem", 500);
    console.log(error);
  }
};
const edit = async (payload) => {
  try {
    // console.log("payload", payload);

    const { id, password, roleId, ...updateData } = payload;
    const userData = await User.findOne({ where: { id }, attributes: { exclude: ["password", "roleId"] } });
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
    const userData = await User.findOne({ where: { id }, attributes: { exclude: ["password", "roleId"] } });
    // Check user exists or not
    if (!userData) {
      throw appError("User not found", 404);
    }

    const updatedUser = await userData.update({
      deleted_at: new Date(),
    });
    return {
      message: "Deleted successfully",
      data: "",
    };
  } catch (error) {
    // error("error", error);
    throw appError("User system Problem ", 500);
  }
};
export { list, details, add, edit, deleteData };
