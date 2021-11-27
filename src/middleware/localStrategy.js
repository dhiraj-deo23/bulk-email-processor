const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../Model/User");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          console.log("Email not registered!");
          return done(null, false, { message: "Email is invalid!" });
        }
        if (!user.valid) {
          return done(null, false, { message: "Email is invalid!" });
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
          console.log("Incorrect email/password!");
          return done(null, false, {
            message: "Incorrect email/password",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
