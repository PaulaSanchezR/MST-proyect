const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const printerSchema = new Schema({
    printer     : String,
    description : String
})

const Printer = mongoose.model("Printer", printerSchema);
module.exports = Printer;