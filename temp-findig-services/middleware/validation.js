const Joi = require('joi');
const { errorResponse } = require('../utils/response');

const validateLogin = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(1).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return errorResponse(res, error.details[0].message, 400);
    }
    next();
};

const validateSale = (req, res, next) => {
    const schema = Joi.object({
        product_name: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        unit_price: Joi.number().min(0).required(),
        customer_name: Joi.string().allow(''),
        customer_phone: Joi.string().allow(''),
        sale_date: Joi.date().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return errorResponse(res, error.details[0].message, 400);
    }
    next();
};

const validateRegister = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().min(6).required(),
        email: Joi.string().email(),
        full_name: Joi.string().max(100)
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return errorResponse(res, error.details[0].message, 400);
    }
    next();
};

module.exports = { validateLogin, validateSale, validateRegister };