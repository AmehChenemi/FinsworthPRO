const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const validCategories = ['Food', 'Utilities', 'Travel', 'Salary', 'Other'];

const budgetSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company', 
        // required: true
    },
    amount: {
        type:Number,
        default:0
    } ,
    budgetType:{
        type:String
    },
    startDate: { type: Date, required: true }, 
    endDate: { type: Date, required: true },

    approvedByDirector: {
        type: Boolean,
        default: false
    },
    date: { type: Date, default: Date.now } ,

    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expenses'
    }]
},{timestamps:true});

const budgetModel = mongoose.model("Budget", budgetSchema);

module.exports = budgetModel;
