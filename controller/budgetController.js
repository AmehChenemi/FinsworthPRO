const budgetModel= require("../models/budgetModel")
const userModel= require("../models/userModel")

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
  
        // Set start and end dates based on budget type
        let startDate, endDate;
        if (budgetType === 'monthly') {
            const now = new Date();
            startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month
        } else if (budgetType === 'yearly') {
            const now = new Date();
            startDate = new Date(now.getFullYear(), 0, 1); // First day of current year
            endDate = new Date(now.getFullYear(), 11, 31); // Last day of current year
        } else {
            return res.status(400).json({ error: 'Invalid budget type' });
        }
  
        // Create a new budget with start and end dates
        const budget = new budgetModel({
            user: userId,
            startDate: startDate,
            endDate: endDate,
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
  