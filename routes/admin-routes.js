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



//db.posts.find({"created_on": {"$gte": start, "$lt": end}})
adminRouter.post('/search/date' , (req,res,next) =>{
  const starDate1= new Date(req.body.starDate) || null;
    starDate1.setDate(starDate1.getDate() + 1 )

  console.log("star date=======>>" , starDate1);
  const endDate2= new Date(req.body.endDate) || null;
  endDate2.setDate(endDate2.getDate() + 1  )
  console.log("enddate2========" , endDate2.toISOString());
  const interface= req.body.interface || null;
  const device =req.body.device || null;
  const pos    =req.body.pos || null;
  const printer= req.body.printer || null;
  const infArray=[starDate1,endDate2,interface,device,pos,printer];
  //console.log(" req.body.starDate======", starDate1.toISOString() )
  console.log("search printer===",printer);
  Printer.find()
  .then(listPrinter => {
    // console.log("printer ===",listPrinter);
     
      /*if(printer === 'false')
      {
        Calls.find({createdAt:{"$gte": starDate1.toISOString() ,"$lt" : endDate2.toISOString()}})
          .then(callLog =>{
              //console.log("calls ===", callLog);
              res.render('admin/searchReport', {callLog, listPrinter})
          }) 
          .catch(error => next(err))
      }else {*/
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
            function isEmpty(obj) {
              for(var key in obj) {
                  if(obj.hasOwnProperty(key))
                      return false;
              }
              return true;
          }
          const objCheck = isEmpty(filter)

            if(!objCheck){
            callLog = callLog.filter(item => {
              for (let key in filter) {
                if (item[key] === undefined || item[key] != filter[key] )
                  // console.log('1')
                  // if(item[key]._id){
                  //   console.log('2')
                  //   if ((item[key]._id).toString() !== (filter[key]).toString() ){
                  //     return false;
                  //   }
                  //   return true;
                  // } 
                  return false;

                
              }
              return true;

            }); 
           }

              res.render('admin/searchReport', {callLog, listPrinter,infArray})
          }) 
          //,interface,device,pos,endDate2
          .catch(err => next(err))
      //}
  })
  .catch()
 

})

module.exports = adminRouter;
