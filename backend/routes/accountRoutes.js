const express = require('express');
const User = require('../models/account');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Get User Details Route
router.get('/user', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Access denied. Invalid token format.' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');

        const user = await User.findById(decoded.id)
            .select('-password -__v')
            .lean();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }

        console.error('User details error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get All Users (Admin only)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
            .select('-password -__v')
            .lean();
        res.json(users);
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Update User
router.patch('/user/:id', async (req, res) => {
    try {
        const {
            first_name,
            last_name,
            email,
            phone_number,
            address,
            dob
        } = req.body;

        console.log(req.body);

        // Validate email format if provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Invalid email format' });
            }

            // Check if email is already taken by another user
            const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
            if (existingUser) {
                return res.status(400).json({ error: 'Email is already registered' });
            }
        }

        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.first_name = first_name || user.first_name;
        user.last_name = last_name || user.last_name;
        user.email = email || user.email;
        user.phone_number = phone_number || user.phone_number;
        user.address = address || user.address;
        user.dob = dob || user.dob;
        user.updatedAt = new Date();

        const updatedUser = await user.save();

        res.json(user);
    } catch (err) {
        console.error('Update user error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update User Photo
router.patch('/user/:id/photo', upload.single('photo'), async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No photo uploaded' });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.photo = imageUrl;
        user.updatedAt = new Date();
        const updatedUser = await user.save();
        
        res.json({
            message: 'Photo updated successfully',
            photo: updatedUser.photo
        });
    } catch (err) {
        console.error('Update photo error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete User
router.delete('/user/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete user error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Change Password
router.put('/user/:id/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Validate new password
        if (newPassword.length < 8) {
            return res.status(400).json({ error: 'New password must be at least 8 characters long' });
        }

        // Hash and update password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        user.updatedAt = new Date();
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
