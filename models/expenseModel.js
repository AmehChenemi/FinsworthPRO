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
        type: Number
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

const expensesModel = mongoose.model('Expenses', expenseSchema); 
module.exports = expensesModel;

