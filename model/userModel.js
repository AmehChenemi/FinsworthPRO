const mongoose= require("mongoose")

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
   company_Name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true},
    // },
    // description:{
    //     type:String
    // },
    newCode:{
        type:String
    },
    role:{
        type:String,
        enum:['Director','Manager'],
        required: true
    },

    userInput:{
        type:String
    },
    

    isAdmin:{
        type:Boolean,
        default:false
        
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    
    token:{
        type:String
        
    },
    profilepicture:{
        public_id:{
            type:String,
            required:false
        },
        url:{
            type:String,
            required:false
        },
    },
    budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Budget' }]
    

},{timestamps:true})

// expenseSchema.pre("save", async function (next){
//     const salt= await bcrypt.genSaltSync(12)
//     this.password= await bcrypt.hash(this.password,salt)
//  })
//  expenseSchema.methods.isPasswordMatched= async function (enteredPassword){
//     return await  bcrypt.compare(enteredPassword,this.password)
// }

  const userModel= mongoose.model("User",userSchema)

  module.exports= userModel