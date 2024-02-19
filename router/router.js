const express= require("express")

 const{createUser,verify,login, getAllUsers, deleteUser, resetPassword}= require('../controller/userController')
 const {createBudget, getAllBudgets, deleteBudget }=require('../controller/budgetController')
 const router= express.Router()
 router.post('/createUser',createUser)
 router.post("/verify", verify)
 router.post('/login', login)
 router.post("/resetPassword", resetPassword)
 router.post("/createBudget",createBudget )
 router.get("/getAllUsers", getAllUsers)
 router.get("/getAllBudgets", getAllBudgets)
 router.delete("/deleteUser", deleteUser)
 router.delete("/deletebudget", deleteBudget)

 
 

 module.exports= router