const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const expenseSchema = new mongoose.Schema({
    category: {
        type: String
    },
    description: {
        type: String
    },
    amount: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    PaymentMethod: {
        type: String
    },
    budgetId: {
        type: mongoose.Schema.Types.ObjectId
    },
}, { timestamps: true });

const expensesModel = mongoose.model('Expense', expenseSchema); 
module.exports = expensesModel;

