const express= require("express")

const {  accountManagerSignup, accountManagerlogin }= require("../controller/accountManagerCont")

const router= express.Router()

router.post("/accountManagerSignup", accountManagerSignup)
router.post("/accountManagerLogin", accountManagerlogin)
module.exports= router