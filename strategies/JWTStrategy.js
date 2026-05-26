import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import AppError from "../utility/AppError.js";
import User from "../model/User.model.js";

// JWT STRATEGY
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        // optional extra expiry check (passport already handles exp)
        if (jwtPayload.exp && jwtPayload.exp < Date.now() / 1000) {
          return done(null, false, { message: "Token expired", expired: true });
        }

        const user = await User.findOne({
          where: { id: jwtPayload.id },
          attributes: ["id", "name", "email", "roleId"],
          raw: true,
        });
        if (!user) {
          return done(new AppError("User does not exist", 404), false);
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    },
  ),
);

// // GOOGLE STRATEGY
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: `${process.env.BASE_URL}/api/v1/google/callback`,
//     },
//     (accessToken, refreshToken, profile, done) => {
//       return done(null, profile);
//     },
//   ),
// );

// SESSION HANDLING
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
