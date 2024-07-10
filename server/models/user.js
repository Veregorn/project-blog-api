const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 100
    },
    password: {
        type: String,
        required: true,
        max: 30
    },
    type: {
        type: String,
        required: true,
        enum: ['admin', 'user']
    },
});

// Virtual for user's URL
userSchema
    .virtual('url')
    .get(function () {
        return '/users/' + this._id;
    });

// Export model
module.exports = mongoose.model('User', userSchema);