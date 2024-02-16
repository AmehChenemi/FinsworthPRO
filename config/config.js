require("dotenv").config()
const mongoose= require("mongoose")

mongoose.connect(process.env.LINK).then(()=>{
    console.log("Finsworth is connected to this database")
}).catch((error)=>{
    console.log(error.message)
})