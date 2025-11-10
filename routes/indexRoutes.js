// routes/indexRoutes.js
import express from 'express';
import Url from '../models/Url.js';

const router = express.Router();

// @route   GET /:shortCode
// @desc    Redirect to original URL
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    // ✅ Match the same field name from your schema
    const url = await Url.findOne({ shortCode });

    if (url) {
      // Optional: track clicks
      url.clicks++;
      await url.save();

      // Redirect to original link
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ message: 'No URL found' });
    }
  } catch (err) {
    console.error('Redirect Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
