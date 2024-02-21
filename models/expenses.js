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

const expensesModel = model.mongoose('expenses', expenseSchema)
module.exports = expensesModel  