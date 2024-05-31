import {validationResult} from "express-validator";

export function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    if(errors.lenght) {
        return res.status(400).json({message: 'Failed to register'});
    }
    next();
}