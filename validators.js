import { body } from "express-validator";

export const registerValidators = [
    body('username').isLength({ min: 3 }).isString(),
    body('nickname').isLength({ min: 3 }).isString(),
    body('password').isLength({ min: 3 }).isString()
]

export const loginValidators = [
    body('username').isLength({ min: 3 }).isString(),
    body('password').isLength({ min: 3 }).isString()
]