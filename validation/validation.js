const Joi = require("@hapi/joi");

const validateCreateUser = (data) => {
    const schema = Joi.object({
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

    return schema.validate(data, { abortEarly: false });
};

module.exports = { validateCreateUser };






/*const Joi = require("@hapi/joi");
// const Joi= require("joi")

const validateCreateUser = (data) => {
    const schema = Joi.object({
        fullNames: Joi.string().trim().required().messages({
            'string.empty': 'fullNames cannot be empty.',
            'any.required': 'fullNames is required.',
            'pattern': '^[a-zA-Z]+(?:[\s'-][a-zA-Z]+)*$'
        }),
        password: Joi.string().trim().min(8).required().messages({
            'string.empty': 'Password cannot be empty.',
            'string.min': 'Password must be at least {8} characters long.',
            'any.required': 'Password is required.',
        }),
       
        email: Joi.string().email().messages({
            'string.empty': 'email cannot be empty.',
            'string.email': 'Please enter a valid email address.',
        }),
        company_Name: Joi.string().trim().required().messages({
            'string.empty': 'company_Name cannot be empty.',
            'any.required': 'company_Name is required.',
        }),
        
        // role: Joi.string().trim().messages({
            'string.empty': 'role cannot be empty.',
            'any.required': 'role is required.',
        })
        
        
    });

    return schema.validate(data, { abortEarly: false });
};

module.exports= {validateCreateUser}*/