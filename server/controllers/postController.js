// Import models
const Post = require('../models/post');
const getDevToArticles = require('../utils/ai-posts-creator/devToUrlsRecoverer');
const fetchArticleContent = require('../utils/ai-posts-creator/htmlParser');
const articlesHandler = require('../utils/ai-posts-creator/articlesHandler');
const shareOnLinkedInFeed = require('../utils/ai-posts-creator/shareOnLinkedInFeed');

// Import async
const asyncHandler = require('express-async-handler');

// Import validator
const { body, validationResult } = require('express-validator');

// Import mongoose
const mongoose = require('mongoose');

// Function to decode the image URL
function decodeImageURL(imageURL) {
    const entities = {
        '&%23x2F;': '/',
        '&#x2F;': '/',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
    };
    return imageURL.replace(/&%23x2F;|&#x2F;|&amp;|&lt;|&gt;|&quot;|&#39;/g, function (match) {
        return entities[match];
    });
};

// Respond with a json list of all published posts
exports.getPublishedPosts = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Página actual
    const limit = 6; // Número de posts por página

    try {
        const skip = (page - 1) * limit; // Número de posts que se saltan

        // Get all published posts
        const posts = await Post.find({ published: true })
            .sort({ created_at: -1 })
            .populate('author')
            .skip(skip) // Saltar posts
            .limit(limit); // Limitar el número de posts

        // Contar el número total de posts
        const totalPosts = await Post.countDocuments({ published: true });

        if (totalPosts === 0) {
            res.status(404).json({ error: 'Posts not found' });
            return;
        }

        res.json({ 
            posts: posts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts: totalPosts,
            postsPerPage: limit,
        });

    } catch (error) {
        res.status(500).json({ error: 'Error loading posts from the database' });
        console.error("Error loading posts from the database", error);
    }
});

// Respond with a json list of all posts
exports.getAllPosts = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; // Página actual
    const limit = parseInt(req.query.limit) || 6; // Número de posts por página

    try {
        const skip = (page - 1) * limit; // Número de posts que se saltan

        // Get all published posts
        const posts = await Post.find()
            .sort({ created_at: -1 })
            .populate('author')
            .skip(skip) // Saltar posts
            .limit(limit); // Limitar el número de posts

        // Contar el número total de posts
        const totalPosts = await Post.countDocuments();

        if (totalPosts === 0) {
            res.status(404).json({ error: 'Posts not found' });
            return;
        }

        res.json({ 
            posts: posts,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts: totalPosts,
            postsPerPage: limit,
        });

    } catch (error) {
        res.status(500).json({ error: 'Error loading posts from the database' });
        console.error("Error loading posts from the database", error);
    }
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
    body('source')
        .optional({ checkFalsy: true })
        .trim()
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
            source: decodeImageURL(req.body.source),
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

// Handle AI generated posts create on POST
exports.generatePosts = asyncHandler(async (req, res, next) => {
    // Only allow admin users to generate posts
    if (req.user.type !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Get top article urls from dev.to
        const urlsArray = await getDevToArticles(); // Get 3 articles URLs from DEV.to
        const rawArticlesArray = await Promise.all(urlsArray.map(fetchArticleContent)); // Get the content of the 3 articles
        const processedArticlesArray = await articlesHandler(rawArticlesArray);

        // Let's save all the titles in an array to use them to publish an article on LinkedIn
        const titlesArray = processedArticlesArray.map(article => article.title);

        // Share the articles on LinkedIn
        await shareOnLinkedInFeed(titlesArray);

        // Save every article as a post
        for (const article of processedArticlesArray) {
            const post = new Post({
                title: article.title,
                content: article.summary,
                image_url: article.image,
                published: true,
                created_at: Date.now(),
                author: req.user._id, // req.user is set in the auth middleware
                source: article.source,
            });

            await post.save();
        };

        res.json({ message: 'Posts generated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error generating posts' });
    }
});

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
    body('source')
        .optional({ checkFalsy: true })
        .trim()
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
            created_at: Date.now(),
            author: req.user._id, // req.user is set in the auth middleware
            _id: req.params.id,
            source: req.body.source,
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