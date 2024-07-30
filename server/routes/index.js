const express = require('express');
const router = express.Router();
const passport = require('passport');

// Import the controllers
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(`Welcome to the Express API server listening on port ${process.env.PORT}`);
});

// We need to protect create, edit and delete routes

// Auth routes
router.post('/auth/login', authController.login);

// Post routes
router.get('/posts/published', postController.getPublishedPosts);
router.get('/posts', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);
router.post('/posts', passport.authenticate('jwt', { session: false }), postController.createPost);
router.put('/posts/:id', passport.authenticate('jwt', { session: false }), postController.updatePost);
router.delete('/posts/:id', passport.authenticate('jwt', { session: false }), postController.deletePost);

// Comment routes
router.get('/posts/:postId/comments', commentController.getAllCommentsInPost);
router.get('/posts/:postId/comments/:id', commentController.getCommentById);
router.post('/posts/:postId/comments', passport.authenticate('jwt', { session: false }), commentController.createComment);
router.put('/posts/:postId/comments/:id', passport.authenticate('jwt', { session: false }), commentController.updateComment);
router.delete('/posts/:postId/comments/:id', passport.authenticate('jwt', { session: false }), commentController.deleteComment);
router.get('/comments/last', commentController.getLastComments);

// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', passport.authenticate('jwt', { session: false }), userController.updateUser);
router.delete('/users/:id', passport.authenticate('jwt', { session: false }), userController.deleteUser);

module.exports = router;