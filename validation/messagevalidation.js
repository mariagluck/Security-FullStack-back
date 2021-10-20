import { body } from 'express-validator';

export const messagerules = [
    body("message").isLength({ min: 0, max: 120}).withMessage("message length must be between 0 and 120 characters"),
    body("message").isAlphanumeric("de-DE").withMessage("invalid chracters in message"),
    body("message").trim(),
    body("message").blacklist("e"),
];


// add this for the alphanumeric .matches(/^[A-Za-z\s]+$/) 