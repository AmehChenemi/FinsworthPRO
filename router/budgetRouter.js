const express= require("express")

const {createBudget, getAllBudgets, deleteBudget, updateBudget, calculateAmountSpent, calculateRemainingBalance }=require('../controller/budgetController')
const{authMiddleware,checkDirector,requireDirectorApproval}=require("../middleware/authorization")
const router= express.Router()

router.post("/createBudget",authMiddleware,createBudget )
 
//  router.get("/getAllBudgets", getAllBudgets)

 router.get("/amountSpent", calculateAmountSpent)

 router.get("/budgetBalance", calculateRemainingBalance)

 router.put("/updateBudget/:id", updateBudget)
 
//  router.delete("/deletebudget",authMiddleware,checkDirector, deleteBudget)

 module.exports= router
