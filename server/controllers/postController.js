// Import models
const Post = require('../models/post');
const User = require('../models/user');

// Import async
const asyncHandler = require('express-async-handler');

// Import validator
const { body, validationResult } = require('express-validator');

// Import mongoose
const mongoose = require('mongoose');

// Respond with a json list of all posts
exports.getAllPosts = asyncHandler(async (req, res, next) => {
    // Get all posts
    const posts = await Post.find()
        .sort({ created_at: -1 })
        .populate('author');

    // Check for errors
    if (posts.length === 0) {
        res.status(404).json({ error: 'Posts not found' });
        return;
    }

    res.json(posts);
});

// Respond with a json object of a specific post
exports.getPostById = asyncHandler(async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate('author');

        if (post == null) {
            const error = new Error();
            error.message = 'Post not found';
            error.status = 404;
            next(error);
        } else {
            res.json(post);
        }
    } catch (err) {
        next(err);
    }
});

// Handle post create on POST
exports.createPost = [
    // Validate and sanitize fields')
    body('title', 'Title must not be empty and must not have more than 100 characters.')
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape(),
    body('content', 'Content must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('image_url')
        .optional({ checkFalsy: true })
        .trim()
        .escape(),
    body('published', 'Published must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('created_at', 'Created at must not be empty.')
        .trim()
        .default(Date.now())
        .escape(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {

        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Only allow admin users to create posts
        if (req.user.type !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Create a post object with escaped and trimmed data
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            image_url: req.body.image_url,
            published: req.body.published,
            created_at: req.body.created_at,
            author: req.user._id, // req.user is set in the auth middleware
        });

        // Check for errors
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages
            res.json({ post: post, errors: errors.array() });
            return;
        } else {
            // Data from form is valid
            // Save post
            await post.save();
            res.json(post);
        }
    }),
];

// Handle post update on PUT
exports.updatePost = [
    // Validate and sanitize fields')
    body('title', 'Title must not be empty and must not have more than 100 characters.')
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape(),
    body('content', 'Content must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('image_url')
        .optional({ checkFalsy: true })
        .trim()
        .escape(),
    body('published', 'Published must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('created_at', 'Created at must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .default(Date.now)
        .escape(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Only allow admin users to create posts
        if (req.user.type !== 'admin') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Create a post object with escaped and trimmed data
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            image_url: req.body.image_url,
            published: req.body.published,
            created_at: req.body.created_at,
            author: req.user._id, // req.user is set in the auth middleware
            _id: req.params.id,
        });

        // Check for errors
        if (!errors.isEmpty()) {
            // There are errors. Respond with sanitized values/error messages
            res.json({ post: post, errors: errors.array() });
            return;
        } else {
            // Data from form is valid
            // Save post
            await Post.findByIdAndUpdate(req.params.id, post, {});
            res.json(post);
        }
    }),
];

// Handle post delete on DELETE
exports.deletePost = asyncHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    // Only allow admin users to create posts
    if (req.user.type !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting post' });
    }
});