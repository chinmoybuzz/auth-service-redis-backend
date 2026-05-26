import { DataTypes } from "sequelize";
import { sequelize } from "../config/mysql.config.js";

const Role = sequelize.define(
  "Roles",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    codeName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // ADMIN, USER (safe for code usage)
    },
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Role;
