const expenseModel = require ('../models/expenses.js')
const budgetModel = require ('../models/budgetModel')
exports. createExpenses = async(req, res) =>{
    try{
       const {category, description, amount } = req.body
       const checkCategories = await budgetModel.find({
       })
       if(!checkCategories){
        res.status(400).json({
            message:'Invalid category, category must be valid'
        })
       }
       const expenses = await expenseModel.create({
        category, description, amount
       })
       const saveExpense = await expenses.save()
       
       res.status(201).json({message:'Expenses created successfully'})
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
}