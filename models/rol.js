const mongoose = require('mongoose');

// Definición del esquema de 'Rol'
const RolSchema = new mongoose.Schema({
    id_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    id_rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    image: { type: String, default: "" }, 
    name: { type: String },
    route: { type: String }
});

const Rol = mongoose.model('Rol', RolSchema);

module.exports = Rol;
