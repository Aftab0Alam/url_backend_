import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

// Import Routes
import urlRoutes from './routes/urlRoutes.js';
import indexRoutes from './routes/indexRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// --- Middleware Setup ---
app.use(cors()); // ✅ Allow all origins (simple & safe for testing)
app.use(express.json()); // ✅ Parse JSON body

// --- Database Connection ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

// --- Routes ---
app.use('/api/url', urlRoutes); // Handles POST /api/url/shorten
app.use('/', indexRoutes);      // Handles GET /:shortCode redirects

// --- Default Route ---
app.get('/', (req, res) => {
  res.send('🚀 URL Shortener API is running...');
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});
