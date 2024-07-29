// Import models
const Comment = require('../models/comment');
const User = require('../models/user');
const Post = require('../models/post');

// Import async
const asyncHandler = require('express-async-handler');

// Import validator
const { body, validationResult, check } = require('express-validator');

// Import mongoose
const mongoose = require('mongoose');

// Respond with a list of all comments for a specific post
exports.getAllCommentsInPost = asyncHandler(async (req, res, next) => {
    // Get all comments in a specific post
    const comments = await Comment.find({ post: req.params.postId })
        .sort({ timestamp: -1 })
        .populate('user')
        .populate('post');

    // Check for errors
    /* if (comments.length === 0) {
        res.status(404).json({ error: 'Comments not found' });
        return;
    } */

    res.json(comments);
});

// Respond with a list of the last 5 comments and the title of the post
exports.getLastComments = asyncHandler(async (req, res, next) => {
    try {
        const comments = await Comment.find()
            .sort({ timestamp: -1 })
            .limit(6)
            .populate('post', 'title')
            .populate('user', 'name');

        if (comments.length === 0) {
            res.status(404).json({ error: 'Comments not found' });
            return;
        }

        res.json(comments);
    } catch (err) {
        next(err);
    }
});

// Respond with a json object of a specific comment
exports.getCommentById = asyncHandler(async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id)
            .populate('user')
            .populate('post');

        if (comment == null) {
            const error = new Error();
            error.message = 'Comment not found';
            error.status = 404;
            next(error);
        } else {
            res.json(comment);
        }
    } catch (err) {
        next(err);
    }
});

// Handle comment create on POST
exports.createComment = [
    // Validate and sanitize fields
    body('content', 'Content must not be empty and must not be more than 500 chars.')
        .trim()
        .isLength({ min: 1, max: 500 })
        .escape(),
    body('user', 'User must not be empty and must be a valid MongoId.')
        .trim()
        .isLength({ min: 1 })
        .isMongoId()
        .withMessage('Invalid user ID')
        .escape(),
    check('postId', 'Post ID must be a valid MongoId.')
        .isMongoId()
        .withMessage('Invalid post ID'),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Check for valid ObjectIds
        const userId = req.body.user;
        const postId = req.params.postId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            res.status(400).json({ error: 'Invalid post ID' });
            return;
        }

        // Create a new comment object with escaped and trimmed data
        const comment = new Comment({
            content: req.body.content,
            post: req.params.postId,
            timestamp: Date.now(),
            user: req.body.user
        });

        // Check for user and post existence
        const userExists = await User.findById(req.body.user);
        const postExists = await Post.findById(req.params.postId);

        if (!errors.isEmpty()) {
            // There are errors. Send the form again with sanitized values/error messages
            res.status(400).json({ errors: errors.array() });
            return;
        }

        if (!userExists) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (!postExists) {
            res.status(404).json({ error: 'Post not found' });
            return;
        }

        try {
            // Data from form is valid
            // Save the comment
            await comment.save();
            res.status(201).json(comment);
        } catch (err) {
            next(err);
        }
    })
];

// Handle comment update on PUT
exports.updateComment = [
    // Validate and sanitize fields
    body('content', 'Content must not be empty and must not be more than 500 chars.')
        .trim()
        .isLength({ min: 1, max: 500 })
        .escape(),
    body('user', 'User must not be empty and must be a valid MongoId.')
        .trim()
        .isLength({ min: 1 })
        .isMongoId()
        .withMessage('Invalid user ID')
        .escape(),
    check('postId', 'Post ID must be a valid MongoId.')
        .isMongoId()
        .withMessage('Invalid post ID'),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Check for valid ObjectIds
        const userId = req.body.user;
        const postId = req.params.postId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            res.status(400).json({ error: 'Invalid post ID' });
            return;
        }

        // Create a comment object with escaped and trimmed data
        const comment = new Comment({
            content: req.body.content,
            post: req.params.postId,
            timestamp: Date.now(),
            user: req.body.user,
            _id: req.params.id
        });

        // Check for user and post existence
        const userExists = await User.findById(req.body.user);
        const postExists = await Post.findById(req.params.postId);

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages
            res.status(400).json({ comment: comment, errors: errors.array() });
            return;
        }

        if (!userExists) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (!postExists) {
            res.status(404).json({ error: 'Post not found' });
            return;
        } 

        // Data from form is valid
        try {
            // Save the comment
            await Comment.findByIdAndUpdate(req.params.id, comment, {});
            res.json(comment);
        } catch (err) {
            next(err);
        }
    }),
];

// Handle comment delete on DELETE
exports.deleteComment = asyncHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ error: 'Invalid ID' });
        return;
    }

    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);

        if (!comment) {
            res.status(404).json({ error: 'Comment not found' });
            return;
        }

        res.json({ message: 'Comment deleted successfully' });
    } catch (err) {
        next(err);
    }
});