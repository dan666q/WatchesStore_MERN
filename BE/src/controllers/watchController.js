const watches = require('../models/watch')
const brand = require('../models/brand')

class watchController {

    getAllWatch(req, res, next) {
        if (req.query.search != undefined && req.query.search != '' && req.query.search != null) {
            watches.find({ name: { $regex: req.query.search } }).then((watch) => {
                res.render('watches', {
                    title: 'Watch',
                    watches: watch,
                    baseURL: req.originalUrl
                });
            }).catch(next);
        } else {
            watches.find({}).then((watch) => {
                res.render('watches', {
                    title: 'Watch',
                    watches: watch,
                    baseURL: req.originalUrl
                });
            }).catch(next);
        }
    }

    manageWatch(req, res, next) {
        let categories = []
        brand.find({}).then((brand) => {
            categories.push(...brand)
        }).catch(next);

        watches.find({}).populate('brand', 'brandName').then((watch) => {
            res.render('manageWatch', {
                title: 'Manage Watches',
                watches: watch,
                baseURL: req.originalUrl,
                categories: categories
            });
        }).catch(next);
    }

    createNewWatch(req, res, next) {
        req.body.isAutomatic === 'on' ? req.body.isAutomatic = true : req.body.isAutomatic = false;

        const watch = new watches(req.body);
        watches.findOne({ name: watch.name }).then((watchName) => {
            if (watchName) {
                req.flash('error_msg', 'Watch already exists');
                res.redirect('/watches');
            } else {
                watch.save().then(() => {
                    req.flash('success_msg', 'Watch created successfully');
                    res.redirect('/watches');
                }).catch(next);
            }
        }).catch(next);
    }

    deleteWatch(req, res, next) {
        watches.findByIdAndDelete(req.params.id).then(() => {
            req.flash('success_msg', 'Watch deleted successfully');
            res.redirect('/watches');
        }).catch(next);
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
                res.render('watchDetail', {
                    title: watch.name,
                    watch: watch,
                    baseURL: req.originalUrl
                });
            }).catch(next);
    }

    addComment(req, res, next) {
        const watchId = req.params.id;
        const { rating, comment } = req.body;
        const userId = req.user.id; 
    
        watches.findById(watchId)
            .then(watch => {
                if (!watch) {
                    return res.status(404).render('error', { error: 'Watch not found' });
                }
                if (watch.comments.length > 0) {
                    req.flash('error_msg', 'Just 1 comment on a watch');
                    return res.redirect(`/watches/${watchId}`);
                }
                const newComment = {
                    rating,
                    comment,
                    author: userId
                };
    
                watch.comments.push(newComment);
                req.flash('success_msg', 'Add comment successfully');
    
                return watch.save();
            })
            .then(watch => {
                return res.redirect(`/watches/${watchId}`);
            })
            .catch(next);
    }


    getWatchEditById(req, res, next) {
        let categories = []
        brand.find({}).then((brand) => {
            categories.push(...brand)
        }).catch(next);

        watches.findById(req.params.id).populate('brand', 'brandName').then((watch) => {
            res.render('watchEdit', {
                title: watch.name,
                watch: watch,
                categories: categories,
                baseURL: req.originalUrl
            });
        }).catch(next);
    }

    updateWatchById(req, res, next) {
        req.body.isAutomatic === 'on' ? req.body.isAutomatic = true : req.body.isAutomatic = false;
        watches.findOne({ _id: { $ne: req.params.id }, name: req.body.name })
            .then(existingWatch => {
                if (existingWatch) {
                    req.flash('error_msg', 'This name already exists');
                    return res.redirect('/watches');
                } else {
                    watches.updateOne({ _id: req.params.id }, req.body)
                        .then(() => {
                            req.flash('success_msg', 'Watch updated successfully');
                            res.redirect('/watches');
                        })
                        .catch(next);
                }
            })
            .catch(next);
    }


    searchWatch(req, res, next) {
        watches.find({ name: { $regex: req.query.name } }).then((watch) => {
            res.render('watches', {
                title: 'List of Watches',
                watches: watch,
                baseURL: req.originalUrl
            });
        }).catch(next);
    }
}

module.exports = new watchController();