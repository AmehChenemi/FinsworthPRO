const express= require("express")

 const{createUser,verify,login, getAllUsers, deleteUser, resetPassword, inviteUser, resendOTP, signOut, forgotPassword}= require('../controller/companyController')
 
 const{authMiddleware,checkDirector, isAdmin}=require("../middleware/authorization")

 const router= express.Router()
 router.post('/createUser',createUser)
 router.post("/verify/:userId", authMiddleware, verify)
 router.post("/resendOtp", resendOTP)
 router.post('/login', login)
 router.post("/resetPassword", resetPassword)
 router.post("/invite",authMiddleware, isAdmin, inviteUser)
 router.delete("/deleteUser",authMiddleware,checkDirector, deleteUser)
 router.get("/getAllUsers", getAllUsers)
 router.get("/signOut", authMiddleware,signOut)
 router.get("/forgotPassword", forgotPassword)
 
 

 module.exports= router