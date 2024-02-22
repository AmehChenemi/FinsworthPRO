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
        type:String
      },
      date:{
        type:Date,
        default:Date.now
      },
     
      // user:{
      //   type:mongoose.Schema.Types.ObjectId,
      //   ref:'User'
      // },
      budgetId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Budget"
      },
},{timestamps:true})

const expensesModel = mongoose.model('expenses', expenseSchema)
module.exports = expensesModel  