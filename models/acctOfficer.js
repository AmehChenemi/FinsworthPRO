const mongoose = require('mongoose')
const acctOfficerSchema = new mongoose.Schema({
    Fullname:{
        type: String
    },
    email:{
        type: String
    },
    password:{
        type: String
    },
    accountBal:{
        type:Number
    }, 
},{timestamps:true})

const acctOfficerModel = mongoose.model('accountOfficer', acctOfficerSchema)
module.exports = acctOfficerModel