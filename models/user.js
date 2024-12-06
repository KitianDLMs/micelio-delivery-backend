const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Rol = require('./rol');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: true },
    image: { type: String, default: null },
    password: { type: String, required: true },
    notification_token: { type: String, default: null },
    roles: [{ type: mongoose.Schema.Types.Map, ref: 'Rol' }],    
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

// Pre-save hook for password hashing
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Static method for finding a user by email
UserSchema.statics.findByEmail = async function (email) {
    return this.findOne({ email }).populate('roles.id');
};

// Static method for finding a user by ID
UserSchema.statics.findByIdWithRoles = async function (id) {
    return this.findById(id).populate('roles.id');
};

// Static method for finding delivery personnel
UserSchema.statics.findDeliveryMen = async function () {
    // const deliveryRoleId = /* Coloca aquí el ID del rol de delivery */;
    return this.find({ 'roles.id': deliveryRoleId }).select('email name lastname image phone');
};

// Method to update the user's notification token
UserSchema.methods.updateNotificationToken = async function (token) {
    this.notification_token = token;
    this.updated_at = Date.now();
    return this.save();
};

// Method to update the user's profile
UserSchema.methods.updateProfile = async function (userData) {
    this.name = userData.name || this.name;
    this.lastname = userData.lastname || this.lastname;
    this.phone = userData.phone || this.phone;
    this.image = userData.image || this.image;
    this.updated_at = Date.now();
    return this.save();
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
