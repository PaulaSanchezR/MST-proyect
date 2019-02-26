const bcrypt     = require('bcryptjs');
const passport     = require('passport');
const LocalStrategy     = require('passport-local').Strategy;

const User   = require('../../models/user')



passport.use(new LocalStrategy((username, password, next) => {
  console.log("username======", username);
  User.findOne({ username }, (err, user) => {
    console.log("username inside ======", username);
    if (err) {
      return next(err);
    }
    if (!user) {
      console.log("incorrect username");
      return next(null, false, { message: "Incorrect username" });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(null, false, { message: "Incorrect password" });
    }

    return next(null, user);
  });
}));