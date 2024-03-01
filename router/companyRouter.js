const express = require("express")

// const { createUser, verify, login, getAllUsers, deleteUser, resetPassword, inviteUser, updateUser, resendOTP, signOut, forgotPassword } = require('../controller/companyController')
// const companyController = require('../controller/companyController')
const {createUser, verifyUser, login, inviteUser, resetPassword, forgotPassword, updateUser, changeProfilePicture, getAcctUsers, deleteUser, signout, resendOTP} = require('../controller/companyController')

const { authMiddleware, checkDirector, isAdmin } = require("../middleware/authorization.js")

const { validateCreateUser } = require("../validation/validation.js");

const router = express.Router()
router.post('/createUser', validateCreateUser, createUser)
router.post("/verify/:id", verifyUser)
router.put("/changeProfilePic", authMiddleware, changeProfilePicture)
router.post("/resendOtp", authMiddleware, resendOTP)
router.post('/login', login)
router.post('/reset-password/:token',resetPassword)
router.post("/invite", authMiddleware, isAdmin, inviteUser)
router.delete("/deleteUser/:id", authMiddleware, checkDirector, deleteUser)
router.get("/getAcctUsers",authMiddleware, getAcctUsers)
router.get("/signOut", authMiddleware, signout)
router.get("/forgotPassword", forgotPassword)
router.put('/update', authMiddleware, updateUser)



module.exports = router