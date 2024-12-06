const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    address: { type: String, required: true },
    neighborhood: { type: String, required: true },
    lat: { type: Number, default: null },
    lng: { type: Number, default: null },
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;
