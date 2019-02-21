const mongoose = require ('mongoose');
const Printer = require ('../models/printer');

const dbName = 'mst-proyect';
mongoose.connect(`mongodb://localhost/${dbName}`);

const printer=[
    {
        printer     : "TSP100III",
        description : "It is the series printer"
    },
    {
        printer     : "mC-Print2",
        description : "Small printer"
    },
    {
        printer     : "mC-Print3",
        description : "Small printer"
    },
    {
        printer     : "TSP650II",
        description : "Original Printer"
    }
]

Printer.create(printer, (err)=>{
    if(err){throw(err)}
    console.log(`Create ${printer.length} pinter`)
    mongoose.connection.close();
})