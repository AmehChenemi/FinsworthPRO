const express= require("express")

const {createBudget, getAllBudgets, deleteBudget, calculateAmountSpent }=require('../controller/budgetController')
const{authMiddleware,isAdmin,checkDirector,requireDirectorApproval}=require("../middleware/authorization")
const router= express.Router()

router.post("/createBudget",authMiddleware,createBudget )
 
 router.get("/getAllBudgets", getAllBudgets)

 router.get("/amountSpent", calculateAmountSpent)
 
 router.delete("/deletebudget",authMiddleware,isAdmin,checkDirector, deleteBudget)

 module.exports= router
