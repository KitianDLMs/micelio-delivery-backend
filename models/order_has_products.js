const mongoose = require('mongoose');

// Definición del esquema de 'OrderHasProducts'
const OrderHasProductsSchema = new mongoose.Schema({
    id_order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    id_product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const OrderHasProducts = mongoose.model('OrderHasProducts', OrderHasProductsSchema);

module.exports = OrderHasProducts;
