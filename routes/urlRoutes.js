// routes/urlRoutes.js
import express from 'express';
import { nanoid } from 'nanoid';
import Url from '../models/Url.js';

const router = express.Router();

// @route   POST /api/url/shorten
// @desc    Create short URL
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const baseUrl = process.env.BASE_URL;

  // Basic URL validation
  if (!originalUrl) {
    return res.status(400).json({ message: 'URL field is required' });
  }

  try {
    // 1. Check if the URL already exists in the database (to avoid duplication)
    let url = await Url.findOne({ originalUrl });

    if (url) {
      // If already shortened, return the existing short URL
      return res.json({ shortUrl: `${baseUrl}/${url.shortCode}` });
    } else {
      // 2. Generate a unique short code
      const shortCode = nanoid(7); // 7 characters long short code

      // 3. Create and save the new URL mapping
      url = new Url({
        originalUrl,
        shortCode,
        date: new Date(),
      });

      await url.save();

      // 4. Return the new short URL
      res.status(201).json({ shortUrl: `${baseUrl}/${shortCode}` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;