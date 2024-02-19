const mongoose = require('mongoose')
const {DateTime} = require('luxon')
const expenseSchema = new mongoose.Schema({
      category:{
        type:String
      },
      descrption:{
        types:String
      },
      amount:{
        type:Strings
      },
      date:{
        type:DateTime.now
      },
      PaymentMethod:{
        type:String
      }
},{timestamps:true})

const expenses = model.mongoose('expenses', expenseSchema)
module.exports = expenses  