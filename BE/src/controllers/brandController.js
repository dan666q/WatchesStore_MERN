const brands = require('../models/brand');
const watches = require('../models/watch');

class BrandController {

    // GET all brands
    async getAllBrands(req, res, next) {
        try {
            const categories = await brands.find({});
            res.json(categories);
        } catch (error) {
            next(error);
        }
    }

    // POST create new brand
    async createNewBrand(req, res, next) {
        const { brandName } = req.body;
        try {
            const existingBrand = await brands.findOne({ brandName: brandName });
            if (existingBrand) {
                return res.status(400).json({ error_msg: 'Brand already exists' });
            }
            const newBrand = new brands({ brandName });
            await newBrand.save();
            res.status(201).json({ success_msg: 'Brand created successfully' });
        } catch (error) {
            next(error);
        }
    }
    
    // DELETE brand by ID
    async deleteBrand(req, res, next) {
        const { id } = req.params;
        try {
            const watch = await watches.findOne({ brand: id });
            if (watch) {
                return res.status(400).json({ error_msg: 'Brand cannot be deleted as it is associated with one or more watches' });
            }
            await brands.findByIdAndDelete(id);
            res.json({ success_msg: 'Brand deleted successfully' });
        } catch (error) {
            next(error);
        }
    }

    // GET brand by ID
    async getBrandById(req, res, next) {
        const { id } = req.params;
        try {
            const brand = await brands.findById(id);
            if (!brand) {
                return res.status(404).json({ error_msg: 'Brand not found' });
            }
            res.json(brand);
        } catch (error) {
            next(error);
        }
    }

    // GET brand edit by ID (optional)
    async getBrandEditById(req, res, next) {
        const { id } = req.params;
        try {
            const brand = await brands.findById(id);
            if (!brand) {
                return res.status(404).json({ error_msg: 'Brand not found' });
            }
            res.json(brand);
        } catch (error) {
            next(error);
        }
    }

    // PUT update brand by ID
    async updateBrandById(req, res, next) {
        const { brandName } = req.body;
        const { id } = req.params;
        try {
            const existingBrand = await brands.findById(id);
            if (!existingBrand) {
                return res.status(404).json({ error_msg: 'Brand not found' });
            }
            const duplicateBrand = await brands.findOne({ brandName: brandName, _id: { $ne: id } });
            if (duplicateBrand) {
                return res.status(400).json({ error_msg: 'Brand name already exists' });
            }
            await brands.findByIdAndUpdate(id, req.body);
            res.json({ success_msg: 'Brand updated successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BrandController();
