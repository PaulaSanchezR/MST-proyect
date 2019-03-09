const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const userSchema = new Schema({
        email: {type: String, require: true},
        username : {type: String, require:true},
        password : {type: String, require:true},
        resetPasswordToken:{type:String},
        resetPassordExpires: {type: Date},
        name : {type: String},
        lastName:{type:String},
        privilage : {type: String, enum:['admin','repre'], default:'repre'},
        privi: false,
        active : {type: Boolean, default:'true'}
    },{
        timestamps: {createdAt:"created_at",updateAt:"update_at"}
    });

const User = mongoose.model("User" , userSchema);

module.exports = User;