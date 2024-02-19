const express= require("express")

 const{createUser,verify,login}= require('../controller/userController')
 const {createBudget }=require('../controller/budgetController')
 const router= express.Router()
 router.post('/createUser',createUser)
 router.post("/verify", verify)
 router.post('/login', login)
 router.post("/createBudget",createBudget )

 module.exports= router