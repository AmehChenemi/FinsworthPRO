const express= require("express")

 const{createUser,verify,login, getAllUsers, deleteUser, resetPassword, inviteUser, resendOTP, signOut, forgotPassword}= require('../controller/userController')
 
 const{authMiddleware,checkDirector}=require("../middleware/authorization")

 const router= express.Router()
 router.post('/createUser',createUser)
 router.post("/verify", authMiddleware, verify)
 router.post("/resendOtp", resendOTP)
 router.post('/login', login)
 router.post("/resetPassword", resetPassword)
 router.post("/invite",authMiddleware,checkDirector, inviteUser)
 router.delete("/deleteUser",authMiddleware,checkDirector, deleteUser)
 router.get("/getAllUsers", getAllUsers)
 router.get("/signOut", authMiddleware,signOut)
 router.get("/forgotPassword", forgotPassword)
 
 

 module.exports= router