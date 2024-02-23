
const express= require("express")

const router= express.Router()

const {createExpenses, getAllExpenses, getExpenses} = require('../controller/expenseController.js')
router.post('/create-expenses', createExpenses)
router.get('/get-all-expenses', getAllExpenses)
router.get('/get-expenses', getExpenses)

module.exports = router

