const expenses = require ('../models/expenses.js')

exports. createExpenses = async(req, res) =>{
    try{
       const {category, description, amount, } = req.body
       const categories = await budgetModel.findOne({category:categories})
       const expenses = await expenses.create({
        
       })
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
}