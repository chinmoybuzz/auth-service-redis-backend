import { Role } from "../model/index.js";
import AppError from "../utility/AppError.js";

const list = async (payload) => {
  try {
    // const attributes = ["name", "codeName"];
    const { id, name, codeName } = payload;
    const where = {};

    if (id) where.id = id;
    if (name) where.name = name;
    if (codeName) where.codeName = codeName;

    const result = await Role.findAll({
      where,
      // ...(Array.isArray(attributes) && { attributes }),
    });
    return {
      message: "Role List fetch Successfully",
      status: 200,
      data: result,
    };
  } catch (err) {
    console.log("Error", err);
    throw new AppError("Error in role service file", 500);
  }
};
const add = async (payload) => {
  try {
    const { name, codeName } = payload;
    if (!name || !codeName) {
      throw new AppError("Name and CodeName are required", 400);
    }
    const existingRole = await Role.findOne({ where: { codeName } });
    if (existingRole) {
      throw new AppError("Role already Exists", 409);
    }
    const role = await Role.create({
      name,
      codeName,
    });
    return {
      message: "Role Created Successfully",
      status: 201,
      data: role,
    };
  } catch (err) {
    throw new AppError("Error in role service file", 500);
  }
};
const edit = (req, res) => {};
const deleteData = (req, res) => {};
export { list, add, edit, deleteData };
