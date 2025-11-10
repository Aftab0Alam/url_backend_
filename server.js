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
// ✅ Allow both local + deployed frontends
const allowedOrigins = [
  'http://localhost:5173', // for Vite (dev)
  'http://localhost:3000', // for CRA (if used)
  'https://shortly-aft.onrender.com/' // ✅ your hosted frontend (no slash)
  
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('❌ Blocked by CORS:', origin);
        callback(new Error('CORS not allowed for this origin'));
      }
    },
    credentials: true,
  })
);

// ✅ Parse JSON body
app.use(express.json());

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
app.get('/', (req, res) => {
  res.send('🚀 URL Shortener API is running...');
});

app.use('/api/url', urlRoutes);
app.use('/', indexRoutes);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `✅ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  )
);
