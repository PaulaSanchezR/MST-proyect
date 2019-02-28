const express= require('express');
const adminRouter = express.Router();

const User = require('../models/user');


//===============LIST USERS


adminRouter.get('/dashBoard', (req,res,next)=>{
  User.find()
  .then(listUser =>{
    res.render('admin/adminDashboard' , { listUser});
  })
  .catch(err => console.log("the user are not listed"));
})

//==================EDIT USERS

adminRouter.post('/edit/:idUser', (req,res,next)=>{
  User.findById(req.params.idUser)
  .then(findUser => {
      //console.log('find User', findUser);
    res.render('admin/editUser' , {findUser});
  })
  .catch(err => console.log("we can not find the user on the DB"))
})

adminRouter.post('/:idUpdate/update', (req,res,next) =>{
  //const {privalage,active} = req.body;
  //User.update ({})
  User.findByIdAndUpdate(req.params.idUpdate, req.body)
  .then(updateUser => {
      //console.log("user update  ====",updateUser);
      User.find()
       .then(listUser => {
        console.log("user update  ***",listUser);
        res.render('admin/adminDashboard', {listUser});
      })
      .catch(err => console.log("Error listing the user"))
    
  })
  .catch(err => console.log("Error update User", err))

})


module.exports = adminRouter;
