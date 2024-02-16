const express= require("express")

 const{createUser,verify,login}= require('../controller/controller')
 const router= express.Router()
 router.post('/createUser',createUser)
 router.post("/verify/:id", verify)
 router.post('/login', login)

 module.exports= router