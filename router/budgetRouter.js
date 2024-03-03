const express= require("express")

const {createBudget, getAllBudgets, deleteBudget, updateBudget, calculateAmountSpent, calculateRemainingBalance }=require('../controller/budgetController')
const{authMiddleware,checkDirector}=require("../middleware/authorization")
const router= express.Router()

router.post("/createBudget",authMiddleware,createBudget )
 
 router.get("/getAllBudgets", getAllBudgets)

 router.get("/amountSpent/:budgetId", calculateAmountSpent)

 router.get("/budgetBalance/:budgetId", calculateRemainingBalance)

 router.put("/updateBudget/:id", updateBudget)

 router.put("/amountSpent/:id", updateBudget)

 router.put("/budgetBalance/:id", updateBudget)

 
 router.delete("/deletebudget",authMiddleware,checkDirector, deleteBudget)

 module.exports= router
