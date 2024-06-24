// Import async
const asyncHandler = require('express-async-handler');

// Import validator
const { body, validationResult } = require('express-validator');

// Import mongoose
const mongoose = require('mongoose');

// Import models
const User = require('../models/user');

// Import jwt
const jwt = require('jsonwebtoken');

// Import bcrypt
const bcrypt = require('bcryptjs');

// Handle login on POST
exports.login = asyncHandler(async (req, res, next) => {
    // Validate and sanitize fields
    body('name', 'Name must not be empty and must not have more than 100 characters.')
        .trim()
        .isLength({ min: 1, max: 100 })
        .escape();
    body('password', 'Password must not be empty and must not have more than 30 characters.')
        .trim()
        .isLength({ min: 1, max: 30 })
        .escape();

    // Check for errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    // Find user
    const user = await User.findOne({ name: req.body.name });
    if (user == null) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
    
    // Check password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
        res.status(401).json({ error: 'Invalid password' });
        return;
    }

    try {
        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: 3600 });
        res.json({ token });
    } catch (err) {
        next(err);
    }
});