import passport from "passport";
import jwt from "jsonwebtoken";

const { TokenExpiredError } = jwt;

const authenticate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    try {
      // 🔴 Token expired
      if (info?.name === "TokenExpiredError" || info?.expired) {
        return res.status(401).json({
          status: 401,
          message: "Token expired, please try again.",
          tokenExpired: true,
        });
      }
      // 🔴 Server error
      if (err) {
        return res.status(500).json({
          status: 500,
          message: err.message,
        });
      }

      // 🔴 Invalid token
      if (!user) {
        return res.status(401).json({
          status: 401,
          message: "Invalid token, please try again.",
        });
      }

      // ✅ attach user
      res.locals.authenticatedUser = user;
      res.locals.authenticatedUserType = user.role;

      res.user = user;

      return next();
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  })(req, res, next);
};

export { authenticate };
