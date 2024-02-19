const budgetModel= require("../models/budgetModel")
const userModel= require("../models/userModel")
const { DateTime } = require('luxon');

exports.createBudget = async (req, res) => {
    try {
        const { userId, categories, budgetType } = req.body;
  
        // Check if user is logged in
        if (!userId) {
            return res.status(401).json({ error: 'User must be logged in to create a budget' });
        }
  
        // Check if user exists
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found. Please log in to perform this operation.' });
        }
  
        // Check if categories are provided
        if (!categories || categories.length === 0) {
            return res.status(400).json({ error: 'At least one category is required' });
        }
  
        const validCategories = ['Food', 'Utilities', 'Travel', 'Salary', 'Other'];
        // Validate categories
        if (!categories.every(category =>
            typeof category === 'object' &&
            typeof category.category === 'string' &&
            typeof category.amount === 'number' &&
            validCategories.includes(category.category)
        )) {
            return res.status(400).json({ error: 'Invalid categories provided' });
        }
  
        // Set start and end dates based on budget type using Luxon
        let startDate, endDate;
        const now = DateTime.local(); // Get current date and time
        if (budgetType === 'monthly') {
            startDate = now.startOf('month'); // First day of current month
            endDate = now.endOf('month'); // Last day of current month
        } else if (budgetType === 'yearly') {
            startDate = now.startOf('year'); // First day of current year
            endDate = now.endOf('year'); // Last day of current year
        } else {
            return res.status(400).json({ error: 'Invalid budget type' });
        }
  
        // Create a new budget with Luxon dates
        const budget = new budgetModel({
            user: userId,
            startDate: startDate.toJSDate(), // Convert Luxon DateTime to JavaScript Date object
            endDate: endDate.toJSDate(), // Convert Luxon DateTime to JavaScript Date object
            categories: categories.map(category => ({
                category: category.category,
                amount: category.amount,
                date: category.date
            }))
        });
  
        // Save the budget
        const savedBudget = await budget.save();
  
        return res.status(201).json({ message: 'Budget created successfully', data: savedBudget });
    } catch (error) {
        console.error('Error creating budget:', error.message);
        return res.status(500).json(error.message);
    }
};

  
  exports.getAllBudgets= async(req,res)=>{

    const budgets= await budgetModel.find(req.params)
  
    if(!budgets){
      res.status(404).json('no users available')
    }
    else{
      res.status(200).json({message:"current budgets", budgets})
    }
  }

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
