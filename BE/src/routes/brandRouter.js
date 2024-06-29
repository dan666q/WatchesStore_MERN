const express = require('express');
const categoryBrand = express.Router();
const { ensureAuthenticated, isAdmin } = require('../config/auth');
const brandController = require('../controllers/brandController');

// Middleware for all routes in this router
categoryBrand.use(ensureAuthenticated);

// Routes with isAdmin middleware for authorization
categoryBrand.route('/getAllBrands')
  .get(isAdmin, brandController.getAllBrands)
  .post(isAdmin, brandController.createNewBrand);
categoryBrand.route('/createNewBrand')
  .post(isAdmin, brandController.createNewBrand);

categoryBrand.route('/delete/:id')
  .delete(isAdmin, brandController.deleteBrand);

categoryBrand.route('/:id')
  .get(isAdmin, brandController.getBrandById);

categoryBrand.route('/edit/:id')
  .get(isAdmin, brandController.getBrandEditById)
  .put(isAdmin, brandController.updateBrandById);

module.exports = categoryBrand;
