const express= require("express")

 const{createUser,verify,login, getAllUsers, deleteUser, resetPassword, inviteUser, resendOTP}= require('../controller/userController')
 
 const{authMiddleware,isAdmin,checkDirector}=require("../middleware/authorization")

 const router= express.Router()
 router.post('/createUser',createUser)
 router.post("/verify", verify)
 router.post("/resendOtp", resendOTP)
 router.post('/login', login)
 router.post("/resetPassword", resetPassword)
 router.post("/invite",authMiddleware,isAdmin,checkDirector, inviteUser)
 router.delete("/deleteUser",authMiddleware,checkDirector, deleteUser)
 router.get("/getAllUsers", getAllUsers)
 
 

 module.exports= router