const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        max: 100
    },
    content: {
        type: String,
        required: true
    },
    image_url: {
        type: String  
    },
    published: {
        type: Boolean,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Virtual for post's URL
postSchema
    .virtual('url')
    .get(function () {
        return '/posts/' + this._id;
    });

// Virtual for post's formatted date
postSchema
    .virtual('created_at_formatted')
    .get(function () {
        return this.created_at.toDateString();
    });

// Export model
module.exports = mongoose.model('Post', postSchema);