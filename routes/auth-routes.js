const express       = require("express");
const authRoutes    = express.Router();
const passport      = require("passport");
const ensureLogin   = require("connect-ensure-login");

//User model
const User = require("../models/user");

//bcrypt to encrypt passport
const bcrypt   = require("bcryptjs");
const bcryptSalt = 10;


//Show the form signup 
authRoutes.get("/signup", (req,res,next) =>{
    res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === "" || password === "") {
      res.render("auth/signup", { message: "Indicate username and password" });
      return;
    }
  
    User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }
  
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
  
      const newUser = new User({
        username,
        password: hashPass
      });
  
      newUser.save((err) => {
        if (err) {
          res.render("auth/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error)
    })
  });
  
//***********LOGIN****** */

// the get has not secret, we have to load the view we will use
authRoutes.get("/login", (req, res, next) => {
    res.render("auth/login");
  });
// the post will containt the passport funcionality  
  authRoutes.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  }));

// ********************PRIVATE PAGE ******

authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
    res.render("private", { user: req.user });
  });


module.exports = authRoutes;