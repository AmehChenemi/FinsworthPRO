const express= require("express")

 const{createUser,verify,login, getAllUsers}= require('../controller/userController')
 const {createBudget, getAllBudgets }=require('../controller/budgetController')
 const router= express.Router()
 router.post('/createUser',createUser)
 router.post("/verify", verify)
 router.post('/login', login)
 router.post("/createBudget",createBudget )
 router.get("/getAllUsers", getAllUsers)
 router.get("/getAllBudgets", getAllBudgets)

 module.exports= router