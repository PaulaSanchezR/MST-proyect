const express = require('express');
const callRouter = express.Router();

const Printer = require('../models/printer');
const Calls   = require('../models/call-logs');
const User    = require('../models/user');



///*********Form to add new calls  *** */
//************************************ */

callRouter.get('/newCallog' , isLoggedIn,(req,res,next) => {
  Printer.find() // I need the printer to list on my form
  .then(printerFromDB => {

      Calls.find()
      .populate('representative')
      .populate('printer')
      .then(callsFromDB =>{
          console.log("printer1", printerFromDB);
          console.log("calls1", callsFromDB);
          res.render('call-log/newCall', {printerFromDB , callsFromDB});
      })
      .catch(err => next(err))
      
  })
  .catch(err => next(err))
    
})

callRouter.post('/newCallog' , isLoggedIn,(req,res,next) => {
    Calls.create({
        representative  : req.user._id,
        printer         : req.body.printer,
        interface       : req.body.interface,
        device          : req.body.device,
        pos             : req.body.pos,
        observation     : req.body.observation

    })
    .then(callsFromDB => {
        res.redirect('/newCallog');
    })
    .catch(err => next(err))
})




//========================LIST THE CALLS
/*callRouter.get('/rep/addlog', isLoggedIn,(req,res,next)=>{
    Calls.find().populate('representative')
})*/

//==========================FUNCTION TO VALIDATE IS LOGGIN
function isLoggedIn(req, res, next){
    if(req.user){
        next();
    } else {
        req.flash('error', 'You need to log in first');
        res.redirect('/login');
    }
}
module.exports = callRouter;

