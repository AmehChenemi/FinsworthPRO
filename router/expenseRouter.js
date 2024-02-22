
const express= require("express")

const router= express.Router()
 
const{ createExpenses }= require("../controller/expenseController")
router.post("/createExpenses", createExpenses)





const express = require('express')
const router = express.Router()

const {createExpenses, getAllExpenses, getExpenses} = require('../controller/expensesController.js')
router.post('/create-expenses', createExpenses)
router.get('/get-all-expenses', getAllExpenses)
router.get('/get-expenses', getExpenses)

module.exports = router

