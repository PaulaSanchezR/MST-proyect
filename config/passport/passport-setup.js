const passport = require('passport');
const User = require ('../../models/user')
const flash = require('connect-flash');


//================ REQUIRE THE STRATEGIES=======================
require('./local-strategy');


// ============== SERIALIZEUSER ================================
//  What do we save in the session
//                        Stands for Callback  
//                             ^              
//                             |             
passport.serializeUser((user, cb) => {
  console.log("== user ===",user)
// if null === no errors, save the id into session
//    ^
//    |
  cb(null, user._id); // => save User ID into session
});


// ==============DESERIALIZEUSER=============================
//****retrive user's data from the database
//****this function gets called every time we request for a user
//****every time we req.user
passport.deserializeUser((id, cb) => {
  User.findById(id)
  .then(user =>{
    cb(null,user);
  })
  .catch(err=>cb(err));
});



//=========INITIALIZE THE SESSION
//******* passport super power is here

function passportBasicSetup(pass){
  //                starts passport packages
  //                    |
  pass.use(passport.initialize());
  pass.use(passport.session());
  //                    |
  //      connects passport to the session  

  // ***** Activate flash msg ********
  pass.use(flash());
  pass.use((req,res,next) => {
    res.locals.messages = req.flash();
    if(req.user){
      //res.locals.isAdmin = "admin";
      res.locals.currentUser = req.user;
      //                        |
      //     make currentUser variable available in all hbs 
      //      whenever we have user in the session       
    }
    next();
  })

}


module.exports = passportBasicSetup;