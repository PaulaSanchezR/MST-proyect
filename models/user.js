const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const userSchema = new Schema({
        username : {type: String},
        password : {type: String},
        name : {type: String},
        lastName:{type:String},
        privilage : {type: String, enum:['admin','repre'], default:'repre'},
        active : {type: Boolean, default:'true'}
    },{
        timestamps: {createdAt:"created_at",updateAt:"update_at"}
    });

const User = mongoose.model("User" , userSchema);

module.exports = User;