const express= require("express")

const {createBudget, getAllBudgets, deleteBudget }=require('../controller/budgetController')
const{authMiddleware,isAdmin,checkDirector}=require("../middleware/authorization")
const router= express.Router()

router.post("/createBudget",createBudget )
 
 router.get("/getAllBudgets", getAllBudgets)
 
 router.delete("/deletebudget",authMiddleware,isAdmin,checkDirector, deleteBudget)

 module.exports= router
