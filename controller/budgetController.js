const budgetModel = require("../models/budgetModel");
const companyModel = require("../models/company.js");
const { DateTime } = require('luxon');
const expenseModel= require("../models/expenseModel")
const {requireDirectorApproval} = require('../middleware/authorization.js')

exports.createBudget = async (req, res) => {
    try {
      
        // Extract user ID from authentication token
        const companyId = req.user._id;
         console.log(req.user)
        if (!companyId) {
            return res.status(401).json({ error: 'Unauthorized. Please log in to perform this operation.' });
        }
        // Check if user exists
        const company = await companyModel.findById(companyId);
        if (!company) {
            return res.status(404).json({ error: 'Company not found. Please log in to perform this operation.' });
        }

        
        const { amount, budgetType } = req.body;

        // Validate budget amount and type
        if (typeof amount !== 'number' || !['monthly', 'yearly'].includes(budgetType)) {
            return res.status(400).json({ error: 'Invalid budget amount or type' });
        }

       
        let startDate, endDate;
        const now = DateTime.local(); 
        if (budgetType === 'monthly') {
            startDate = now.startOf('month'); 
            endDate = now.endOf('month'); 
        } else if (budgetType === 'yearly') {
            startDate = now.startOf('year'); 
            endDate = now.endOf('year'); 
        } else {
            return res.status(400).json({ error: 'Invalid budget type' });
        }
      
        const budget = new budgetModel({
            company: company.company_Name,
            startDate: startDate.toJSDate(),
            endDate: endDate.toJSDate(),
            amount,
            budgetType
        });

        // Save the budget
        const savedBudget = await budget.save();

        // Update user's budgets array to include the newly created budget
        company.budgets.push(savedBudget._id);
        await company.save();

        return res.status(201).json({ message: 'Fixed budget created successfully', savedBudget });
    } catch (error) {
        console.error('Error creating fixed budget:', error);
        return res.status(500).json(error.message);
    }
};

exports.calculateAmountSpent = async (req, res) => {
    try {
        const { budgetId } = req.params;

        if (!budgetId) {
            return res.status(400).json('BudgetId is required');
        }

        const budget = await budgetModel.findById(budgetId);
        if (!budget) {
            return res.status(404).json('Budget not found');
        }

        // Initialize totalAmountSpent to 0
        let totalAmountSpent = 0;

        // Iterate over each expense ID in the budget and sum up the amounts
        for (const expenseId of budget.expenses) {
            // Find the expense document by ID
            const expense = await expenseModel.findById(expenseId);
            if (expense) {
                totalAmountSpent += parseFloat(expense.amount);
            }
        }

        return res.json({ totalAmountSpent });
    } catch (error) {
        console.error('Error calculating amount spent:', error);
        return res.status(500).json(error.message);
    }
};

exports.calculateRemainingBalance = async (req, res) => {
    try {
        const { budgetId } = req.params;

        if (!budgetId) {
            return res.status(400).json({ error: 'BudgetId is required' });
        }

        const budget = await budgetModel.findById(budgetId);
        console.log('Budget:', budget);

        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }

        // Calculate total amount spent
        let totalAmountSpent = 0;

        for (const expenseId of budget.expenses) {
            const expense = await expenseModel.findById(expenseId);
            console.log('Expense:', expense);

            if (expense) {
                totalAmountSpent += parseFloat(expense.amount);
            }
        }

        console.log('Total Amount Spent:', totalAmountSpent);

        // Check if there are no expenses associated with the budget
        if (totalAmountSpent === 0) {
            // If no expenses, remaining balance equals the budget amount
            return res.json({ remainingBalance: budget.amount });
        }

        // Calculate remaining balance
        const remainingBalance = budget.amount - totalAmountSpent;
        console.log('Remaining Balance:', remainingBalance);

        return res.json({ remainingBalance });
    } catch (error) {
        console.error('Error calculating remaining balance:', error);
        return res.status(500).json(error.message);
    }
};

exports.updateBudget = async(req,res) => {
    try{
      const budgetId = req.params.id
    //   console.log(req.user)
      const user = await budgetModel.findById(budgetId)
      console.log(user)
      if(!user) {
        return res.status(404).json({message:"Budget not found"})
      }
      const data={
  budgetType: req.body.budgetType,
  amount:req.body.amount
      }
  
      const updates = await companyModel.findByIdAndUpdate(budgetId, {data:true}, {new:true})
      if(updates){
        return res.status(200).json({message:"Budget details has been edited successfully"},updates, user)
      }
  
     } catch(error){
      console.error('error editing Budget details:', error)
      res.json({error:error.message})
    }
  }
  
  exports.getAllBudgets= async(req,res)=>{
try{
    const{companyId} = req.body
    const budgets= await budgetModel.find({companyId:companyId})
  
    if(!budgets.length ===0){
      return res.status(404).json('no budget available for the specified company available')
    }
    else{
      res.status(200).json({message:"current budgets", budgets})
    }
}catch(error){
    console.error('error getting all Budget details:', error)
    res.json({error:error.message})
}

};


  exports.deleteBudget = async (req, res) => {
    try {
        const { budgetId } = req.body;

        // Check if budgetId is provided
        if (!budgetId) {
            return res.status(400).json({ error: 'Budget ID is required' });
        }

        // Find the budget by ID and delete
        const deletedBudget = await budgetModel.findByIdAndDelete(budgetId);

        // Check if budget exists
        if (!deletedBudget) {
            return res.status(404).json({ error: 'Budget not found' });
        }

        return res.status(200).json({ message: 'Budget deleted successfully', data: deletedBudget });
    } catch (error) {
        console.error('Error deleting budget:', error.message);
        return res.status(500).json(error.message);
    }
};

exports.checkBudget = async (req, res) => {
    try {
        // Query the database to retrieve user's budget and expenses
        const userBudget = await budgetModel.findOne({ user: req.user._id });
        const totalExpenses = await expenseModel.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        if (!userBudget || !totalExpenses) {
            return res.status(500).json({ error: 'Error retrieving budget and expenses' });
        }
      const Director = await companyModel.findOne({ role: 'Director' });

      if (!Director) {
          return res.status(404).json({ message: 'Director not found' });
      }

        // Compare total expenses with the budget amount
        if (totalExpenses.total > userBudget.amount) {
            const message = `Your expenses have exceeded your budget of ${userBudget.amount}.`;
            await Email({
                 email: Director.email,
                  subject: 'Budget Alert', 
                  html: message });

            return res.status(200).json({ message: 'Budget alert email sent successfully' });
        }

        return res.status(200).json({ message: 'Budget is within limits' });
    } catch (error) {
        console.error('Error checking budget:', error);
        return res.status(500).json({ error:error.message});
    }
};

exports.calculateAverage = async (req, res) => {
    try {
        // Retrieve all budgets 
        const allBudgets = await budgetModel.find();

        // Retrieve all expenses 
        const allExpenses = await expenseModel.find();

        // Calculate total amount of budgets
        const totalBudgetAmount = allBudgets.reduce((acc, budget) => acc + budget.amount, 0);

        // Calculate total amount of expenses
        const totalExpenseAmount = allExpenses.reduce((acc, expense) => acc + expense.amount, 0);

        // Calculate average budget amount
        const averageBudgetAmount = allBudgets.length > 0 ? totalBudgetAmount / allBudgets.length : 0;

        // Calculate average expense amount
        const averageExpenseAmount = allExpenses.length > 0 ? totalExpenseAmount / allExpenses.length : 0;

        res.status(200).json({ 
            averageBudgetAmount,
            averageExpenseAmount
        });
    } catch (err) {
        console.error("Error calculating average:", err);
        res.status(500).json(err.message);
    }
};
