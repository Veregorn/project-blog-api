const mongoose = require('mongoose');
const user = require('./user');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Virtual for comment's URL
commentSchema
    .virtual('url')
    .get(function () {
        return '/comments/' + this._id;
    });

// Virtual for comment's formatted date
commentSchema
    .virtual('timestamp_formatted')
    .get(function () {
        return this.timestamp.toDateString();
    });

// Export model
module.exports = mongoose.model('Comment', commentSchema);