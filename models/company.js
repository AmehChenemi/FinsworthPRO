const mongoose= require("mongoose")

const companySchema= new mongoose.Schema({
    // fullNames:{
    //     type:String,
    //     required:true
    // },
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
        required:true
    },
   
    newCode:{
        type:String
    },
    company_code:{
        type:Number,       
    },
   userId:{
    type:String,
    require:true
   },
    userInput:{
        type:String
    },

    isVerified:{
        type:Boolean,
        default:false
    },
    
    // token:{
    //     type:String
        
    // },
    // confirmPassword:{
    //     type:String
        
    // },
    role:{
        type:String,
        Default:'Director'
    },
    profilePicture:{
        public_id:{
            type:String,
            required:false
        }, 
        url:{
            type:String,
            required:false
        },
    },

    budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Budget' }],
        
    accountManager:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Account Manager' }],

},{timestamps:true})


  const companyModel= mongoose.model("Company",companySchema)

  module.exports= companyModel