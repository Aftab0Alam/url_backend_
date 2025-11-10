// routes/indexRoutes.js
import express from 'express';
import Url from '../models/Url.js';

const router = express.Router();

// @route   GET /:shortCode
// @desc    Redirect to original URL
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find the URL mapping in the database
    const url = await Url.findOne({ shortCode });

    if (url) {
      // Update click count (Analytics feature)
      url.clicks++;
      await url.save();

      // Redirect the user to the original URL
      // Use 302 for temporary redirect (good for analytics)
      return res.redirect(url.originalUrl); 
    } else {
      // If short code not found
      return res.status(404).json('No URL found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
});

export default router;