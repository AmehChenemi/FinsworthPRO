const mongoose = require('mongoose');
const {DateTime}=require ("luxon");
const datetime = DateTime.now();
const date = datetime.toFormat("yyyy-MM-dd");
const time = datetime.toFormat("HH:mm:ss");

const expenseSchema = new mongoose.Schema({
    category: {
        type: String
    },
    description: {
        type: String
    },
    amount: {
        type: Number
    },
    date: {
        type: String,
        default: date
    },
    time:{
        type: String,
        default: time
    },
    // PaymentMethod: {
    //     type: String
    // },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId
    },
}, { timestamps: true });

const expensesModel = mongoose.model('Expenses', expenseSchema); 
module.exports = expensesModel;

