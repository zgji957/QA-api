const mongoose = require('mongoose');

const {Schema,Model} = mongoose;

const userSchema = new Schema({
    name:{
        type:'String',
        required:true,
    }
}) 

module.exports = Model('User',userSchema);