const expenseModel = require ('../models/expenses.js')
const budgetModel = require ('../models/budgetModel')
exports. createExpenses = async(req, res) =>{
    try{
        const {category, description, id, amount} = req.body
        const checkBudgetId = await budgetModel.FindById(id)
        if(!checkBudgetId){
            res.status(400).json({
                message:"No Budget found"
            })
        }

        const checkBudgetAmount = await budgetModel.find(amount)
        if(checkBudgetAmount.amount === 0 || checkBudgetAmount.amount ){

        }
        

    
       
      
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