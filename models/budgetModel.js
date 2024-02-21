const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const validCategories = ['Food', 'Utilities', 'Travel', 'Salary', 'Other'];

const budgetSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    categories: [{
        category: { type: String, required: true, enum: validCategories },
        amount: { type: Number, default: 0 },
        date: { type: Date, default: Date.now } 
    }],
    startDate: { type: Date, required: true }, 

    endDate: { type: Date, required: true }   
    
});

const budgetModel= mongoose.model("Budget", budgetSchema)

module.exports = budgetModel



