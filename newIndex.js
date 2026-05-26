import { Role } from "./model/index.js";
import { sequelize } from "./config/mysql.config.js";

async function start() {
  try {
    // DB connection
    await sequelize.authenticate();
    console.log("DB Connected Successfully");

    // Sync models
    // await sequelize.sync({});

    // Fetch roles
    const result = await Role.findAndCountAll({
      limit: 10,
      offset: 0,
      raw: true,
    });

    console.log("Roles:", result);
  } catch (error) {
    console.log("ERROR:", error);
  }
}

start();
