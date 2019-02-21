const express = require('express');
const callRouter = express.Router();

const Printer = require('../models/printer');
const Calls   = require('../models/call-logs');


///*********Form to add new calls  *** */
//************************************ */

callRouter.get('/newCallog' , (req,res,next) => {
  Printer.find() // I need the printer to list on my form
  .then(printerFromDB => {
      res.render('call-log/newCall', {printerFromDB});
  })
  .catch()
    
})

callRouter.post('/addlog' , (req,res,next) => {
    Calls.create(req.body)
    .then(newlog => {
        console.log("new ===" , newlog);
    })
    .catch(err => next(err))
})

module.exports = callRouter;

