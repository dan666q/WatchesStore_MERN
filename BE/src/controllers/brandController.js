const brands = require('../models/brand');
const watches = require('../models/watch');

class brandController {

    getAllBrand(req, res, next) {
        brands.find({}).then(categories => {
            res.render('brand', {
                title: 'List of Brands',
                categories: categories,
                baseURL: req.originalUrl
            });
        }).catch(next);
    }

    createNewBrand(req, res, next) {
        const { brandName } = req.body;
        brands.findOne({ brandName: brandName })
            .then(existingBrand => {
                if (existingBrand) {
                    req.flash('error_msg', 'Brand already exists');
                    return res.redirect('/brands');
                } else {
                    const newBrand = new brands({ brandName });
                    newBrand.save()
                        .then(() => {
                            req.flash('success_msg', 'Brand created successfully');
                            res.redirect('/brands');
                        })
                        .catch(next);
                }
            })
            .catch(next);
    }
    
    deleteBrand(req, res, next) {
        const { id } = req.params;
    
        watches.findOne({ brand: id })
            .then(watch => {
                if (watch) {
                    req.flash('error_msg', 'Brand cannot be deleted as it is associated with one or more watches');
                    return res.redirect('/brands');
                } else {
                    brands.findByIdAndDelete(id)
                        .then(() => {
                            req.flash('success_msg', 'Brand deleted successfully');
                            res.redirect('/brands');
                        }).catch(next);
                }
            }).catch(next);
    }
    

    getBrandById(req, res, next) {
        const { id } = req.params;
        brands.findById(id)
            .then(brand => {
                res.render('brandEdit', {
                    brand: brand
                })
            }).catch(next);
    }

    getBrandEditById(req, res, next) {
        const { id } = req.params;
        brands.findById(id)
            .then(brand => {
                res.render('brandEdit', {
                    title: brand.brandName,
                    brand: brand
                })
            }).catch(next);
    }

    updateBrandById(req, res, next) {
        const { brandName } = req.body;
        brands.findOne({ _id: req.params.id }) 
            .then(existingBrand => {
                if (!existingBrand) {   
                    req.flash('error_msg', 'Brand not found');
                    return res.redirect('/brands');
                }     
                brands.findOne({ brandName: brandName, _id: { $ne: req.params.id } })
                    .then(duplicateBrand => {
                        if (duplicateBrand) {                        
                            req.flash('error_msg', 'Brand name already exists');
                            return res.redirect('/brands');
                        } else {                       
                            brands.updateOne({ _id: req.params.id }, req.body)
                                .then(() => {
                                    req.flash('success_msg', 'Brand updated successfully');
                                    res.redirect('/brands');
                                })
                                .catch(next);
                        }
                    })
                    .catch(next);
            })
            .catch(next);
    }
    

}

module.exports = new brandController();
