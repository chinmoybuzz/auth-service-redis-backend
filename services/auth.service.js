import dotenv from "dotenv";
dotenv.config();
import { User } from "../model/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utility/AppError.js";
import UserToken from "../model/UserToken.js";

const login = async (payload) => {
  try {
    const { email, password } = payload;

    if (!email || !password) {
      throw new AppError("Enter credentials", 400);
    }

    const user = await User.findOne({
      where: { email },
      attributes: ["id", "name", "email", "password", "roleId"],
      raw: true,
    });

    if (!user) {
      return {
        message: "Invalid credentials",
        data: null,
      };
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return {
        message: "Invalid credentials",
        data: null,
      };
    }

    delete user.password;
    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
    // console.log("refreshToken", refreshToken);
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await UserToken.create({ userId: user.id, refreshToken, expiresAt: refreshTokenExpiry });
    return {
      message: "Login Successfully",
      data: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const signUp = (req, res) => {};

const refreshToken = async (payload) => {
  try {
    const { token } = payload;

    if (!token) {
      throw new AppError("Refresh token required", 401);
    }

    // verify jwt
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    // check token exists in DB
    const storedToken = await UserToken.findOne({
      where: {
        refreshToken: token,
      },
    });

    if (!storedToken) {
      throw new AppError("Invalid refresh token", 401);
    }

    // optional expiry check
    if (storedToken.expiresAt && storedToken.expiresAt < new Date()) {
      throw new AppError("Refresh token expired", 401);
    }

    // get user
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email", "roleId"],
      raw: true,
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // generate new access token
    const accessToken = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        roleId: user.roleId,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    return {
      message: "Token refreshed",
      accessToken,
    };
  } catch (error) {
    throw new AppError("Invalid Refresh Token", 401);
  }
};
export { login, signUp, refreshToken };
