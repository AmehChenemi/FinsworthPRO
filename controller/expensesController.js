const expenseModel = require ('../models/expensesModel.js')
const budgetModel = require ('../models/budgetModel.js')
exports. createExpenses = async(req, res) =>{
    try{
        const {description, budgetId, amount} = req.body
        const checkBudget = await budgetModel.findById(budgetId)
        if(!checkBudget){
           return res.status(400).json({
                message:"No Budget found"
            })
        }

        if(checkBudget.categories.amount === 0 ){
         return res.status(400).json({message:'There is no budget allocated to this category'})
        }
   
    
       const expenses = await expenseModel.create({
         description, amount,
         budgetId
       })
       checkBudget.expenses.push(expenses._id)
       
       const saveExpenses = await expenses.save()
       await checkBudget.save()

       
       res.status(201).json({message:'Expenses created successfully',
        expenses:saveExpenses
    })
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
}





exports.getAllExpenses = async(req, res) => {
    try{
        const allExpenses = await expenseModel.find()
        const totalExpenses = allExpenses.length
        if(totalExpenses === 0){
            return res.status(200).json({message:'There are no expenditures made associated with this budget'})
        }
        else{
            res.status(200).json({
                message:`There are ${totalExpenses} expenditure(s) made from this budget`,
                totalExpenses
            })
        };
}
 catch(err){
    res.status(500).json({
        error: err.message
    })
}
}


exports.getExpenses = async(req, res) => {
    try{
        const {id} = req.body
        const oneExpenses = await expenseModel.findById(id)
            return res.status(200).json({expenditure:oneExpenses})
       
}
 catch(err){
    res.status(500).json({
        error: err.message
    })
}
}