const express = require('express');
const categoryBrand = express.Router();
const { isAdmin } = require('../config/auth');

const brandController = require('../controllers/brandController');

categoryBrand
.route('/')
.get(isAdmin, brandController.getAllBrand)
.post(isAdmin, brandController.createNewBrand)

categoryBrand
.route('/delete/:id')
.get(isAdmin, brandController.deleteBrand)

categoryBrand
.route('/:id')
.get(isAdmin, brandController.getBrandById)

categoryBrand
.route('/edit/:id')
.get(isAdmin, brandController.getBrandEditById)
.post(isAdmin, brandController.updateBrandById)

module.exports = categoryBrand;