const Joi = require("@hapi/joi");
//const Joi= require("joi")

const validateCreateUser = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().trim().required().messages({
            'string.empty': 'firstName cannot be empty.',
            'any.required': 'firstName is required.',
        }),
        lastName: Joi.string().trim().required().messages({
            'string.empty': 'lastname cannot be empty.',
            'any.required': 'lastname is required.',
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
        
        role: Joi.string().trim().messages({
            'string.empty': 'role cannot be empty.',
            'any.required': 'role is required.',
        })
        
        
    });

    return schema.validate(data, { abortEarly: false });
};

module.exports= {validateCreateUser}