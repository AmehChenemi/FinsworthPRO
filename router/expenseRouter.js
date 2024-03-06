
const express= require("express")

const router= express.Router()

const {createExpenses, getAllExpenses, getExpenses} = require('../controller/expenseController.js')
// const { checkBudgetMiddleware } = require("../middleware/authorization.js")

router.post('/create-expenses/:budgetId', createExpenses)
router.get('/get-all-expenses', getAllExpenses)
router.get('/get-expenses/:id', getExpenses)

module.exports = router

