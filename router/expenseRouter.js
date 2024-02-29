
const express= require("express")

const router= express.Router()

const {createExpenses, getAllExpenses, getExpenses} = require('../controller/expenseController.js')
const { checkBudgetMiddleware, requireDirectorApproval } = require("../middleware/authorization.js")

router.post('/create-expenses', requireDirectorApproval, checkBudgetMiddleware, createExpenses)
router.get('/get-all-expenses', getAllExpenses)
router.get('/get-expenses', getExpenses)

module.exports = router

