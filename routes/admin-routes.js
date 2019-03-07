const express= require('express');
const adminRouter = express.Router();

const User = require('../models/user');
const Printer = require('../models/printer');
const Calls = require('../models/call-logs')



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

//=======================REPORTS



adminRouter.get('/reports', (req,res,next)=>{
  Printer.find()
  .then(listPrinter =>{
    res.render('admin/searchReport' , { listPrinter});
  })
  .catch(err => console.log("the user are not listed"));
})



//db.posts.find({"created_on": {"$gte": start, "$lt": end}})
adminRouter.post('/search/date' , (req,res,next) =>{
  starDate1= new Date(req.body.starDate);
  endDate2= new Date(req.body.endDate)
  const printer= req.body.printer;
  //console.log(" req.body.starDate======", starDate1.toISOString() )
  if(printer === 'false')
  {
    Calls.find({createdAt:{"$gte": starDate1.toISOString() ,"$lt" : endDate2.toISOString()}})
      .then(callLog =>{
          console.log("calls ===", callLog);
          res.render('admin/searchReport', {callLog})
      }) 
      .populate('representative')
      .populate('printer')
      .catch(error => next(err))
  }else {
    Calls.find({printer, createdAt:{"$gte": starDate1.toISOString() ,"$lt" : endDate2.toISOString()}})
      .then(callLog =>{
          console.log("with printer ===", callLog);
      }) 
      .populate('representative')
      .populate('printer')
      .catch(error => next(err))
  }

 

})

module.exports = adminRouter;
