const express= require("express")
const budgetModel = require("../models/budgetModel");
const companyModel = require("../models/company");
// Controller function to approve a budget
exports.approveBudget = async (req, res) => {
    try {
        const budgetId  = req.params.budgetId;

        // Find the budget by ID
        const budget = await budgetModel.findById(budgetId);
        if (!budget) {
            return res.status(404).json({ error: 'Budget not found' });
        }

        // Ensure that only the director can approve budgets
        if (req.user.role !== 'Director') {
            return res.status(403).json({ error: 'Only directors can approve budgets' });
        }
        if (budget.approvedByDirector) {
            return res.status(400).json({ error: 'Budget is already approved' });
        }

        // Update the budget's approvedByDirector field to true
        budget.approvedByDirector = true;
        await budget.save();

        // Send a success response
        return res.status(200).json({ message: 'Budget approved successfully', data: budget });
    } catch (error) {
        console.error('Error approving budget:', error);
        return res.status(500).json(error.message);
    }
};
