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
        company_Name: Joi.string().trim().required().messages({
            'string.empty': 'Company name cannot be empty.',
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
        fullNames: Joi.string().trim().required().pattern(new RegExp('^[a-zA-Z]+(?:[\\s-][a-zA-Z]+)*$')).messages({
            'string.empty': 'Full names cannot be empty.',
            'any.required': 'Full names is required.',
            'string.pattern.base': 'Full names must contain only letters, spaces, and hyphens.'
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
        company_Name: Joi.string().trim().required().messages({
            'string.empty': 'Company name cannot be empty.',
            'any.required': 'Company name is required.',
        }),
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








