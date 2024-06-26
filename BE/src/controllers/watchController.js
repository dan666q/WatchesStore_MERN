const watches = require('../models/watch');
const brand = require('../models/brand');

class watchController {

    getAllWatch(req, res, next) {
        if (req.query.search) {
            watches.find({ name: { $regex: req.query.search, $options: 'i' } })
                .then((watch) => {
                    res.json({ title: 'Watch', watches: watch });
                })
                .catch(next);
        } else {
            watches.find({})
                .then((watch) => {
                    res.json({ title: 'Watch', watches: watch });
                })
                .catch(next);
        }
    }

    manageWatch(req, res, next) {
        let categories = [];
        brand.find({})
            .then((brands) => {
                categories = brands;
                return watches.find({}).populate('brand', 'brandName');
            })
            .then((watch) => {
                res.json({
                    title: 'Manage Watches',
                    watches: watch,
                    categories: categories
                });
            })
            .catch(next);
    }

    createNewWatch(req, res, next) {
        req.body.isAutomatic = req.body.isAutomatic === 'on';

        const watch = new watches(req.body);
        watches.findOne({ name: watch.name })
            .then((watchName) => {
                if (watchName) {
                    return res.status(400).json({ error_msg: 'Watch already exists' });
                } else {
                    return watch.save();
                }
            })
            .then(() => {
                res.status(201).json({ success_msg: 'Watch created successfully' });
            })
            .catch(next);
    }

    deleteWatch(req, res, next) {
        watches.findByIdAndDelete(req.params.id)
            .then(() => {
                res.json({ success_msg: 'Watch deleted successfully' });
            })
            .catch(next);
    }

    getWatchById(req, res, next) {
        watches.findById(req.params.id)
            .populate('brand', 'brandName')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'name'
                }
            })
            .then((watch) => {
                res.json({ title: watch.name, watch: watch });
            })
            .catch(next);
    }

    addComment(req, res, next) {
        const watchId = req.params.id;
        const { rating, comment } = req.body;
        const userId = req.user.id; 

        watches.findById(watchId)
            .then(watch => {
                if (!watch) {
                    return res.status(404).json({ error: 'Watch not found' });
                }
                if (watch.comments.length > 0) {
                    return res.status(400).json({ error_msg: 'Just 1 comment on a watch' });
                }
                const newComment = {
                    rating,
                    comment,
                    author: userId
                };

                watch.comments.push(newComment);

                return watch.save();
            })
            .then((watch) => {
                res.json({ success_msg: 'Comment added successfully', watch: watch });
            })
            .catch(next);
    }

    getWatchEditById(req, res, next) {
        let categories = [];
        brand.find({})
            .then((brands) => {
                categories = brands;
                return watches.findById(req.params.id).populate('brand', 'brandName');
            })
            .then((watch) => {
                res.json({
                    title: watch.name,
                    watch: watch,
                    categories: categories
                });
            })
            .catch(next);
    }

    updateWatchById(req, res, next) {
        req.body.isAutomatic = req.body.isAutomatic === 'on';
        watches.findOne({ _id: { $ne: req.params.id }, name: req.body.name })
            .then(existingWatch => {
                if (existingWatch) {
                    return res.status(400).json({ error_msg: 'This name already exists' });
                } else {
                    return watches.updateOne({ _id: req.params.id }, req.body);
                }
            })
            .then(() => {
                res.json({ success_msg: 'Watch updated successfully' });
            })
            .catch(next);
    }

    searchWatch(req, res, next) {
        watches.find({ name: { $regex: req.query.name, $options: 'i' } })
            .then((watch) => {
                res.json({ title: 'List of Watches', watches: watch });
            })
            .catch(next);
    }
}

module.exports = new watchController();
