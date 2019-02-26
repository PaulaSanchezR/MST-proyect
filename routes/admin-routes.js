const express= require('express');
const adminRouter = express.Router();

const User = require('../models/user');


adminRouter.get('/dashBoard', (req,res,next)=>{
  res.render('admin/adminDashboard');
})

module.exports = adminRouter;
