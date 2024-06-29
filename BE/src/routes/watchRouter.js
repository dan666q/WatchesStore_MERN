const express = require('express');
const watchRouter = express.Router();
const { isAdmin, ensureAuthenticated } = require('../config/auth');

const watchController = require('../controllers/watchController');


watchRouter
.route('/manageWatch')
.get(ensureAuthenticated, isAdmin, watchController.manageWatch)
.post(ensureAuthenticated, isAdmin, watchController.createNewWatch)

watchRouter
.route('/delete/:id')
.delete(ensureAuthenticated, isAdmin, watchController.deleteWatch)

watchRouter
.route('/getWatchById/:id')
.get(watchController.getWatchById)
watchRouter
.route('/:id/comment')
.post(ensureAuthenticated, watchController.addComment)

watchRouter
.route('/edit/:id')
.get(ensureAuthenticated, isAdmin, watchController.getWatchEditById)
.put(ensureAuthenticated, isAdmin, watchController.updateWatchById)

module.exports = watchRouter;