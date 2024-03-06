const mongoose = require('mongoose')
const {DateTime}=require ("luxon")
const datetime = DateTime.now()
const date = datetime.toFormat("yyyy-MM-dd")
const time = datetime.toFormat("HH:mm:ss")
const subSchema = new mongoose.Schema({
    plan:{
        type:String,
        enum:['Monthly', 'Yearly']
    },
    amount:{
        type:Number
    },
    isFree:{
       type:Boolean,
       default:false
    },
    isMonthly:{
      type:Boolean,
      default:false
    },
    isYearly:{
        type:Boolean,
        default:false
    },
    date: {
        type: String,
        default: date
    },
    time:{
        type: String,
        default: time
    },
    company:{
     type: mongoose.Schema.Type.ObjectId,
     ref: "Company"
    }
},{timeStamps:true})

const subModel = mongoose.model ("Subscriptions", subSchema)
module.exports = subModel