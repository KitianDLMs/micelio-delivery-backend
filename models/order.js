const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    clientId    : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    },
    deliveryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        enum: ['PAGADO', 'DESPACHADO', 'EN CAMINO', 'ENTREGADO'],
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        default: null
    },
    lng: {
        type: Number,
        default: null
    },
    products: [
        {
            id_product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                // required: true
            },
            quantity: {
                type: Number,
                // required: true
            }
        }
    ],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema);
