const express = require('express');
const router = express.Router();
const useMock = process.env.MOCK_DB === 'true';
const Post = useMock ? require('../models/Post.mock') : require('../models/Post');
const Report = require('../models/Report');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const mongoose = require('mongoose');

// Upload an image and save to Cloudinary
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'share-dish',
      resource_type: 'image',
    });
    // Delete image from temporary storage after upload
    fs.unlinkSync(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ error: 'Failed to upload image to Cloudinary. Please try again.' });
  }
});

// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { photo, ingredients, allergies, city, address, time, description } = req.body;

    // Validate required fields
    if (!photo || !ingredients || !city || !address || !time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const post = new Post({
      user: req.user._id,
      photo,
      ingredients,
      allergies: allergies || [],
      city,
      address,
      time: new Date(time),
      description: description || '',
      reserved: false
    });

    await post.save();
    const populatedPost = await Post.findById(post._id).populate('user', 'firstName lastName avatar');
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error('Post creation error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to create post. Please try again.' });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'firstName lastName avatar');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reserve a post
router.patch('/:id/reserve', auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { reserved: true },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search posts by meal or city
router.get('/search', async (req, res) => {
  try {
    const { q, city } = req.query;
    let filter = {};
    if (q) {
      filter.ingredients = { $regex: q, $options: 'i' };
    }
    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }
    const posts = await Post.find(filter).populate('user', 'firstName lastName avatar');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Report a post
router.post('/:id/report', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const report = new Report({
      post: req.params.id,
      reporter: req.user._id,
      reason
    });
    await report.save();
    res.json({ message: 'Report submitted', report });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a post
router.patch('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }
    
    const updateFields = [
      'description', 'ingredients', 'allergies', 'city', 'address', 'time', 'photo'
    ];
    const updates = {};
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;