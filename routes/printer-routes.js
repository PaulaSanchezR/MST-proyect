const express = require('express');
const printerRouter = express.Router();

const Printer = require ('../models/printer');

//============= LIST PRINTER ===============

printerRouter.get('/printer', (req,res,next)=>{
  Printer.find()
  .then(listPrinter =>{
    res.render('admin/listPrinters' , {listPrinter});
  })
  .catch(err => console.log("We can not list the printers", err))
  

})

//============== EDIT FORM PRINTER ===================

printerRouter.post('/editPrinter/:idPrinter',(req,res,next) =>{
  Printer.findById(req.params.idPrinter)
  .then(findPrinter =>{
    res.render('admin/addPrinter', {findPrinter})
  })
  .catch()
})

   //***** UPDATE PRINTER *******/

  printerRouter.post('/printer/edit',(req,res,next) =>{
    const printer = req.body.printer;
    const description = req.body.description;
    const printerId = req.body.id;
    console.log("++++ ID ",req.body.id);
   // Printer.find({_id : printerId})
   Printer.findById(req.body.id)
    .then(updatePrinter =>{
        updatePrinter.set({
          printer,
          description
        })
        updatePrinter.save((err) => {
          if(err){
            res.render("admin/addPrinter" , {message :"Something went wrong updating the Printer"})
          }else{
            Printer.find()
            .then(listPrinter =>{
                res.render("admin/listPrinters", {listPrinter})
            })
            
          }
        })
    })
    .catch(err => console.log("erro updatiing printer" , err))
  })





//============== NEW FORM PRINTER ===================

printerRouter.get('/printer/addForm',(req,res,next) =>{
  Printer.find()
  .then(findPrinter =>{
    res.render('admin/addPrinter')
  })
  .catch()
})  
//============== ADD PRINTER =================

printerRouter.post('/printer/add',(req,res,next) =>{

  Printer.create({
    printer:req.body.printer,
    description: req.body.description
  })
  .then(newPrinter =>{
    Printer.find()
    .then(listPrinter =>{
      res.render('admin/listPrinters' , {listPrinter})
    })
    .catch()
  })
  .catch()
})

module.exports = printerRouter;