const mongoose = require('mongoose');

// Definición del esquema de 'Category'
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
