const expenseModel = require ('../models/expenseModel')
const budgetModel = require ('../models/budgetModel.js')

exports. createExpenses = async(req, res) =>{
    try{
        // get the budget id, description and amount from the request body
        const {category, description, budgetId, amount} = req.body
        // check if the budhet is existing in the database
        const checkBudget = await budgetModel.findById(budgetId)
        if(!checkBudget){
           return res.status(400).json({
                message:"No Budget found"
            })
        }
        // check if the budget ia approved by the director
        if(checkBudget.approvedByDirector === false)
        return res.status(404).json({
        message:'Expenses cannot be made on this budget, budget must be approved by director before expenses can be made'
       })

    //   if(checkBudget.approvedByDirector === true) 
    //   return res.status(200).json({
    //        message:'Budget approved for expenses'
    //    })

        //  check the amount that is allocated to each categories
        // if(checkBudget.categories.amount === 0 ){
        //  return res.status(400).json({message:'There is no budget allocated to this category'})
        // }
   
        //  create an instance of the expenses
       const expenses = await expenseModel.create({
         description, amount, category,
         budgetId
       })

    //    push the id of the expenses made to the array of expenses in the budget model
       checkBudget.expenses.push(expenses._id)

    //    save the expenses made
       const saveExpenses = await expenses.save()
       await checkBudget.save()

    //    return a succes msg after creation
       res.status(201).json({message:'Expenses created successfully',
        expenses:saveExpenses
    })
    // trow an error if there is
    }catch(err){
        res.status(500).json({
            error: err.message
        })
    }
}
exports.getAllExpenses = async(req, res) => {
    try{
        //  find all the expenses from the expense database
 const allExpenses = await expenseModel.find().populate("budgetId")
        // get the length of all expenses in the database
        const totalExpenses = allExpenses.length
        // check if there is no expenses in the database
        if(totalExpenses === 0){
            return res.status(200).json({message:'There are no expenditures made associated with this budget'})
        }
        // returns a success msg if there is
        else{
            res.status(200).json({
                message:`There are ${totalExpenses} expenditure(s) made from this budget`,
                allExpenses,totalExpenses
            })
        };

    }catch(err){
    res.status(500).json({
        error: err.message
    })
}
}


exports.getExpenses = async(req, res) => {
    try{
        // get the expense id from the req body
        const {id} = req.body
        // check if the id is existing in the database and populate the budget 
        const oneExpenses = await expenseModel.findById(id).populate("budgetId")
        if(!oneExpenses){ 
            return res.status(404).json({message: "There are no expenses recorded for this budget "})
        }
        else{
            res.status(200).json({expenditure:oneExpenses})
        }
}
 catch(err){
    res.status(500).json({
        error: err.message
    })
}
}
