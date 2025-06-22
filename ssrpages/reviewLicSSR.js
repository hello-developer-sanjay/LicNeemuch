const express = require('express');
const compression = require('compression');
const crypto = require('crypto-js');
const { v4: uuidv4 } = require('uuid');
const LICFeedback = require('../models/LICFeedback');
const LICQuery = require('../models/LICQuery');
const LICReview = require('../models/LICReview');
const LICRating = require('../models/LICRating');

const router = express.Router();

// Enable compression middleware
router.use(compression());

// Enforce HTTPS and non-www redirects
router.use((req, res, next) => {
  const host = req.get('host');
  const isHttps = req.headers['x-forwarded-proto'] === 'https' || req.secure;

  if (host && (host.startsWith('www.') || !isHttps)) {
    const cleanHost = host.replace(/^www\./, '');
    const redirectUrl = `https://${cleanHost}${req.originalUrl}`;
    return res.redirect(301, redirectUrl);
  }

  res.removeHeader('X-Powered-By');
  next();
});

// Utility Functions
const escapeHTML = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const generateStarRating = (rating) => {
  let stars = '';
  for (let i = 0; i < 5; i++) {
    stars += `<span class="fa-star" style="color: ${i < rating ? 'var(--accent-color)' : '#555'}; margin-right: 0.3rem;">★</span>`;
  }
  return stars;
};

const fetchReviewsAndRatings = async () => {
  try {
    const [reviews, ratings] = await Promise.all([
      LICReview.find().lean(),
      LICRating.find().lean(),
    ]);

    const mappedReviews = reviews.map((review) => {
      const userId = crypto.MD5(review.username).toString();
      const rating = ratings.find((r) => r.userId === userId)?.rating || 0;
      return {
        quote: review.comment,
        author: review.username,
        rating,
      };
    });

    const averageRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

    return { reviews: mappedReviews, ratings, averageRating };
  } catch (error) {
    console.error('Error fetching reviews/ratings:', error);
    return { reviews: [], ratings: [], averageRating: 0 };
  }
};

// Render Functions
const renderHeader = () => `
  <header class="header" role="banner">
    <nav class="navbar" aria-label="Main navigation">
      <div class="navbar-brand">
        <a href="/" class="nav-logo" aria-label="LIC Neemuch Homepage">
          <img src="https://d12uvtgcxr5qif.cloudfront.net/images/html_2025-06-12_5bc78c6a-1a4b-4908-a854-356cce5ac68f.webp" alt="LIC Neemuch Logo" class="logo-img" width="44" height="44" loading="eager">
          <span>LIC Neemuch</span>
        </a>
        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span class="nav-toggle-icon"></span>
        </button>
      </div>
      <div class="nav-menu" id="nav-menu">
        <a href="/" class="nav-link" aria-label="Homepage">Home</a>
        <a href="/reviews" class="nav-link active" aria-current="page" aria-label="Customer Reviews">Reviews</a>
        <a href="/join" class="nav-link" aria-label="Join as LIC Agent">Join as Agent</a>
        <a href="/services" class="nav-link" aria-label="Insurance Services">Services</a>
        <a href="/about" class="nav-link" aria-label="About Us">About</a>
        <a href="/faqs" class="nav-link" aria-label="LIC FAQs">LIC FAQs</a>

      </div>
    </nav>
    <div class="hero-section" aria-labelledby="hero-title">
      <div class="hero-content">
        <h1 class="hero-title" id="hero-title" aria-label="LIC Neemuch Customer Reviews">
          <span lang="en">Hear from Our Happy Clients</span>
          <span lang="hi" class="hidden">हमारे खुश ग्राहकों की राय सुनें</span>
        </h1>
        <p class="hero-subtitle" lang="en">
          Discover why LIC Neemuch, led by Jitendra Patidar, is trusted for insurance services. Share your feedback or read reviews from Neemuch and beyond!
        </p>
        <p class="hero-subtitle" lang="hi" class="hidden">
          जानें कि जितेंद्र पाटीदार के नेतृत्व में एलआईसी नीमच बीमा सेवाओं के लिए क्यों भरोसेमंद है। अपनी प्रतिक्रिया साझा करें या नीमच और अन्य क्षेत्रों की समीक्षाएं पढ़ें!
        </p>
        <div class="hero-cta">
          <a href="#feedback" class="cta-button" aria-label="Share Feedback or Query">Share Feedback <span class="fa-icon">★</span></a>
          <a href="#review" class="cta-button" aria-label="Submit Review">Write a Review <span class="fa-icon">★</span></a>
          <a href="tel:+917987235207" class="cta-button secondary" aria-label="Contact Jitendra Patidar">Contact Us <span class="fa-icon">📞</span></a>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://d12uvtgcxr5qif.cloudfront.net/images/react_2025-06-12_4bd13d82-4fba-4a8e-8b2f-3c4d66b9f463.webp" alt="LIC Neemuch Reviews" loading="eager" width="500" height="333" onerror="this.src='https://via.placeholder.com/500x333?text=Image+Not+Found';">
      </div>
    </div>
  </header>
`;

const renderSidebar = () => `
  <aside class="sidebar" aria-label="Section navigation">
    <button class="sidebar-toggle" aria-label="Toggle sidebar" aria-expanded="true">
      <span class="sidebar-toggle-icon">☰</span>
    </button>
    <nav class="sidebar-nav" aria-label="Section links">
      <a href="#feedback" class="sidebar-link" aria-label="Submit Feedback">Submit Feedback</a>
      <a href="#review" class="sidebar-link" aria-label="Submit Review">Submit Review</a>
      <a href="#reviews" class="sidebar-link" aria-label="Customer Reviews">Customer Reviews</a>
      <a href="#ratings" class="sidebar-link" aria-label="Ratings Overview">Ratings Overview</a>
      <a href="#claims" class="sidebar-link" aria-label="Claim Settlements">Claim Settlements</a>
    </nav>
  </aside>
`;

const renderFeedbackForm = () => `
  <section class="section" id="feedback" aria-labelledby="feedback-heading">
    <h2 id="feedback-heading">Share Your Feedback or Query</h2>
    <p lang="en">
      Your feedback helps us improve! Share your thoughts about LIC Neemuch’s services or ask a query. Jitendra Patidar and his team value your input.
    </p>
    <p lang="hi">
      आपकी प्रतिक्रिया हमें बेहतर बनाने में मदद करती है! एलआईसी नीमच की सेवाओं के बारे में अपनी राय साझा करें या कोई प्रश्न पूछें। जितेंद्र पाटीदार और उनकी टीम आपके सुझावों को महत्व देती है।
    </p>
    <form class="contact-form" method="POST" action="/reviews/submit-feedback">
      <input type="text" name="name" placeholder="आपका नाम / Your Name" required aria-label="Name">
      <input type="email" name="email" placeholder="आपका ईमेल / Your Email" aria-label="Email">
      <textarea name="message" rows="4" placeholder="आपकी प्रतिक्रिया... / Your Feedback..." aria-label="Feedback"></textarea>
      <textarea name="query" rows="4" placeholder="आपका प्रश्न... / Your Query..." aria-label="Query"></textarea>
      <button type="submit" aria-label="Submit feedback or query">जमा करें / Submit</button>
    </form>
  </section>
`;

const renderReviewForm = () => `
  <section class="section" id="review" aria-labelledby="review-heading">
    <h2 id="review-heading">Submit Your Review</h2>
    <p lang="en">
      Share your experience with LIC Neemuch’s services. Your review and rating help others make informed decisions!
    </p>
    <p lang="hi">
      एलआईसी नीमच की सेवाओं के साथ अपने अनुभव साझा करें। आपकी समीक्षा और रेटिंग दूसरों को सूचित निर्णय लेने में मदद करती है!
    </p>
    <form class="contact-form" method="POST" action="/reviews/submit-review">
      <input type="text" name="username" placeholder="आपका नाम / Your Name" required aria-label="Username">
      <input type="email" name="email" placeholder="आपका ईमेल / Your Email" aria-label="Email">
      <div>
        <label for="rating" style="color: var(--text-color); margin-bottom: 0.5rem; display: block;">रेटिंग / Rating</label>
        <select name="rating" id="rating" required aria-label="Rating">
          <option value="">रेटिंग चुनें / Select Rating</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>
      <textarea name="comment" rows="4" placeholder="आपकी समीक्षा... / Your Review..." required aria-label="Review"></textarea>
      <button type="submit" aria-label="Submit review">समीक्षा जमा करें / Submit Review</button>
    </form>
  </section>
`;

const renderReviewsSection = (reviews) => `
  <section class="section" id="reviews" aria-labelledby="reviews-heading">
    <h2 id="reviews-heading">Customer Reviews</h2>
    <p lang="en">
      Hear from our clients about their experiences with LIC Neemuch’s insurance services, led by Jitendra Patidar. Your trust drives us!
    </p>
    <p lang="hi">
      जितेंद्र पाटीदार के नेतृत्व में एलआईसी नीमच की बीमा सेवाओं के साथ हमारे ग्राहकों के अनुभव सुनें। आपका भरोसा हमें प्रेरित करता है!
    </p>
    ${
      reviews.length === 0
        ? '<p>No reviews yet. Be the first to share your experience!</p>'
        : `
          <div class="review-carousel">
            ${reviews.map((review, index) => `
              <div class="review-card" style="display: ${index === 0 ? 'block' : 'none'};">
                <div class="star-rating">${generateStarRating(review.rating)}</div>
                <blockquote class="review-quote">${escapeHTML(review.quote)}</blockquote>
                <cite class="review-author">${escapeHTML(review.author)}</cite>
              </div>
            `).join('')}
          </div>
        `
    }
  </section>
`;

const renderRatingsSection = (averageRating, ratings) => `
  <section class="section" id="ratings" aria-labelledby="ratings-heading">
    <h2 id="ratings-heading">Ratings Overview</h2>
    <p lang="en">
      LIC Neemuch is proud to maintain a ${averageRating}/5 average rating from ${ratings.length} clients, reflecting our commitment to excellence in insurance services.
    </p>
    <p lang="hi">
      एलआईसी नीमच को ${ratings.length} ग्राहकों से ${averageRating}/5 की औसत रेटिंग प्राप्त है, जो बीमा सेवाओं में हमारी उत्कृष्टता के प्रति प्रतिबद्धता को दर्शाता है।
    </p>
    <div class="card-grid">
      <div class="card">
        <h3>Service Quality</h3>
        <div class="star-rating">${generateStarRating(Math.round(averageRating))}</div>
        <p>${averageRating}/5 from ${ratings.length} reviews</p>
      </div>
      <div class="card">
        <h3>Claim Support</h3>
        <div class="star-rating">${generateStarRating(Math.round(averageRating * 0.95))}</div>
        <p>${(averageRating * 0.95).toFixed(1)}/5 from ${ratings.length} reviews</p>
      </div>
      <div class="card">
        <h3>Customer Support</h3>
        <div class="star-rating">${generateStarRating(Math.round(averageRating * 0.98))}</div>
        <p>${(averageRating * 0.98).toFixed(1)}/5 from ${ratings.length} reviews</p>
      </div>
    </div>
  </section>
`;

const renderClaimsSection = () => `
  <section class="section" id="claims" aria-labelledby="claims-heading">
    <h2 id="claims-heading">Swift Claim Settlements</h2>
    <p lang="en">
      LIC Neemuch, under Jitendra Patidar’s guidance, ensures fast and transparent claim settlements, with LIC’s industry-leading 98.62% claim settlement ratio in FY 2020-21. Learn more on <a href="https://licindia.in" target="_blank" rel="noopener noreferrer" class="content-link">LIC’s official site</a>.
    </p>
    <p lang="hi">
      जितेंद्र पाटीदार के मार्गदर्शन में एलआईसी नीमच तेज और पारदर्शी दावा निपटान सुनिश्चित करता है, जिसमें FY 2020-21 में एलआईसी का उद्योग-अग्रणी 98.62% दावा निपटान अनुपात है। <a href="https://licindia.in" target="_blank" rel="noopener noreferrer" class="content-link">एलआईसी की आधिकारिक साइट</a> पर और जानें।
    </p>
    <p lang="en">
      Follow <a href="https://www.instagram.com/do_jitendrapatidar_lic/" target="_blank" rel="noopener noreferrer" class="content-link">Jitendra on Instagram</a> for tips on navigating claims.
    </p>
    <p lang="hi">
      दावों को नेविगेट करने के सुझावों के लिए <a href="https://www.instagram.com/do_jitendrapatidar_lic/" target="_blank" rel="noopener noreferrer" class="content-link">जितेंद्र को इंस्ताग्राम</a> पर फॉलो करें।
    </p>
  </section>
`;

const renderCtaSection = () => `
  <section class="section cta-section" aria-labelledby="cta-heading">
    <h2 id="cta-heading">Join Our Satisfied Clients</h2>
    <p lang="en">
      Experience trusted insurance services with LIC Neemuch. Share your feedback or contact Jitendra Patidar today!
    </p>
    <p lang="hi">
      एलआईसी नीमच के साथ भरोसेमंद बीमा सेवाओं का अनुभव करें। अपनी प्रतिक्रिया साझा करें या आज जितेंद्र पाटीदार से संपर्क करें!
    </p>
    <a href="#feedback" class="cta-button" aria-label="Share Feedback">Share Your Feedback <span class="fa-icon">★</span></a>
  </section>
`;

const renderFooter = () => `
<footer class="footer">
<div class="footer-wave"></div>
<div class="footer-content">
  <div class="footer-section">
    <h3 class="footer-heading">
      <span lang="en">LIC Neemuch</span>
      <span lang="hi" class="lang-hidden">एलआईसी नीमच</span>
    </h3>
    <p>
      <span lang="en">Empowering Neemuch with trusted LIC insurance since 1956. <em>Zindagi Ke Saath Bhi, Zindagi Ke Baad Bhi.</em></span>
      <span lang="hi" class="lang-hidden">1956 से नीमच को विश्वसनीय एलआईसी बीमा के साथ सशक्त करना। <em>ज़िंदगी के साथ भी, ज़िंदगी के बाद भी।</em></span>
    </p>
    <p>
      <span lang="en">Vikas Nagar, Scheme No. 14-3, Neemuch, MP 458441</span>
      <span lang="hi" class="lang-hidden">विकास नगर, स्कीम नंबर 14-3, नीमच, एमपी 458441</span>
    </p>
    <p><a href="tel:+917987235207" class="footer-link">+91 7987235207</a></p>
  </div>
  <div class="footer-section">
    <h3 class="footer-heading">
      <span lang="en">Quick Links</span>
      <span lang="hi" class="lang-hidden">त्वरित लिंक</span>
    </h3>
    <ul class="footer-links">
      <li><a href="/" class="footer-link">Home</a></li>
      <li><a href="/services" class="footer-link">Services</a></li>
      <li><a href="/reviews" class="footer-link">Reviews</a></li>
      <li><a href="/join" class="footer-link">Join as Agent</a></li>
      <li><a href="/about" class="footer-link">About</a></li>
      <li><a href="/faqs" class="footer-link">FAQs</a></li>
      <li><a href="/bimasakhi" class="footer-link">Bima Sakhi Yojana</a></li>      </ul>

    </ul>
  </div>
  <div class="footer-section">
    <h3 class="footer-heading">
      <span lang="en">Connect</span>
      <span lang="hi" class="lang-hidden">जुड़ें</span>
    </h3>
    <ul class="footer-links">
      <li><a href="https://wa.me/917987235207" target="_blank" rel="noopener noreferrer" class="footer-link">WhatsApp</a></li>
      <li><a href="tel:+917987235207" class="footer-link">Call Us</a></li>
      <li><a href="https://licneemuch.space/faqs#contact" class="footer-link">Contact Form</a></li>
    </ul>
    <div class="footer-gift">
      <a href="https://licneemuch.space/join" class="gift-button">
        <span lang="en">🎁 Claim Your Free Insurance Consultation!</span>
        <span lang="hi" class="lang-hidden">🎁 मुफ्त बीमा परामर्श प्राप्त करें!</span>
      </a>
    </div>
  </div>
  <div class="footer-section developer-message">
    <h3 class="footer-heading">
      <span lang="en">From the Developer</span>
      <span lang="hi" class="lang-hidden">डेवलपर से</span>
    </h3>
    <p>
      <span lang="en">Crafted with passion by <strong>Sanjay Patidar</strong>, a proud Neemuch resident dedicated to bringing LIC’s trusted services online. This platform is built to empower our community with secure, accessible insurance solutions.</span>
      <span lang="hi" class="lang-hidden"><strong>संजय पाटीदार</strong>, नीमच के गौरवशाली निवासी, द्वारा जुनून के साथ बनाया गया। यह मंच हमारी समुदाय को सुरक्षित, सुलभ बीमा समाधानों के साथ सशक्त करने के लिए बनाया गया है।</span>
    </p>
  </div>
</div>
<div class="footer-bottom">
  <p>
    <span lang="en">© 2025 LIC Neemuch. All rights reserved. <em>Secure your future with LIC.</em></span>
    <span lang="hi" class="lang-hidden">© 2025 एलआईसी नीमच। सर्वाधिकार सुरक्षित। <em>एलआईसी के साथ अपना भविष्य सुरक्षित करें।</em></span>
  </p>
 
</div>
</footer>
`;

// Main Route
router.get('/', async (req, res) => {
  console.log('SSR route hit for /reviews at', new Date().toISOString());

  try {
    const pageUrl = 'https://www.licneemuch.space/reviews';
    const metaTitle = 'LIC Neemuch Reviews: Customer Feedback & Ratings';
    const metaDescription = 'Read genuine customer reviews for LIC Neemuch led by Jitendra Patidar. Discover client feedback, ratings & share your own experience or insurance query.';
    const metaImage = 'https://d12uvtgcxr5qif.cloudfront.net/images/react_2025-06-12_4bd13d82-4fba-4a8e-8b2f-3c4d66b9f463.webp';
    const metaKeywords = 'LIC Neemuch reviews, Jitendra Patidar, LIC insurance feedback, customer ratings, Neemuch insurance, LIC India reviews';

    const { reviews, ratings, averageRating } = await fetchReviewsAndRatings();

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'LIC Neemuch',
      url: pageUrl,
      logo: metaImage,
      description: metaDescription,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Neemuch',
        addressRegion: 'Madhya Pradesh',
        postalCode: '458220',
        addressCountry: 'IN',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-7987235207',
        contactType: 'Customer Service',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toString(),
        reviewCount: ratings.length.toString(),
      },
      review: reviews.map((review) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author,
        },
        reviewBody: review.quote,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating.toString(),
        },
      })),
    };

    const htmlContent = `
      ${renderHeader()}
      <div class="container">
        ${renderSidebar()}
        <main class="main-content" role="main">
          <article aria-labelledby="feedback-heading">${renderFeedbackForm()}</article>
          <article aria-labelledby="review-heading">${renderReviewForm()}</article>
          <article aria-labelledby="reviews-heading">${renderReviewsSection(reviews)}</article>
          <article aria-labelledby="ratings-heading">${renderRatingsSection(averageRating, ratings)}</article>
          <article aria-labelledby="claims-heading">${renderClaimsSection()}</article>
          <article aria-labelledby="cta-heading">${renderCtaSection()}</article>
        </main>
      </div>
      ${renderFooter()}
    `;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="description" content="${escapeHTML(metaDescription)}">
          <meta name="keywords" content="${escapeHTML(metaKeywords)}">
          <meta name="author" content="Jitendra Patidar">
          <meta name="robots" content="index, follow">
          <meta name="geo.region" content="IN-MP">
          <meta name="geo.placename" content="Neemuch">
          <meta name="geo.position" content="24.4716;74.8742">
          <meta name="ICBM" content="24.4716, 74.8742">
          <meta property="og:type" content="website">
          <meta property="og:title" content="${escapeHTML(metaTitle)}">
          <meta property="og:description" content="${escapeHTML(metaDescription)}">
          <meta property="og:url" content="${escapeHTML(pageUrl)}">
          <meta property="og:image" content="${escapeHTML(metaImage)}">
          <meta property="og:image:width" content="1200">
          <meta property="og:image:height" content="630">
          <meta property="og:site_name" content="LIC Neemuch">
          <meta property="og:locale" content="en_IN">
          <meta property="og:locale:alternate" content="hi_IN">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${escapeHTML(metaTitle)}">
          <meta name="twitter:description" content="${escapeHTML(metaDescription)}">
          <meta name="twitter:image" content="${escapeHTML(metaImage)}">
          <meta name="twitter:site" content="@do_jitendrapatidar_lic">
          <title>${escapeHTML(metaTitle)}</title>
          <link rel="canonical" href="${escapeHTML(pageUrl)}">
          <link rel="icon" type="image/jpeg" href="${escapeHTML(metaImage)}" sizes="32x32">
          <link rel="apple-touch-icon" href="${escapeHTML(metaImage)}" sizes="180x180">
          <link rel="alternate" hreflang="en-IN" href="${escapeHTML(pageUrl)}">
          <link rel="alternate" hreflang="hi-IN" href="${escapeHTML(pageUrl)}/hi">
          <link rel="alternate" hreflang="x-default" href="${escapeHTML(pageUrl)}">
          <link rel="preconnect" href="https://mys3resources.s3.ap-south-1.amazonaws.com">
          <link rel="preload" href="${escapeHTML(metaImage)}" as="image">
          <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
          <style>
            :root {
              --primary-color: #E63946; /* Neon Crimson */
              --secondary-color: #1DE9B6; /* Electric Teal */
              --accent-color: #F4A261; /* Sunset Orange */
              --bg-start: #0A0C14; /* Void Black */
              --bg-end: #040506; /* Obsidian Night */
              --text-color: #E4ECEF; /* Starlight White */
              --card-border: rgba(230, 57, 70, 0.5); /* Crimson Veil */
              --shadow: 0 8px 25px rgba(0, 0, 0, 0.9);
              --glow: 0 0 12px rgba(230, 57, 70, 0.4), 0 0 18px rgba(244, 162, 97, 0.3);
              --border-radius: 8px;
              --transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }

            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              color: var(--text-color);
              background: linear-gradient(160deg, var(--bg-start), var(--bg-end));
              line-height: 1.9;
              overflow-x: hidden;
              letter-spacing: 0.04em;
            }

            .header {
              position: relative;
              background: linear-gradient(90deg, var(--bg-start), var(--bg-end));
              border-bottom: 4px solid var(--primary-color);
            }

            .navbar {
              position: sticky;
              top: 0;
              background: rgba(4, 5, 6, 0.97);
              backdrop-filter: blur(20px);
              padding: 0.7rem 1.2rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              z-index: 1001;
              transition: var(--transition);
            }

            .navbar.scrolled {
              box-shadow: var(--shadow);
              background: rgba(4, 5, 6, 1);
            }

            .navbar-brand {
              display: flex;
              align-items: center;
              gap: 0.6rem;
            }

            .nav-logo {
              color: var(--accent-color);
              text-decoration: none;
              font-size: 1.6rem;
              font-weight: 900;
              display: flex;
              align-items: center;
              gap: 0.6rem;
              text-transform: uppercase;
              letter-spacing: 1.2px;
            }

            .logo-img {
              border-radius: 50%;
              object-fit: cover;
              width: 44px;
              height: 44px;
              transition: var(--transition);
              border: 2px solid var(--secondary-color);
            }

            .logo-img:hover {
              transform: rotate(360deg) scale(1.2);
              box-shadow: var(--glow);
            }

            .nav-toggle {
              display: none;
              background: none;
              border: none;
              cursor: pointer;
              padding: 0.6rem;
              z-index: 1002;
            }

            .nav-toggle-icon {
              display: block;
              width: 26px;
              height: 3px;
              background: var(--accent-color);
              position: relative;
              transition: background 0.3s ease;
            }

            .nav-toggle-icon::before,
            .nav-toggle-icon::after {
              content: '';
              position: absolute;
              width: 26px;
              height: 3px;
              background: var(--accent-color);
              left: 0;
              transition: transform 0.3s ease;
            }

            .nav-toggle-icon::before {
              top: -8px;
            }

            .nav-toggle-icon::after {
              top: 8px;
            }

            .nav-toggle[aria-expanded="true"] .nav-toggle-icon {
              background: transparent;
            }

            .nav-toggle[aria-expanded="true"] .nav-toggle-icon::before {
              transform: rotate(45deg) translate(5px, 5px);
            }

            .nav-toggle[aria-expanded="true"] .nav-toggle-icon::after {
              transform: rotate(-45deg) translate(5px, -5px);
            }

            .nav-menu {
              display: flex;
              gap: 1.5rem;
            }

            .nav-link {
              color: var(--text-color);
              text-decoration: none;
              font-size: 1.05rem;
              font-weight: 600;
              padding: 0.5rem 1rem;
              border-radius: var(--border-radius);
              transition: var(--transition);
              position: relative;
              z-index: 1;
              overflow: hidden;
            }

            .nav-link::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
              opacity: 0;
              z-index: -1;
              transition: opacity 0.4s ease;
            }

            .nav-link:hover::before,
            .nav-link:focus::before,
            .nav-link.active::before {
              opacity: 0.15;
            }

            .nav-link:hover,
            .nav-link:focus,
            .nav-link.active {
              color: var(--accent-color);
              transform: translateY(-2px);
            }

            .hero-section {
              display: flex;
              align-items: center;
              padding: 1.2rem;
              min-height: 70vh;
              background: linear-gradient(90deg, rgba(230, 57, 70, 0.08), transparent);
              border-radius: var(--border-radius);
              margin: 1.2rem auto;
              max-width: 1200px;
            }

            .hero-content {
              flex: 1;
              padding: 1rem;
              display: flex;
              flex-direction: column;
              justify-content: center;
              gap: 1rem;
              max-width: 600px;
            }

            .hero-title {
              font-size: clamp(1.8rem, 4vw, 2.8rem);
              color: var(--accent-color);
              margin-bottom: 0.7rem;
              line-height: 1.3;
              text-shadow: 4px 4px 12px rgba(0, 0, 0, 0.7);
              animation: slide-in-left 0.8s ease-out;
            }

            .hero-title span.hidden {
              display: none;
            }

            @keyframes slide-in-left {
              from {
                opacity: 0;
                transform: translateX(-20px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }

            .hero-subtitle {
              font-size: clamp(0.85rem, 1.8vw, 1rem);
              color: var(--text-color);
              opacity: 0.8;
              animation: fade-in-up 0.8s ease-out 0.2s;
              animation-fill-mode: both;
            }

            .hero-subtitle.hidden {
              display: none;
            }

            .hero-cta {
              display: flex;
              gap: 0.8rem;
              animation: fade-in-up 0.8s ease-out 0.6s;
              animation-fill-mode: both;
            }

            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .hero-image {
              flex: 1;
              display: flex;
              justify-content: center;
              align-items: center;
              max-width: 500px;
            }

            .hero-image img {
              width: 100%;
              height: auto;
              max-height: 333px;
              object-fit: cover;
              transition: var(--transition);
            }

           

            .cta-button {
              display: inline-block;
              padding: 0.4rem 0.9rem;
              background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
              color: var(--text-color);
              text-decoration: none;
              border-radius: 18px;
              font-weight: bold;
              font-size: 0.85rem;
              transition: var(--transition);
              position: relative;
              z-index: 1;
              margin: 0.6rem 0;
              overflow: hidden;
            }

            .cta-button::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(45deg, var(--secondary-color), var(--primary-color));
              opacity: 0;
              z-index: -1;
              transition: opacity 0.4s ease;
              border-radius: 18px;
            }

            .cta-button:hover::before,
            .cta-button:focus::before {
              opacity: 1;
            }

            .cta-button:hover,
            .cta-button:focus {
              transform: translateY(-1px);
              box-shadow: 0 0 8px var(--accent-color);
              color: var(--bg-end);
            }

            .cta-button.secondary {
              background: transparent;
              border: 2px solid var(--accent-color);
              color: var(--accent-color);
            }

            .cta-button.secondary:hover,
            .cta-button.secondary:focus {
              background: var(--accent-color);
              color: var(--bg-end);
              box-shadow: 0 0 8px var(--accent-color);
            }

            .fa-icon {
              margin-left: 0.5rem;
            }

            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 1.2rem;
              display: flex;
              gap: 1.5rem;
              min-height: calc(100vh - 300px);
            }

            .sidebar {
              flex: 1;
              position: sticky;
              top: 80px;
              align-self: flex-start;
              background: rgba(4, 5, 6, 0.9);
              border-radius: var(--border-radius);
              padding: 1rem;
              box-shadow: var(--shadow);
              transition: max-width 0.3s ease;
              max-width: 250px;
            }

            .sidebar-toggle {
              display: none;
              background: none;
              border: none;
              color: var(--accent-color);
              font-size: 1.2rem;
              cursor: pointer;
              padding: 0.5rem;
              margin-bottom: 0.5rem;
            }

            .sidebar-nav {
              display: flex;
              flex-direction: column;
            }

            .sidebar-link {
              display: block;
              color: var(--text-color);
              text-decoration: none;
              font-size: 0.95rem;
              padding: 0.5rem;
              margin-bottom: 0.5rem;
              border-radius: var(--border-radius);
              transition: var(--transition);
              white-space: nowrap;
            }

            .sidebar-link:hover,
            .sidebar-link:focus,
            .sidebar-link.active {
              color: var(--accent-color);
              background: rgba(230, 57, 70, 0.1);
              transform: translateX(5px);
            }

            .main-content {
              flex: 3;
              overflow-y: auto;
              max-height: calc(100vh - 150px);
              padding-right: 0.5rem;
              scrollbar-width: thin;
              scrollbar-color: var(--primary-color) var(--bg-end);
            }

            .main-content::-webkit-scrollbar {
              width: 8px;
            }

            .main-content::-webkit-scrollbar-track {
              background: var(--bg-end);
            }

            .main-content::-webkit-scrollbar-thumb {
              background: var(--primary-color);
              border-radius: 4px;
            }

            .section {
              margin-bottom: 2rem;
            }

            h2 {
              font-size: clamp(1.7rem, 4vw, 2.3rem);
              color: var(--primary-color);
              margin-bottom: 0.9rem;
              border-left: 4px solid var(--secondary-color);
              padding-left: 0.7rem;
              position: relative;
            }

            h2::after {
              content: '';
              position: absolute;
              bottom: -5px;
              left: 0;
              width: 40px;
              height: 2px;
              background: var(--accent-color);
              animation: slide-in-right 0.8s ease-out;
            }

            @keyframes slide-in-right {
              from {
                width: 0;
              }
              to {
                width: 40px;
              }
            }

            h3 {
              font-size: clamp(1rem, 2.2vw, 1.2rem);
              color: var(--accent-color);
              margin-bottom: 0.5rem;
            }

            p {
              font-size: clamp(0.85rem, 1.8vw, 0.95rem);
              margin-bottom: 0.5rem;
              color: var(--text-color);
              opacity: 0.85;
            }

            .contact-form {
              display: flex;
              flex-direction: column;
              gap: 1rem;
              padding: 1.5rem;
              background: rgba(4, 5, 6, 0.9);
              border-radius: var(--border-radius);
              max-width: 500px;
              width: 100%;
              margin: 1rem auto;
              border: 1px solid var(--card-border);
              box-shadow: var(--shadow);
            }

            input, textarea, select {
              padding: 0.8rem;
              border: 1px solid var(--secondary-color);
              border-radius: 5px;
              width: 100%;
              font-size: 1rem;
              color: var(--text-color);
              background: rgba(0, 0, 0, 0.5);
            }

            input:focus, textarea:focus, select:focus {
              outline: none;
              box-shadow: 0 0 5px var(--primary-color);
            }

            textarea {
              resize: vertical;
            }

            button {
              padding: 0.6rem 1.2rem;
              background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
              border: none;
              border-radius: 20px;
              color: var(--text-color);
              font-weight: 600;
              cursor: pointer;
              transition: var(--transition);
            }

            button:hover {
              transform: scale(1.05);
              box-shadow: var(--glow);
            }

            .review-carousel {
              display: flex;
              overflow: hidden;
              position: relative;
              margin: 1.5rem 0;
              padding: 1rem;
              background: rgba(230, 57, 70, 0.05);
              border-radius: var(--border-radius);
            }

            .review-card {
              flex: 0 0 100%;
              padding: 1rem;
              text-align: center;
              color: var(--text-color);
            }

            .review-quote {
              font-size: 0.95rem;
              font-style: italic;
              margin-bottom: 0.5rem;
              position: relative;
              padding-left: 2rem;
            }

            .review-quote::before {
              content: '“';
              position: absolute;
              left: 0;
              top: 0;
              font-size: 2rem;
              color: var(--primary-color);
            }

            .review-author {
              display: block;
              font-size: 0.85rem;
              color: var(--accent-color);
            }

            .star-rating {
              display: flex;
              justify-content: center;
              gap: 0.3rem;
              margin-bottom: 0.5rem;
            }

            .card-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
              gap: 1.2rem;
            }

            .card {
              border: 2px solid var(--card-border);
              padding: 1rem;
              border-radius: var(--border-radius);
              box-shadow: var(--shadow);
              transition: var(--transition);
              position: relative;
              z-index: 1;
              background: rgba(4, 5, 6, 0.9);
              overflow: hidden;
            }

            .card::before {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 3px;
              background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
              opacity: 0;
              transition: opacity 0.4s ease;
            }

            .card:hover::before {
              opacity: 1;
            }

            .card:hover {
              transform: translateY(-3px);
              border-color: var(--secondary-color);
              box-shadow: var(--glow);
            }

            .cta-section {
              text-align: center;
              padding: 1.5rem;
              background: rgba(230, 57, 70, 0.05);
              border-radius: var(--border-radius);
            }

            .content-link {
              color: var(--secondary-color);
              text-decoration: none;
              transition: var(--transition);
            }

            .content-link:hover,
            .content-link:focus {
              color: var(--accent-color);
              text-decoration: underline;
            }

            footer {
              position: relative;
              padding: 3rem 1.5rem 2rem;
              background: linear-gradient(180deg, var(--bg-start), var(--bg-end));
              color: var(--text-color);
              font-size: 0.95rem;
              overflow: hidden;
              border-top: 3px solid var(--primary-color);
              box-shadow: inset 0 4px 20px rgba(230, 57, 70, 0.2);
            }
            
            .footer-wave {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 50px;
              background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 120" preserveAspectRatio="none"><path d="M0,0V46c150,36,350,18,600,46s450,28,600,0V0H0Z" fill="rgba(230,57,70,0.3)"/></svg>') no-repeat;
              background-size: cover;
              opacity: 0.5;
            }
            
            .footer-content {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 2rem;
              max-width: 1200px;
              margin: 0 auto;
              padding: 1rem;
              backdrop-filter: blur(8px);
              background: rgba(4, 5, 6, 0.6);
              border-radius: var(--border-radius);
              box-shadow: var(--shadow);
            }
            
            .footer-section {
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
              padding: 1rem;
              transition: var(--transition);
            }
            
            .footer-section:hover {
              transform: translateY(-3px);
            }
            
            .footer-heading {
              font-size: clamp(1.1rem, 2.2vw, 1.3rem);
              color: var(--secondary-color);
              margin-bottom: 0.75rem;
              position: relative;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
            
            .footer-heading::after {
              content: '';
              position: absolute;
              bottom: -4px;
              left: 0;
              width: 30px;
              height: 2px;
              background: var(--accent-color);
              transition: width 0.3s ease;
            }
            
            .footer-section:hover .footer-heading::after {
              width: 60px;
            }
            
            .footer-links {
              display: flex;
              flex-direction: column;
              gap: 0.5rem;
              list-style: none;
            }
            
            .footer-link {
              color: var(--text-color);
              text-decoration: none;
              font-size: 0.9rem;
              padding: 0.3rem 0.5rem;
              border-radius: 4px;
              transition: var(--transition);
              position: relative;
              overflow: hidden;
            }
            
            .footer-link::before {
              content: '';
              position: absolute;
              bottom: 0;
              left: 0;
              width: 0;
              height: 1px;
              background: var(--accent-color);
              transition: width 0.3s ease;
            }
            
            .footer-link:hover::before,
            .footer-link:focus::before {
              width: 100%;
            }
            
            .footer-link:hover,
            .footer-link:focus {
              color: var(--accent-color);
              transform: translateX(5px);
              background: rgba(244, 162, 97, 0.1);
            }
            
            .footer-gift {
              margin-top: 1rem;
              text-align: center;
            }
            
            .gift-button {
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.6rem 1.2rem;
              background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
              color: var(--bg-end);
              text-decoration: none;
              font-weight: bold;
              font-size: 0.9rem;
              border-radius: 20px;
              transition: var(--transition);
              box-shadow: var(--glow);
              animation: pulse 2s infinite ease-in-out;
            }
            
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            
            .gift-button:hover,
            .gift-button:focus {
              transform: scale(1.1);
              box-shadow: 0 0 15px var(--secondary-color);
              background: linear-gradient(45deg, var(--secondary-color), var(--primary-color));
            }
            
            .developer-message p {
              font-style: italic;
              font-size: 0.85rem;
              opacity: 0.9;
              line-height: 1.5;
              border-left: 2px solid var(--primary-color);
              padding-left: 0.75rem;
            }
            
            .footer-bottom {
              margin-top: 2rem;
              padding-top: 1rem;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
              font-size: 0.85rem;
              opacity: 0.85;
              text-align: center;
            }
            
            .footer-bottom p {
              margin-bottom: 0.5rem;
            }
            
            @media (max-width: 768px) {
              footer {
                padding: 2rem 1rem;
              }
            
              .footer-content {
                grid-template-columns: 1fr;
                text-align: center;
              }
            
              .footer-section {
                padding: 0.5rem;
              }
            
              .footer-heading::after {
                margin: 0 auto;
              }
            
              .footer-links {
                align-items: center;
              }
            
              .footer-link:hover,
              .footer-link:focus {
                transform: none;
              }
            
              .gift-button {
                font-size: 0.85rem;
                padding: 0.5rem 1rem;
              }
            
              .developer-message p {
                text-align: left;
              }
            }
            
            @media (max-width: 320px) {
              footer {
                padding: 1.5rem 0.8rem;
              }
            
              .footer-heading {
                font-size: clamp(1rem, 2vw, 1.1rem);
              }
            
              .footer-link,
              .gift-button {
                font-size: 0.8rem;
              }
            }
      
      @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 1; }
      }
      
            .notification {
              position: fixed;
              top: 80px;
              right: 20px;
              background: #487503;
              color: #fff;
              padding: 1rem;
              border-radius: 8px;
              z-index: 1002;
              display: none;
            }

            .notification.show {
              display: block;
              animation: slide-in-right 0.5s ease-out, fade-out 8s ease-out 0.5s forwards;
            }

            @keyframes slide-in-right {
              from { transform: translateX(100%); }
              to { transform: translateX(0); }
            }

            @keyframes fade-out {
              to { opacity: 0; }
            }

            @media (max-width: 1024px) {
              .hero-section {
                flex-direction: column;
                text-align: center;
                padding: 0.8rem;
                margin: 0.8rem;
              }

              .hero-content {
                max-width: 100%;
                padding: 0.8rem;
              }

              .hero-image {
                max-width: 100%;
                margin-top: 1rem;
              }

              .hero-image img {
                max-width: 100%;
              }

              .container {
                flex-direction: column;
                padding: 0.8rem;
              }

              .sidebar {
                position: static;
                max-width: 100%;
                padding: 0.8rem;
              }

              .sidebar-toggle {
                display: block;
              }

              .sidebar-nav {
                display: none;
              }

              .sidebar-nav.active {
                display: flex;
              }
            }

            @media (max-width: 768px) {
              .hero-title {
                font-size: clamp(1.5rem, 3vw, 2rem);
              }

              .hero-subtitle {
                font-size: clamp(0.8rem, 1.6vw, 0.9rem);
              }

              .navbar {
                flex-direction: row;
                align-items: center;
              }

              .nav-toggle {
                display: block;
              }

              .nav-menu {
                display: none;
                flex-direction: column;
                width: 100%;
                gap: 0;
                margin-top: 0;
                position: absolute;
                top: 100%;
                left: 0;
                background: rgba(4, 5, 6, 0.95);
                padding: 0.1rem;
                box-shadow: var(--shadow);
                z-index: 1000;
              }

              .nav-menu.active {
                display: block;
              }

              .nav-link {
                padding: 0.5rem;
                width: 100%;
                text-align: center;
              }

              .hero-cta {
                flex-direction: column;
                gap: 0.6rem;
              }

              .cta-button {
                padding: 0.3rem 0.7rem;
                font-size: 0.8rem;
              }
            }

            @media (max-width: 480px) {
              .hero-title {
                font-size: clamp(1.2rem, 2.5vw, 1.5rem);
              }

              .hero-subtitle {
                font-size: clamp(0.75rem, 1.5vw, 0.8rem);
              }

              .hero-content {
                padding: 0.4rem;
              }

              .hero-image img {
                max-height: 200px;
              }

              .container {
                padding: 0.6rem;
              }

              .cta-button {
                padding: 0.25rem 0.6rem;
                font-size: 0.75rem;
              }
            }
          </style>
          <script>
            document.addEventListener('DOMContentLoaded', () => {
              const navToggle = document.querySelector('.nav-toggle');
              const navMenu = document.querySelector('.nav-menu');
              const sidebarToggle = document.querySelector('.sidebar-toggle');
              const sidebarNav = document.querySelector('.sidebar-nav');
              const links = document.querySelectorAll('a[href^="#"]');
              const notification = document.createElement('div');
              notification.className = 'notification';
              notification.textContent = 'नमस्ते! कोई सुझाव या प्रश्न? हमें बताएं!';
              document.body.appendChild(notification);

              let isSidebarCollapsed = false;

              navToggle.addEventListener('click', () => {
                const expanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !expanded);
                navMenu.classList.toggle('active');
              });

              sidebarToggle.addEventListener('click', () => {
                isSidebarCollapsed = !isSidebarCollapsed;
                const expanded = sidebarToggle.getAttribute('aria-expanded') === 'true';
                sidebarToggle.setAttribute('aria-expanded', !expanded);
                sidebarNav.classList.toggle('active');
                sidebarToggle.querySelector('.sidebar-toggle-icon').textContent = isSidebarCollapsed ? '☰' : '✕';
                document.querySelector('.sidebar').style.maxWidth = isSidebarCollapsed ? '60px' : '250px';
                sidebarNav.style.opacity = isSidebarCollapsed ? '0' : '1';
              });

              links.forEach(link => {
                link.addEventListener('click', (e) => {
                  const href = link.getAttribute('href');
                  if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                      history.pushState(null, null, href);
                    }
                    if (navMenu.classList.contains('active')) {
                      navToggle.click();
                    }
                    if (sidebarNav.classList.contains('active') && window.innerWidth <= 1024) {
                      sidebarToggle.click();
                    }
                  }
                });
              });

               const sections = document.querySelectorAll('section[id]');
            const observer = new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                    const id = entry.target.id;
                    links.forEach((link) => {
                      const isActive = link.getAttribute('href') === \`#\${id}\`;
                      if (isActive) {
                        link.classList.add('active');
                      } else {
                        link.classList.remove('active');
                      }
                    });
                  }
                });
              },
              { rootMargin: '-100px 0px -100px 0px' }
            );
            sections.forEach((section) => observer.observe(section));

              window.addEventListener('scroll', () => {
                const navbar = document.querySelector('.navbar');
                navbar.classList.toggle('scrolled', window.scrollY > 50);
              });

              let currentReview = 0;
              const reviewCards = document.querySelectorAll('.review-card');
              if (reviewCards.length > 0) {
                setInterval(() => {
                  reviewCards[currentReview].style.display = 'none';
                  currentReview = (currentReview + 1) % reviewCards.length;
                  reviewCards[currentReview].style.display = 'block';
                }, 5000);
              }
            });
          </script>
        </head>
        <body>
          <div id="root">${htmlContent}</div>
        </body>
      </html>
    `;

    console.log('SSR HTML generated for /reviews, length:', html.length);
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(html);
    console.log('SSR response sent for /reviews at', new Date().toISOString());
  } catch (error) {
    console.error('SSR Error:', error.stack);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="robots" content="noindex">
        <title>Server Error</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(180deg, #0A0C14, #040506);
            color: #E4ECEF;
            text-align: center;
            padding: 2rem;
            margin: 0;
          }
          .content-error {
            color: #E63946;
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
          a {
            color: #E63946;
            text-decoration: none;
          }
          a:hover, a:focus {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div id="root">
          <div class="content-error">An error occurred. Please try again later.</div>
          <a href="/" aria-label="Back to Home">Home</a>
        </div>
      </body>
      </html>
    `);
  }
});

// Form Submission Routes
router.post('/submit-feedback', async (req, res) => {
  try {
    const { name, email, message, query } = req.body;

    if (!name || (!message && !query)) {
      return res.status(400).json({ error: 'Name and either feedback or query are required.' });
    }

    if (query) {
      await LICQuery.create({ name, email, query });
    }
    if (message) {
      await LICFeedback.create({ name, email, feedback: message });
    }

    res.status(200).json({ message: 'Feedback/query submitted successfully!' });
  } catch (error) {
    console.error('Error submitting feedback/query:', error);
    res.status(500).json({ error: 'Failed to submit feedback/query.' });
  }
});

router.post('/submit-review', async (req, res) => {
  try {
    const { username, email, comment, rating } = req.body;

    if (!username || !comment || !rating) {
      return res.status(400).json({ error: 'Username, comment, and rating are required.' });
    }

    const userId = crypto.MD5(email || username).toString();
    const review = await LICReview.create({ username, comment });
    await LICRating.create({ userId, rating: Number(rating) });

    res.status(200).json({ message: 'Review and rating submitted successfully!', review });
  } catch (error) {
    console.error('Error submitting review/rating:', error);
    res.status(500).json({ error: 'Failed to submit review/rating.' });
  }
});

// Language Redirect
router.get('/hi', async (req, res) => {
  res.redirect(301, '/reviews');
});

module.exports = router;