const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Book = require("../controller/BookController")

const reviewValidation = () => {
    return [
        check('mobileNumber').notEmpty().withMessage('Mobile number is required')
        .isNumeric().withMessage('Mobile number should be a number')
        .isLength({ min: 10, max: 10 }).withMessage('Mobile number must be exactly 10 digits long')
        .matches(/^[1-9][0-9]{9}$/).withMessage('Mobile number should not start with 0'),
        check('emailId', 'emailId is required').notEmpty(),
        
       
    ];
};

router.post('/add',
    reviewValidation(),
    (req, res, next) => {
        const userAgent = req.headers['screen'];
        if (!userAgent) {
            return res.status(400).json({ error: 'screen header is required' });
        }
        req.userAgent = userAgent;
        req.isMobile = /mobile/i.test(userAgent);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
            next();
    },
    Book.addBook
);

router.post('/book/:id',
    reviewValidation(),
    (req, res, next) => {
        const userAgent = req.headers['screen'];
        if (!userAgent) {
            return res.status(400).json({ error: 'screen header is required' });
        }
        req.userAgent = userAgent;
        req.isMobile = /mobile/i.test(userAgent);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
            next();
    },
    Book.getBookById
);

router.get("/search", Book.searchBooks) ;

module.exports = router;
