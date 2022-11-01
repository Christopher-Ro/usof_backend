const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const admin = require('../middleware/admin');
const auth = require('../middleware/authorization');

// Global path will be /api/categories/

// GET /api/categories
router.get('/', async (req, res) => {
    res.send(await Category.getAllCategories());
});

// GET /api/categories
router.get('/:id', async (req, res) => {
    const category = await Category.getCategoryById(req.params.id);
    if (!category) {
        return res.status(404).send('Category does not exist');
    }
    res.send(category);
});

// POST /api/categories
router.post('/', auth, admin, async (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).send('Missing required parameter "title"');
    }
    const category = new Category(title, description ? description : '', -1);
    res.send(await category.saveSelf());
});

// PATCH /api/categories/{id}
router.patch('/:id', auth, admin, async (req, res) => {
    const { title, description } = req.body;
    const category = await Category.getCategoryById(req.params.id);
    if (!category) {
        return res.status(404).send('Category does not exist');
    }
    category.title = title ? title : category.title;
    category.description = description ? description : category.description;
    category.updateSelf();
    res.send(category);
});

// DELETE /api/categories/{id}
router.delete('/:id', auth, admin, async (req, res) => {
    const category = await Category.getCategoryById(req.params.id);
    if (!category) {
        return res.status(404).send('Category does not exist');
    }
    Category.deleteById(req.params.id);
    res.send("Deleted");
});

module.exports = router;
