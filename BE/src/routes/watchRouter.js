const express = require('express');
const watchRouter = express.Router();
const { isAdmin } = require('../config/auth');

const watchController = require('../controllers/watchController');


watchRouter
.route('/')
.get(isAdmin, watchController.manageWatch)
.post(isAdmin, watchController.createNewWatch)

watchRouter
.route('/delete/:id')
.get(isAdmin, watchController.deleteWatch)

watchRouter
.route('/:id')
.get(watchController.getWatchById)
watchRouter
.route('/:id/comment')
.post(watchController.addComment)

watchRouter
.route('/edit/:id')
.get(isAdmin, watchController.getWatchEditById)
.post(isAdmin, watchController.updateWatchById)

module.exports = watchRouter;