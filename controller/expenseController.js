const expenseModel = require ('../models/expenseModel')
const budgetModel = require ('../models/budgetModel.js')
const companyModel = require('../models/company.js');

exports.createExpenses = async(req, res) => {
    try {
        // get the description, amount, and category from the request body
        const { description, amount, category } = req.body;

        // get the budget ID from the request parameters
        const budgetId = req.params.budgetId;

        // check if the budget exists in the database
        const checkBudget = await budgetModel.findById(budgetId);
        if (!checkBudget) {
            return res.status(400).json({
                message: "No Budget found"
            });
        }

        // check if the budget is approved by the director
        if (!checkBudget.approvedByDirector) {
            return res.status(404).json({
                message: 'Expenses cannot be made on this budget, budget must be approved by director before expenses can be made'
            });
        }

        // create an instance of the expenses
        const expenses = await expenseModel.create({
            description,
            amount,
            category,
            budgetId
        });

        // push the id of the expenses made to the array of expenses in the budget model
        checkBudget.expenses.push(expenses._id);

        // save the expenses made
        await expenses.save();
        await checkBudget.save();

        // return a success msg after creation
        res.status(201).json({
            message: 'Expenses created successfully',
            expenses
        });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

exports.getAllExpenses = async(req, res) => {
    try{

        // grt the company's id
        const companyId = req.params.companyId
        // find if the company is existing in the database
        const company = await companyModel.findOne({companyId})
        if(!company) {
        res.status(404).json({Mesage:"Company not found, cannot get all Expenses"})
        }
        //  find all the expenses from the expense database
        const allExpenses = await expenseModel.find({companyId}).populate("budgetId")
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


exports.getExpenses = async (req, res) => {
    try {
        // Get the budget id from the request params
        const budgetId = req.params.budgetId;

        // Check if the id is provided
        if (!budgetId) {
            return res.status(400).json({ error: "Budget ID not provided" });
        }

        // Find all expenses associated with the provided budget ID
        const expenses = await expenseModel.find({ budgetId });
        if (!expenses) {
            return res.status(200).json({ expenditure: [] });
        }
        res.status(200).json({ expenses });
    } catch (err) {
        console.error("Error fetching expenses:", err);
        res.status(500).json(err.message);
    }
};



