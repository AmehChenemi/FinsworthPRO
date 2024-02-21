const express= require("express")

const {createBudget, getAllBudgets, deleteBudget }=require('../controller/budgetController')
const{authMiddleware,isAdmin,checkDirector,requireDirectorApproval}=require("../middleware/authorization")
const router= express.Router()

router.post("/createBudget",requireDirectorApproval,createBudget )
 
 router.get("/getAllBudgets", getAllBudgets)
 
 router.delete("/deletebudget",authMiddleware,isAdmin,checkDirector, deleteBudget)

 module.exports= router
