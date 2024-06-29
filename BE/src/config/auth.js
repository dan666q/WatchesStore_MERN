const jwt = require('jsonwebtoken');
const Accounts = require('../models/user');

module.exports = {
    jwtSecret: 'your_secret_key',

    ensureAuthenticated: async (req, res, next) => {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        try {
            const decoded = jwt.verify(token.split(' ')[1], module.exports.jwtSecret); // Extract token from 'Bearer <token>'
            const user = await Accounts.findById(decoded.id).exec();
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            req.user = user;
            next();
        } catch (err) {
            console.error('Failed to authenticate token:', err);
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
    },

    isAdmin: (req, res, next) => {
        if (req.user && req.user.isAdmin) {
            return next();
        }
        res.status(403).json({ message: 'You are not authorized to view this page!' });
    }
};
