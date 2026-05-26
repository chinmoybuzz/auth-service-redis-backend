import { login as loginService, signUp as signUpService, refreshToken } from "../services/auth.service.js";

export const login = async (req, res, next) => {
  try {
    const data = await loginService({ ...req.body });
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // remove refresh token from response
    delete data.refreshToken;
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const signUp = async (req, res, next) => {
  try {
    const data = await signUpService(req.body);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    const data = await refreshToken({
      token,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
