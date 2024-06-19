// Import models
const User = require('../models/user');

// Import async
const asyncHandler = require('express-async-handler');

// Import validator
const { body, validationResult } = require('express-validator');

// Import mongoose
const mongoose = require('mongoose');

// REspond with a list of all users
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    // Get all users
    const users = await User.find()
        .sort({ name: 1 });

    // Check for errors
    if (users.length === 0) {
        res.status(404).json({ error: 'Users not found' });
        return;
    }

    res.json(users);
});

// Respond with a json object of a specific user
exports.getUserById = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user == null) {
            const error = new Error();
            error.message = 'User not found';
            error.status = 404;
            next(error);
        } else {
            res.json(user);
        }
    } catch (err) {
        next(err);
    }
});

// Handle user create on POST
exports.createUser = [
    // Validate and sanitize fields
    body('name', 'Name must not be empty and must not have more than 100 characters.')
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape(),
    body('email', 'Email must not be empty, must not have more than 100 characters and needs to have a valid format.')
        .trim()
        .isLength({ min: 1, max: 100 })
        .isEmail()
        .escape(),
    body('password', 'Password must not be empty and must not have more than 30 characters.')
        .trim()
        .isLength({ min: 1, max: 30 })
        .escape(),
    body('type', 'Type must not be empty and must be either admin or user.')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .isIn(['admin', 'user']),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Check if the user already exists (name and email must be unique)
        const userWithThisEmailExists = await User.findOne({ email: req.body.email });
        const userWithThisNameExists = await User.findOne({ name: req.body.name });

        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        if (userWithThisNameExists) {
            res.status(400).json({ error: 'User with this name already exists' });
            return;
        }

        if (userWithThisEmailExists) {
            res.status(400).json({ error: 'User with this email already exists' });
            return;
        }

        // Create a new user
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type
        });

        try {
            // Save the user
            await user.save();
            res.json(user);
        } catch (err) {
            next(err);
        }
    })
];

// Handle user update on PUT
exports.updateUser = [
    // Validate and sanitize fields
    body('name', 'Name must not be empty and must not have more than 100 characters.')
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape(),
    body('email', 'Email must not be empty, must not have more than 100 characters and needs to have a valid format.')
        .trim()
        .isLength({ min: 1, max: 100 })
        .isEmail()
        .escape(),
    body('password', 'Password must not be empty and must not have more than 30 characters.')
        .trim()
        .isLength({ min: 1, max: 30 })
        .escape(),
    body('type', 'Type must not be empty and must be either admin or user.')
        .trim()
        .isLength({ min: 1 })
        .escape()
        .isIn(['admin', 'user']),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request
        const errors = validationResult(req);

        // Create a user object with escaped and trimmed data
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type,
            _id: req.params.id
        });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages
            res.json({ user: user, errors: errors.array() });
            return;
        }

        // Data from form is valid
        try {
            // Save user
            await User.findByIdAndUpdate(req.params.id, user, {});
            res.json(user);
        } catch (err) {
            next(err);
        }
    }),
];

// Handle user delete on DELETE
exports.deleteUser = asyncHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ error: 'Invalid ID' });
        return;
    }

    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
});