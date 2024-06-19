const express = require('express');
const router = express.Router();

// Import the controllers
const postController = require('../controllers/postController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Welcome to the Express API');
});

// Auth routes
//router.post('/auth/login', authController.login);
//router.post('/auth/register', authController.register);

// Post routes
router.get('/posts', postController.getAllPosts);
router.get('/posts/:id', postController.getPostById);
router.post('/posts', postController.createPost);
router.put('/posts/:id', postController.updatePost);
router.delete('/posts/:id', postController.deletePost);

// Comment routes
//router.get('/posts/:postId/comments', commentController.getAllComments);
//router.get('/posts/:postId/comments/:id', commentController.getCommentById);
//router.post('/posts/:postId/comments', commentController.createComment);
//router.put('/posts/:postId/comments/:id', commentController.updateComment);
//router.delete('/posts/:postId/comments/:id', commentController.deleteComment);

// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;