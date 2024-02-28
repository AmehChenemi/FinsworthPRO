const express= require("express")

const {  accountManagerSignup, accountManagerlogin, updateUser }= require("../controller/accountManagerCont")

const {accountManager} = require("../validation/validation")


const router= express.Router()

router.post("/accountManagerSignup", accountManager, accountManagerSignup)
router.post("/accountManagerLogin", accountManagerlogin)
router.put("/update", updateUser)

module.exports= router