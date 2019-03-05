const mongoose = require ('mongoose');
const Printer = require ('../models/printer');

const dbName = 'mst-proyect';
mongoose.connect(`mongodb://localhost/${dbName}`);
//     when I run the seeds I need to use this line and on the command line use node seeds.js
//                  |
//mongoose.connect(`mongodb://heroku_46vlmzwk:bnbj5ja6j6fju6pcfo98m75jp5@ds123619.mlab.com:23619/heroku_46vlmzwk`);
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