const express = require('express');
const accountRouter = express.Router();
const { isAdmin, ensureAuthenticated } = require('../config/auth');

const accountController = require('../controllers/accountController');

accountRouter
.route('/getAllAccount')
.get(ensureAuthenticated, isAdmin, accountController.getAllAccount)

module.exports = accountRouter