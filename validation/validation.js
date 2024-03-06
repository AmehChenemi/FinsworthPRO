const Joi = require("@hapi/joi");

const validateCreateUser = (req, res, next) => {
    const validateCompanyAdmin = Joi.object({
        password: Joi.string().trim().required().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$')).messages({
            'string.empty': 'Password cannot be empty.',
            'string.min': 'Password must be at least {8} characters long.',
            'any.required': 'Password is required.',
            'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 digit.'
        }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Email cannot be empty.',
            'string.email': 'Please enter a valid email address.',
            'any.required': 'Email is required.',
        }),
        company_Name: Joi.string().trim().required().pattern(new RegExp('[A-Za-z]+(?:[\\s-][a-zA-Z]+)*$'))
        .messages({
          'string.base': 'Company name must be a string.',
          'string.empty': 'Company name cannot be empty.',
          'string.pattern.base': 'Company name must contain only letters, spaces, hyphen.',
          'any.required': 'Company name is required.',
        }),
        
        // role: Joi.string().trim().allow('').messages({
        //     'string.empty': 'Role cannot be empty.',
        // })
    });
      
    const {company_Name, email, password} = req.body
    const {error} = validateCompanyAdmin.validate({company_Name,password,email}, {abortEarly:false})
    
    if(error) {
        return res.status(400).json({
            error:error.details.map(detail => detail.message),
        })
    }
    next()

};

    // return schema.validate(data, { abortEarly: false });


// module.exports = { validateCreateUser };






const accountManager = (req,res,next) => {
    const validateAcctManager = Joi.object({
        fullName: Joi.string().trim().required().pattern(new RegExp('[A-Za-z]+(?:[\\s-][a-zA-Z]+)*$'))
        .messages({
          'string.base': 'Full name must be a string.',
          'string.empty': 'Full name cannot be empty.',
          'string.pattern.base': 'Full name must contain only letters, spaces, hyphen.',
          'any.required': 'Full name is required.',
        }),
        password: Joi.string().trim().required().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$')).messages({
            'string.empty': 'Password cannot be empty.',
            'string.min': 'Password must be at least {8} characters long.',
            'any.required': 'Password is required.',
            'string.pattern.base': 'Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 digit.'
        }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Email cannot be empty.',
            'string.email': 'Please enter a valid email address.',
            'any.required': 'Email is required.',
        }),
        // company_Name: Joi.string().trim().required().pattern(new RegExp('[A-Za-z]')).messages({
            // 'string.empty': 'Company name cannot be empty.',
            // 'string.base': 'Company name must be string.',
            // 'string.pattern.base': 'Company name must contain at least one letter.',
            
            // 'any.required': 'Company name is required.',
        // }),
        // role: Joi.string().trim().allow('').messages({
        //     'string.empty': 'Role cannot be empty.',
        // })
    });

    const {fullName,password,email} = req.body

    const {error} = validateAcctManager.validate({fullName,password,email}, {abortEarly:false})
    
    if(error) {
        return res.status(400).json({
            error:error.details.map(detail => detail.message),
        })
    }

    next()
    
};

module.exports = { validateCreateUser, accountManager };








