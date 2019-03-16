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
  User.findById(req.params.idUpdate)
  //User.findByIdAndUpdate(req.params.idUpdate, req.body)
  
  .then(updateUser => {
    console.log("privilages ===" ,req.body.privilage )
          temPrivi= false;
          if (req.body.privilage ==="admin"){
            temPrivi = true;
          }else {
            temPrivi = false;
          }
          updateUser.set({
            active : req.body.active,
            privilage: req.body.privilage,
            privi: temPrivi

          })
          
        updateUser.save((err) => {
          if (err){
            res.render("admin/editUser", {message:"Something went wrong updating the user"})
          } else{
              console.log("user update  ====",updateUser);
              User.find()
              .then(listUser => {
                //console.log("user update  ***",listUser);
                res.render('admin/adminDashboard', {listUser});
              })
              .catch(err => console.log("Error listing the user"))
            }
        });
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
adminRouter.post('/search/date' , (req,res,next) =>{
  const starDate1= new Date(req.body.starDate) || null;

   function addMonth(month){
     console.log("=== month===", month.length)
    let realMonth= month;
      if(month.toString().length == 1){
        realMonth = `0${month}`;
      }
    return realMonth; 
  }
  const dateValue1= `${starDate1.getFullYear()}-${addMonth(starDate1.getMonth()+1)}-${addMonth(starDate1.getDate())}`;
   // starDate1.setDate(starDate1.getDate() + 1 )

  console.log("star date=======>>" , starDate1);
  const endDate2= new Date(req.body.endDate) || null;
  const dateValue2= `${endDate2.getFullYear()}-${addMonth(endDate2.getMonth()+1)}-${addMonth(endDate2.getDate())}`;
 // endDate2.setDate(endDate2.getDate() + 1  )
  console.log("enddate2========" , endDate2);
  const interface= req.body.interface || null;
  const device =req.body.device || null;
  const pos    =req.body.pos || null;
  const printer= req.body.printer || null;
  const infArray=[dateValue1,dateValue2,printer,interface,device,pos];

  Printer.find()
  .then(listPrinter => {
  
        // Calls.find({$or: [{device:device}, {printer:printer},{pos:pos},{interface:interface},{createdAt:{"$gte": starDate1.toISOString() ,"$lt" : endDate2.toISOString()}}]})
        Calls.find({createdAt:{"$gte": starDate1.toISOString() ,"$lt" : endDate2.toISOString()}})
          .populate('representative')
          .populate('printer')
          .then(callLog =>{
            const filter = {};
          
            if (printer !== null){
              filter.printer = printer;
            }
            if (interface !== null){
              filter.interface = interface;
            }
            if (pos !== null){
              filter.pos = pos;
            }
            if (device !== null){
              filter.device = device;
            }
            console.log("search printer===",filter.printer);
            callLog = callLog.filter(item => {
              for (let key in filter) {
                              // console.log('OUTSITE ......item=== ', item[key], '   filter===' , filter[key] )
                if(item[key]._id){
                  // console.log('INSIDE ......item  ', item[key]._id, '====', ' filter' , filter[key] )
                  if(item[key]._id.toString() !== filter[key].toString()){
                    console.log(" RETURN FALSE")
                        return false;
                  }
                }else if(item[key] === undefined || item[key] != filter[key] )
                    return false;
                }
              return true;

            }); 
              res.render('admin/searchReport', {callLog, listPrinter,infArray})
          }) 
        .catch(err => next(err))
 })
  .catch()
})

module.exports = adminRouter;
