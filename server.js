const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const LICFeedback = require('./models/LICFeedback');
const LICQuery = require('./models/LICQuery');
const LICReview = require('./models/LICReview');
const LICRating = require('./models/LICRating');
const homePageSSR = require('./ssrpages/homePageSSR');
const joinLicSSR = require('./ssrpages/joinLicSSR');
const aboutLicSSR = require('./ssrpages/aboutLicSSR');
const serviceLicSSR = require('./ssrpages/serviceLicSSR');
const reviewLicSSR = require('./ssrpages/reviewLicSSR');
const bimaSakhiSSR = require('./ssrpages/bimaSakhiSSR');
const mahilaLicSSR = require('./ssrpages/mahilaLicSSR');


const faqSSR = require('./ssrpages/faqSSR');
const session = require('express-session');
const serverless = require('serverless-http');
const cors = require('cors'); // Add CORS package



dotenv.config();

const app = express();
// Configure CORS to allow requests from CloudFront domain
app.use(cors({
  origin: 'https://www.licneemuch.space',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
// Log environment variables
console.log('Environment variables during startup:');
console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI_LIC:', process.env.MONGODB_URI_LIC ? '[REDACTED]' : 'Not set');
console.log('NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI_LIC, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Keep Lambda warm by rotating through all GET endpoints
if (process.env.NODE_ENV !== 'test') {
  const keepAliveUrls = [
    'https://2rw0yilbbl.execute-api.ap-south-1.amazonaws.com/prod/', // SSR route
    'https://2rw0yilbbl.execute-api.ap-south-1.amazonaws.com/prod/api/lic/feedbacks',
    'https://2rw0yilbbl.execute-api.ap-south-1.amazonaws.com/prod/api/lic/queries',
    'https://2rw0yilbbl.execute-api.ap-south-1.amazonaws.com/prod/api/lic/reviews',
    'https://2rw0yilbbl.execute-api.ap-south-1.amazonaws.com/prod/api/lic/ratings',
  ];
  let urlIndex = 0;

  setInterval(async () => {
    try {
      const keepAliveUrl = keepAliveUrls[urlIndex];
      console.log(`Keeping Lambda warm by pinging: ${keepAliveUrl}`);
      await fetch(keepAliveUrl);
      console.log('Keep-alive ping successful');
      // Rotate to the next URL
      urlIndex = (urlIndex + 1) % keepAliveUrls.length;
    } catch (error) {
      console.error(`Keep-alive request failed for ${keepAliveUrls[urlIndex]}: ${error.message}`);
    }
  }, 5 * 60 * 1000); // 5 minutes
}

// SSR Route - Takes precedence for /
app.use('/', homePageSSR);
app.use('/faqs', faqSSR)

app.use('/join', joinLicSSR)
app.use('/about', aboutLicSSR)
app.use('/services', serviceLicSSR)
app.use('/reviews', reviewLicSSR)
app.use('/bimasakhi', bimaSakhiSSR)
app.use('/mahila-lic', mahilaLicSSR)

// Serve static assets (Vite build) with logging
const staticMiddleware = express.static(path.join(__dirname, 'dist'));
app.use((req, res, next) => {
  console.log(`Attempting to serve static file: ${req.url}`);
  staticMiddleware(req, res, (err) => {
    if (err) {
      console.error(`Static file error for ${req.url}:`, err);
      return next(err);
    }
    if (!res.headersSent) {
      console.log(`Static file not found: ${req.url}, proceeding to next middleware`);
      next();
    } else {
      console.log(`Static file served: ${req.url}`);
    }
  });
});

// API Endpoints
app.post('/api/lic/submit-feedback', async (req, res) => {
  try {
    const { name, email, feedback } = req.body;
    if (!name || !feedback) {
      return res.status(400).json({ error: 'Name and feedback are required' });
    }
    const newFeedback = new LICFeedback({ name, email, feedback });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/lic/feedbacks', async (req, res) => {
  try {
    const feedbacks = await LICFeedback.find();
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/lic/submit-query', async (req, res) => {
  try {
    const { name, email, query } = req.body;
    if (!name || !query) {
      return res.status(400).json({ error: 'Name and query are required' });
    }
    const newQuery = new LICQuery({ name, email, query });
    await newQuery.save();
    res.status(201).json({ message: 'Query submitted successfully' });
  } catch (error) {
    console.error('Error submitting query:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/lic/queries', async (req, res) => {
  try {
    const queries = await LICQuery.find();
    res.json(queries);
  } catch (error) {
    console.error('Error fetching queries:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/lic/reviews', async (req, res) => {
  try {
    const { username, comment } = req.body;
    if (!username || !comment) {
      return res.status(400).json({ error: 'Username and comment are required' });
    }
    const newReview = new LICReview({ username, comment });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error posting review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/lic/reviews', async (req, res) => {
  try {
    const reviews = await LICReview.find();
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/lic/ratings', async (req, res) => {
  try {
    const { userId, rating } = req.body;
    if (!userId || !rating) {
      return res.status(400).json({ error: 'User ID and rating are required' });
    }
    const existingRating = await LICRating.findOneAndUpdate(
      { userId },
      { rating },
      { upsert: true, new: true }
    );
    res.json(existingRating);
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/lic/ratings', async (req, res) => {
  try {
    const ratings = await LICRating.find();
    res.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Fallback for client-side routes - Exclude API and static asset routes
app.get('*', (req, res) => {
  if (req.url.startsWith('/api/') || req.url.startsWith('/assets/')) {
    console.log(`Skipping fallback for ${req.url}`);
    return res.status(404).send('Not found');
  }
  console.log(`Fallback route hit: ${req.url} at ${new Date().toISOString()}`);
  res.sendFile(path.join(__dirname, 'dist/index.html'), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error serving page');
    }
  });
});

module.exports.handler = serverless(app);