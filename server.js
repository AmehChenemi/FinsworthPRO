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
const companyRouter= require("./router/companyRouter")
const budgetRouter= require("./router/budgetRouter")
const budgetApproval= require("./router/budgetApprovalRouter")
const expenseRouter= require("./router/expenseRouter")
const accountManagerRouter= require("./router/accountManagerRouter")
// app.use("/api",router,budgetRouter,budgetApproval,expenseRouter )
 app.use("/api",companyRouter,budgetRouter,budgetApproval ,expenseRouter,accountManagerRouter)

app.get("/",(req,res)=>{
res.send('WELCOME TO FINSWORTH, WHERE EXPENSE TRACKING IS MADE EASY')
})
 
const PORT= process.env.PORT
app.listen(PORT,()=>{
    console.log(`Finsworth is listening on port ${PORT}`)
})

