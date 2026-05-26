import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import cors from "cors";
import responseTime from "response-time";
import cookieParser from "cookie-parser";
import passport from "passport";
import { sequelize } from "./config/mysql.config.js";
import { connectRedis } from "./config/redis.config.js";
import apiV1Route from "./routes/api.v1.route.js";
import { errorHandler } from "./middleware/error.middleware.js";
// const apiV1Route = require("./routes/api.v1.route");

const PORT = process.env.PORT;
const app = express();

import "./strategies/JWTStrategy.js";
app.use(responseTime());
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   }),
// );
// app.use(session({ secret: process.env.SESSION_SEC, resave: true, saveUninitialized: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

const start = async () => {
  await sequelize.authenticate().then(() => {
    console.log("Db Connected success");
  });
  await sequelize.sync({});
  await connectRedis();
  app.listen(PORT, () => console.log(`Server started to: http://localhost:${PORT}`));
};

app.use("/api/v1", apiV1Route);
app.use(errorHandler);
start();
