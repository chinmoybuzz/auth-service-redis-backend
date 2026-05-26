import Sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 5, // Maximum number of connection instances in pool
    min: 0, // Minimum number of connection instances in pool
    acquire: 30000, // Max time (ms) trying to get connection before throwing error
    idle: 10000, // Max time (ms) a connection can be idle before being released
  },
});

export { sequelize };
