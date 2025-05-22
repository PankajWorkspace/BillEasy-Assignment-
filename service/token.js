const express = require("express");
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.generateToken = async function (payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};


exports.verifyToken = async function (req, res, next) {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'Authorization header missing' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded, 'decoded')

        if (!decoded || !decoded.type) {
            return res.status(401).json({ message: 'Unrecognised token: Missing type' });
        }

        if (decoded.type === 'user') {
            const user = await kycLogin.findOne({ mobileNumber: decoded.mobileNumber, dependentName:decoded.dependentName });
            if (!user) {
                return res.status(401).json({ message: 'kyc user not found' });
            }
            if (token !== user.token) {
                return res.status(402).json({ message: 'expired token' });
            }

            req.userType = 'user'; 
            req.userData = user;

            next(); 
        } else {
            return res.status(401).json({ message: 'Unrecognised token' });
        }

    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(500).json({error: error });
    }
};
