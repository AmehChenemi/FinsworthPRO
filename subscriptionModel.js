const mongoose = require('mongoose')
const {DateTime}=require ("luxon")
const datetime = DateTime.now()
const date = datetime.toFormat("yyyy-MM-dd")
const time = datetime.toFormat("HH:mm:ss")
const subSchema = new mongoose.Schema({
    plan:{
        type:String,
        enum:['Blaze', 'Freedom']
    },
    amount:{
        type:Number
    },
    validity:{

    }
},{timeStamps:true})

const subModel = mongoose.model ("Subscriptions", subSchema)
module.exports = subModel