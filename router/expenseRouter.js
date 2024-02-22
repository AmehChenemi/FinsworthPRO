const express= require("express")

const router= express.Router()
 
const{ createExpenses }= require("../controller/expenseController")
router.post("/createExpenses", createExpenses)



module.exports= router