import { body } from 'express-validator';

const userRegisterValidator = () => {
  return [
    body("email").trim().notEmpty().withMessage("Email is required").isEmail("Email is invalid"),
    body("username").trim().notEmpty().withMessage("Username is required").toLowerCase().withMessage("Username must be in lowercase").isLength({ min: 3 }).withMessage("Username must be of 3 characters long"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    body("fullName").optional().trim(),
  ]
}

const userLoginValidator = () => {
  return [
    body("email").trim().notEmpty().withMessage("Email is required").isEmail("Email is Invalid"),
    body("password").trim().notEmpty().withMessage("Password is required")
  ]
}

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("New Password is required")
  ]
}

const userForgotPasswordValidator = () => {
  return [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid"),
  ]
}

const userResetForgotPassword = () => {
  return [
    body("newPassword").notEmpty().withMessage("Password is required")
  ]
}


export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPassword,
}; 