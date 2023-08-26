import passport from "passport";
import local from "passport-local";
import userModel from "../models/user.models.js";
import { createHash, isValidPassword } from "../utils.js";

const localStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "signup",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "username",
      },
      async (req, username, password, done) => {
        const { email, age } = req.body;
        try {
          const user = await userModel.findOne({ username });
          if (user) {
            return done(null, false, { message: "user already registered" });
          }
          const newUser = {
            username,
            email,
            password: createHash(password),
            age,
          };
          console.log(newUser);
          let result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          throw done("error al obtener el usuario");
        }
      }
    )
  );
  passport.use(
    "login",
    new localStrategy(
      { usernameField: "username" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ username: username });
          //console.log(user);
          if (!user) {
            return done(null, false, { message: "el usuario no existe" });
          }
          if (!isValidPassword(password, user.password)) {
            return done(null, false, { message: "wrong password" });
          } else {
            return done(null, user);
          }
        } catch (error) {
          console.log("error al obtener el usuario");
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let userById = await userModel.findById(id);
    done(null, userById);
  });
};
export default initializePassport;
