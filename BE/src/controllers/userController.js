const Accounts = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/auth');

class userController {
    formLogin(req, res, next) {
        res.json({
            message: 'Render login form',
            errors: []
        });
    }

    login(req, res, next) {
        const { username, password } = req.body;
        Accounts.findOne({ username }).then(account => {
            if (!account) {
                return res.status(400).json({ message: 'Incorrect Username' });
            }
            bcrypt.compare(password, account.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ message: 'Server error', error: err });
                }
                if (isMatch) {
                    const payload = { id: account._id, username: account.username };
                    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '1h' });
                    res.status(200).json({ token, user: account });
                } else {
                    return res.status(400).json({ message: 'Incorrect Password' });
                }
            });
        }).catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Server error', error: err });
        });
    }

    formRegister(req, res, next) {
        res.json({
            message: 'Render register form'
        });
    }

    createNewAccount(req, res, next) {
        const { username, password, name, YOB } = req.body;
        let errorMessages = [];
    
        if (!username || !password || !name || !YOB) {
            errorMessages.push('Please enter all fields');
        }
    
        if (password.length < 6) {
            errorMessages.push('Password must be at least 6 characters');
        }
    
        Accounts.findOne({ username }).then(account => {
            if (account) {
                errorMessages.push('Username already exists');
            }
    
            if (errorMessages.length > 0) {
                return res.status(400).json({ message: 'Validation error', errors: errorMessages });
            } else {
                const newAccount = new Accounts({ username, password, name, YOB });
                bcrypt.hash(newAccount.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({ message: 'Server error', error: err });
                    }
                    newAccount.password = hash;
                    newAccount.save().then(() => {
                        res.status(201).json({ message: 'Register successful' });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({ message: 'Server error', error: err });
                    });
                });
            }
        }).catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Server error', error: err });
        });
    }
    
    logout(req, res, next) {
        res.status(200).json({ message: 'Logout successful' });
    }

    profile(req, res, next) {
        res.status(200).json({
            title: 'Profile',
            user: req.user,
            baseUrl: req.originalUrl
        });
    }

    updateProfile(req, res, next) {
        const { name, username, YOB } = req.body;
        let errors = [];

        if (!name || !username || !YOB) {
            errors.push('Please enter all fields');
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation error', errors });
        } else {
            Accounts.findById(req.user._id).then((account) => {
                if (account.name === name && account.username === username && account.YOB == YOB) {
                    return res.status(200).json({ message: 'No changes detected' });
                } else {
                    Accounts.updateOne({ _id: req.user._id }, req.body).then(() => {
                        res.status(200).json({ message: 'Update profile successful' });
                    }).catch(next);
                }
            }).catch(next);
        }
    }

    changePassword(req, res, next) {
        let errors = [];
        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        if (!oldPassword || !newPassword || !confirmNewPassword) {
            errors.push('Please enter all fields');
        }

        if (newPassword.length < 6) {
            errors.push('Password must be at least 6 characters');
        }

        if (newPassword != confirmNewPassword) {
            errors.push('Password confirmation does not match password');
        }

        if (errors.length > 0) {
            return res.status(400).json({ message: 'Validation error', errors });
        } else {
            Accounts.findById(req.user._id).then((account) => {
                bcrypt.compare(oldPassword, account.password, (err, isMatch) => {
                    if (err) {
                        return res.status(500).json({ message: 'Server error', error: err });
                    }
                    if (isMatch) {
                        bcrypt.hash(newPassword, 10, (err, hash) => {
                            if (err) {
                                return res.status(500).json({ message: 'Server error', error: err });
                            }
                            Accounts.updateOne({ _id: req.user._id }, { password: hash }).then(() => {
                                res.status(200).json({ message: 'Change password successful' });
                            }).catch(next);
                        });
                    } else {
                        res.status(400).json({ message: 'Password incorrect' });
                    }
                });
            }).catch(next);
        }
    }
}

module.exports = new userController;
