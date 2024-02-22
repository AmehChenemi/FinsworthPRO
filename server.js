const express= require("express")
const app= express()
const cors= require("cors")
app.use(cors())
app.use(express.json())
const fileUpload= require("express-fileupload")
app.use(fileUpload({
    useTempFiles:true,
    limits:{fileSize:5 * 1024 * 1024}
}))
require("./config/config")
const router= require("./router/userRouter")
const budgetRouter= require("./router/budgetRouter")
const budgetApproval= require("./router/budgetApprovalRouter")
const expenseRouter= require("./router/expenseRouter")

app.get("/",(req,res)=>{
res.send('FINSWORTH')
})
 app.use("/api/v1",router,budgetRouter,budgetApproval,expenseRouter )
const PORT= process.env.PORT
app.listen(PORT,()=>{
    console.log(`Finsworth is listening on port ${PORT}`)
})

