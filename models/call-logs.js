const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const callLogsSchema = new Schema({
    representative  : { type: Schema.Types.ObjectId , ref : 'User'},
    printer         : { type: Schema.Types.ObjectId , ref : 'Printer'},
    interface       : String,
    device          : String,
    pos             : String,
    observation     : String
}, {
    timestamps : true
})

const CallLog  = mongoose.model('callLog', callLogsSchema);
module.exports = CallLog;