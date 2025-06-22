
const express = require('express');
const compression = require('compression');

const router = express.Router();

// Enable compression middleware
router.use(compression());

// Enforce HTTPS redirects
router.use((req, res, next) => {
  const isHttps = req.headers['x-forwarded-proto'] === 'https' || req.secure;
  if (!isHttps) {
    return res.redirect(301, 'https://' + req.get('host') + req.originalUrl);
  }
  next();
});

const escapeHTML = function(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Function to strip HTML tags for schema text
const stripHTML = function(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
};

// Function to extract FAQs for schema
const extractFAQs = function(html) {
  const faqs = [];
  const faqItemRegex = /<div class="faq-item"[^>]*>([\s\S]*?)<\/div>/g;
  const questionRegex = /<h3 class="faq-question"[^>]*>([\s\S]*?)<\/h3>/;
  const answerRegex = /<div class="faq-answer"[^>]*>([\s\S]*?)<\/div>/;

  let faqItemMatch;
  while ((faqItemMatch = faqItemRegex.exec(html))) {
    const faqItemContent = faqItemMatch[1];
    const questionMatch = questionRegex.exec(faqItemContent);
    const answerMatch = answerRegex.exec(faqItemContent);
    if (questionMatch && answerMatch) {
      const questionEn = stripHTML(questionMatch[1].match(/<span lang="en"[^>]*>([\s\S]*?)<\/span>/)?.[1] || '');
      const answerEn = stripHTML(answerMatch[1].match(/<div lang="en"[^>]*>([\s\S]*?)<\/div>/)?.[1] || '');
      if (questionEn && answerEn) {
        faqs.push({ question: questionEn, answer: answerEn });
      }
    }
  }
  return faqs;
};

router.get('/', async (req, res) => {
  console.log('SSR route hit for /bimasakhi at ' + new Date().toISOString());

  try {
    const pageUrl = 'https://licneemuch.space/bimasakhi';
    const metaTitle = 'LIC Bima Sakhi Yojna Neemuch 2025 – Women’s Financial Growth';
const metaDescription =
  'Apply for LIC Bima Sakhi Yojana Neemuch 2025. Empower women with ₹7,000/month stipend, LIC commission, and Aadhaar Shila plan. Call Jitendra Patidar today.';
 const metaImage = 'https://d12uvtgcxr5qif.cloudfront.net/images/css_2025-06-15_ac83648b-0888-4b3d-adf0-21d1b4d60b02.webp';
    const logoImage = 'https://d12uvtgcxr5qif.cloudfront.net/images/html_2025-06-12_5bc78c6a-1a4b-4908-a854-356cce5ac68f.webp';
    const metaKeywords =
      'LIC Bima Sakhi Yojana, women empowerment Neemuch, financial independence women, LIC insurance agent jobs, Neemuch Bima Sakhi application, rural financial inclusion, Jitendra Patidar LIC, LIC Aadhaar Shila, LIC New Jeevan Anand, LIC Tech Term, Bima Sakhi stipend, financial literacy MP, women insurance schemes, LIC career opportunities, Bima Sakhi training';

    // Define htmlContent first
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="hi-IN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="${escapeHTML(metaDescription)}">
        <meta name="keywords" content="${escapeHTML(metaKeywords)}">
        <meta name="author" content="LIC Neemuch">
        <meta name="robots" content="index, follow">
        <meta property="og:title" content="${escapeHTML(metaTitle)}">
        <meta property="og:description" content="${escapeHTML(metaDescription)}">
        <meta property="og:image" content="${metaImage}">
        <meta property="og:url" content="${pageUrl}">
        <meta property="og:type" content="website">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${escapeHTML(metaTitle)}">
        <meta name="twitter:description" content="${escapeHTML(metaDescription)}">
        <meta name="twitter:image" content="${metaImage}">
        <title>${escapeHTML(metaTitle)}</title>
        <link rel="canonical" href="${pageUrl}">
        <link rel="icon" href="${logoImage}" type="image/webp">
        <link rel="alternate" hreflang="hi-IN" href="${pageUrl}">
        <link rel="alternate" hreflang="en-IN" href="${pageUrl}">
        <style>
          :root {
            --primary-color: #E63946;
            --secondary-color: #1DE9B6;
            --accent-color: #F4A261;
            --bg-start: #0A0C14;
            --bg-end: #040506;
            --text-color: #E4ECEF;
            --card-border: rgba(230, 57, 70, 0.5);
            --card-bg: rgba(4, 5, 6, 0.9);
            --shadow: 0 8px 25px rgba(0, 0, 0, 0.9);
            --glow: 0 0 12px rgba(230, 57, 70, 0.4);
            --border-radius: 8px;
            --transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(180deg, var(--bg-start), var(--bg-end));
            color: var(--text-color);
            line-height: 1.6;
            overflow-x: hidden;
          }
          .container {
            display: flex;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            gap: 1rem;
          }
          .header {
            background: var(--card-bg);
            border-bottom: 1px solid var(--card-border);
            padding: 1rem 0;
            top: 0;
            z-index: 100;
          }
          .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }
          .navbar.scrolled {
            background: var(--card-bg);
            box-shadow: var(--shadow);
          }
          .navbar-brand {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .nav-logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            text-decoration: none;
            color: var(--text-color);
            font-size: 1.5rem;
            font-weight: bold;
          }
          .logo-img {
            width: 50px;
            height: 50px;
            object-fit: contain;
          }
          .nav-menu {
            display: flex;
            gap: 1rem;
            list-style: none;
            margin: 0;
            padding: 0;
          }
          .nav-link {
            color: var(--text-color);
            text-decoration: none;
            padding: 0.5rem 1rem;
            transition: var(--transition);
          }
          .nav-link:hover,
          .nav-link:focus {
            color: var(--accent-color);
            background: rgba(244, 162, 97, 0.1);
          }
          .nav-link.active {
            color: var(--primary-color);
            border-bottom: 2px solid var(--primary-color);
          }
          .nav-toggle {
            display: none;
            background: none;
            border: none;
            color: var(--text-color);
            font-size: 1.5rem;
            cursor: pointer;
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
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            padding: 3rem 1rem;
            align-items: center;
          }
          .hero-content {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .hero-title {
            font-size: clamp(1.8rem, 4vw, 2.5rem);
            color: var(--secondary-color);
            margin: 0;
          }
          .hero-subtitle {
            font-size: clamp(1rem, 2vw, 1.2rem);
            opacity: 0.9;
          }
          .hero-cta {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }
          .cta-button {
            padding: 0.75rem 1.5rem;
            background: var(--primary-color);
            color: var(--bg-end);
            text-decoration: none;
            border-radius: var(--border-radius);
            transition: var(--transition);
            font-weight: bold;
          }
          .cta-button.secondary {
            background: transparent;
            border: 2px solid var(--secondary-color);
            color: var(--secondary-color);
          }
          .cta-button:hover,
          .cta-button:focus {
            transform: translateY(-2px);
            box-shadow: var(--glow);
          }
          .hero-image img {
            width: 100%;
            height: auto;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
          }
          .lang-toggle {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
          }
          .lang-btn {
            padding: 0.5rem 1rem;
            background: var(--card-bg);
            color: var(--text-color);
            border: 1px solid var(--card-border);
            border-radius: 4px;
            cursor: pointer;
            transition: var(--transition);
          }
          .lang-btn.active {
            background: var(--primary-color);
            color: var(--bg-end);
          }
          .lang-btn:hover,
          .lang-btn:focus {
            background: var(--accent-color);
            color: var(--bg-end);
          }
          [lang="en"].lang-hidden,
          [lang="hi"].lang-hidden {
            display: none;
          }
          [lang="en"].lang-visible,
          [lang="hi"].lang-visible {
            display: block;
          }
          .sidebar {
            width: 250px;
            flex-shrink: 0;
            background: var(--card-bg);
            border-radius: 8px;
            padding: 1rem;
            position: sticky;
            top: 120px;
            height: fit-content;
            box-shadow: var(--shadow);
          }
          .sidebar-nav {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .sidebar-link {
            color: var(--text-color);
            text-decoration: none;
            padding: 0.5rem;
            border-radius: 4px;
            transition: var(--transition);
          }
          .sidebar-link:hover,
          .sidebar-link:focus {
            background: rgba(244, 162, 97, 0.1);
            color: var(--accent-color);
          }
          .sidebar-link.active {
            background: var(--primary-color);
            color: var(--bg-end);
          }
          .sidebar-toggle {
            display: none;
            background: var(--primary-color);
            color: var(--bg-end);
            border: none;
            padding: 0.5rem;
            border-radius: 4px;
            cursor: pointer;
            margin-bottom: 1rem;
          }
          .main-content {
            flex: 1;
            padding: 2rem 0;
          }
          .section {
            margin-bottom: 3rem;
            background: var(--card-bg);
            padding: 2rem;
            border-radius: 12px;
            box-shadow: var(--shadow);
            border: 1px solid var(--card-border);
          }
          .section h2 {
            font-size: clamp(1.5rem, 3vw, 2rem);
            color: var(--secondary-color);
            margin-bottom: 1rem;
          }
          .faq-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .faq-item {
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem;
            border-radius: 8px;
            transition: var(--transition);
          }
          .faq-question {
            font-size: 1.1rem;
            color: var(--accent-color);
            cursor: pointer;
            margin: 0;
          }
          .faq-answer {
            display: none;
            margin-top: 1rem;
          }
          .faq-answer.active {
            display: block;
          }
          .faq-question.active {
            color: var(--primary-color);
          }
          .search-bar {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 2rem;
          }
          #search-input {
            flex: 1;
            padding: 0.75rem;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 4px;
            color: var(--text-color);
            font-size: 1rem;
          }
          .search-btn {
            padding: 0.75rem;
            background: var(--primary-color);
            color: var(--bg-end);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: var(--transition);
          }
          .search-btn:hover,
          .search-btn:focus {
            background: var(--accent-color);
          }
          .search-results {
            display: none;
            margin-top: 1rem;
            padding: 1rem;
            background: var(--card-bg);
            border-radius: 8px;
            border: 1px solid var(--card-border);
          }
          .search-results.active {
            display: block;
          }
          .search-result-item {
            padding: 0.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
          }
          .search-result-item:hover {
            background: rgba(244, 162, 97, 0.1);
          }
          .search-highlight {
            background: var(--secondary-color);
            color: var(--bg-end);
            padding: 0.2rem;
            border-radius: 3px;
          }
          .no-results {
            color: #999;
            font-style: italic;
          }
          .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--primary-color);
            color: var(--bg-end);
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            transition: var(--transition);
            z-index: 50;
          }
          .back-to-top.visible {
            opacity: 1;
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
            padding: 0;
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
          .policy-item,
          .testimonial-item {
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
          }
          .testimonial-item blockquote {
            margin: 0;
            padding-left: 1rem;
            border-left: 3px solid var(--primary-color);
          }
          .testimonial-item cite {
            display: block;
            margin-top: 0.5rem;
            font-style: italic;
            opacity: 0.8;
          }
          @media (max-width: 768px) {
            .container {
              flex-direction: column;
            }
            .hero-section {
              grid-template-columns: 1fr;
              text-align: center;
            }
            .hero-image {
              order: 2;
            }
            .nav-menu {
              display: none;
              flex-direction: column;
              position: absolute;
              top: 70px;
              left: 0;
              right: 0;
              background: var(--card-bg);
              padding: 1rem;
              box-shadow: var(--shadow);
            }
            .nav-menu.active {
              display: flex;
            }
            .nav-toggle {
              display: block;
            }
            .sidebar {
              width: 100%;
              position: static;
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
            .hero-title {
              font-size: 1.5rem;
            }
            .cta-button {
              padding: 0.5rem 1rem;
              font-size: 0.9rem;
            }
            .footer-heading {
              font-size: clamp(1rem, 2vw, 1.1rem);
            }
            .footer-link,
            .gift-button {
              font-size: 0.8rem;
            }
          }
        </style>
      </head>
      <body>
        <header class="header">
          <nav class="navbar">
            <div class="navbar-brand">
              <a href="/" class="nav-logo">
                <img src="${logoImage}" alt="LIC Neemuch Logo" class="logo-img" width="50" height="50" loading="lazy">
                <span lang="en" class="lang-hidden">LIC Neemuch</span>
                <span lang="hi" class="lang-visible">LIC नीमच</span>
              </a>
              <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button>
            </div>
            <ul class="nav-menu" id="nav-menu">
              <li><a href="/home" class="nav-link">Home</a></li>
              <li><a href="/reviews" class="nav-link">Reviews</a></li>
              <li><a href="/join" class="nav-link">Join as Agent</a></li>
              <li><a href="/services" class="nav-link">Services</a></li>
              <li><a href="/about" class="nav-link">About</a></li>
              <li><a href="/faqs" class="nav-link">FAQs</a></li>
              <li><a href="/bimasakhi" class="nav-link active" aria-current="page">Bima Sakhi</a></li>
            </ul>
          </nav>
          <div class="hero-section">
            <div class="hero-content">
              <h1 class="hero-title">
                <span lang="en" class="lang-hidden">LIC Bina Sakhi Yojana Neemuch 2025: Empowering Women with Financial Independence</span>
                <span lang="hi" class="lang-visible">एलआईसी बिना सखी योजना नीमच 2025: वित्तीय स्वतंत्रता के साथ महिलाओं को सशक्त बनाना
</span>
              </h1>
              <p class="hero-subtitle">
                <span lang="en" class="lang-hidden"><em>Explore the transformative LIC Bima Sakhi Yojana in Neemuch, Madhya Pradesh</em>, launched in 2024 to empower women aged 18-70. Become an <strong>LIC insurance agent</strong>, earn a stipend of up to ₹7,000/month, and unlock financial independence with commissions up to ₹48,000/year. Promote women-centric policies like <strong>Aadhaar Shila</strong>, <strong>New Jeevan Anand</strong>, and <strong>Tech Term</strong>, fostering financial literacy and security in rural India. Contact Jitendra Patidar at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> or apply online to start your journey today.</span>
                <span lang="hi" class="lang-visible"><em>नीमच, मध्य प्रदेश में परिवर्तनकारी एलआईसी बीमा सखी योजना की खोज करें। </em>2024 में 18-70 वर्ष की महिलाओं को सशक्त बनाने के लिए शुरू की गई। <strong>एलआईसी बीमा एजेंट</strong> बनें, ₹7,000/माह तक का वजीफा कमाएं, और ₹48,000/वर्ष तक के कमीशन के साथ वित्तीय स्वतंत्रता प्राप्त करें। <strong>आधार शिला</strong>, <strong>नया जीवन आनंद</strong>, और <strong>टेक टर्म</strong> जैसी महिलाकेंद्रित योजनाओं को बढ़ावा दें, ग्रामीण भारत में वित्तीय साक्षरता और सुरक्षा को बढ़ावा दें। जितेंद्र पाटीदार से <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें या आज अपनी यात्रा शुरू करने के लिए ऑनलाइन आवेदन करें।</span>
              </p>
              <div class="hero-cta">
                <a href="tel:+917987235207" class="cta-button">
                  <span lang="en" class="lang-hidden">Contact Now</span>
                  <span lang="hi" class="lang-visible">अब संपर्क करें</span>
                </a>
                <a href="https://licindia.in/test2" target="_blank" rel="noopener noreferrer" class="cta-button secondary">
                  <span lang="en" class="lang-hidden">Apply Online</span>
                  <span lang="hi" class="lang-visible">ऑनलाइन करें</span>
                </a>
                <a href="https://wa.me/917987235207" target="_blank" rel="noopener noreferrer" class="cta-button secondary">
                  <span lang="en" class="lang-hidden">WhatsApp Chat</span>
                  <span lang="hi" class="lang-visible">व्हाट्सएप चैट</span>
                </a>
              </div>
              <div class="lang-toggle">
                <button class="lang-btn" data-lang="en">English</button>
                <button class="lang-btn active" data-lang="hi">हिन्दी</button>
              </div>
            </div>
            <div class="hero-image">
              <img src="${metaImage}" alt="Empowered women through LIC Bima Sakhi Yojana in Neemuch, Madhya Pradesh" width="600" height="400" loading="lazy">
            </div>
          </div>
        </header>
        <div class="container">
          <aside class="sidebar">
            <button class="sidebar-toggle" aria-label="Toggle sidebar">☰</button>
            <nav class="sidebar-nav">
              <a href="#overview" class="sidebar-link">Overview</a>
              <a href="#eligibility" class="sidebar-link">Eligibility</a>
                          <a href="#architecture" class="sidebar-link" aria-label="Bima Sakhi Operational Architecture">Architecture</a>

              <a href="#application" class="sidebar-link">Application Process</a>
              <a href="#benefits" class="sidebar-link">Benefits</a>
              <a href="#policies" class="sidebar-link">Women’s Policies</a>
              <a href="#training" class="sidebar-link">Training Program</a>
              <a href="#testimonials" class="sidebar-link">Testimonials</a>
              <a href="#faqs" class="sidebar-link">FAQs</a>
              <a href="#contact" class="sidebar-link">Contact</a>
            </nav>
          </aside>
          <main class="main-content">
            <div class="search-bar">
              <input type="search" id="search-input" placeholder="Search Bima Sakhi FAQs, policies, or benefits (e.g., stipend, eligibility)" aria-label="Search page content">
              <button class="search-btn" aria-label="Search">🔍</button>
            </div>
            <div class="search-results" id="search-results"></div>
            <button class="back-to-top" aria-label="Back to Top">↑</button>
            <article>
              <section class="section" id="overview">
                <h2>
                  <span lang="en" class="lang-hidden">Overview of LIC Bima Sakhi Yojana</span>
                  <span lang="hi" class="lang-visible">एलआइसी बीमा सखी योजना का अवलोकन</span>
                </h2>
                <p>
                  <span lang="en" class="lang-hidden"><em>The LIC Bima Sakhi Yojana</em>, launched on December 9, 2024, by Prime Minister Narendra Modi in Panipat, Haryana, is a revolutionary initiative to empower women in Neemuch, Madhya Pradesh, and across India. Designed for women aged 18-70, this scheme trains participants to become <strong>LIC insurance agents</strong>, offering:</span>
                  <span lang="hi" class="lang-visible"><em>एलआइसी बीमा सखी योजना</em>, 9 दिसंबर 2024 को प्रधानमंत्री नरेंद्र मोदी द्वारा हरियाणा के पानीपत में शुरू की गई, नीमच, मध्य प्रदेश और पूरे भारत में महिलाओं को सशक्त बनाने की एक क्रांतिकारी पहल है। 18-70 वर्ष की महिलाओं के लिए डिज़ाइन की गई, यह योजना प्रतिभागियों को <strong>एलआइसी बीमा एजेंट</strong> बनने के लिए प्रशिक्षित करती है, जो निम्नलिखित प्रदान करती है:</span>
                </p>
                <ul>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Monthly Stipend</strong>: Up to ₹7,000, ₹6,000, and ₹5,000 over three years.</span>
                    <span lang="hi" class="lang-visible"><strong>मासिक वजीफा</strong>: तीन वर्षों में ₹7,000, ₹6,000, और ₹5,000 तक।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Commissions</strong>: Up to ₹48,000 annually.</span>
                    <span lang="hi" class="lang-visible"><strong>कमीशन</strong>: प्रति वर्ष ₹48,000 तक।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Target</strong>: Empower 100,000 women in the first year and 200,000 in three years.</span>
                    <span lang="hi" class="lang-visible"><strong>लक्ष्य</strong>: पहले वर्ष में 100,000 महिलाओं और तीन वर्षों में 200,000 महिलाओं को सशक्त करना।</span>
                  </li>
                </ul>
                <p>
                  <span lang="en" class="lang-hidden">Bima Sakhis promote financial literacy and <strong>women’s empowerment</strong> by educating communities about LIC’s women-centric policies like <strong>Aadhaar Shila</strong> and <strong>Tech Term</strong>. In Neemuch, LIC Development Officer Jitendra Patidar provides personalized guidance. <a href="https://licindia.in" target="_blank" rel="noopener" class="content-link">Visit licindia.in for details</a>.</span>
                  <span lang="hi" class="lang-visible">बीमा सखियां <strong>आधार शिल</strong> और <strong>टक</strong> जैसी एलआइसी की महिलाकेंद्रित योजनाओं के बारे में समुदायों को शिक्षित करके वित्तीय साक्षरता और <strong>महिलाओं के सशक्तिकरण</strong> को बढ़ावा देती हैं। नीमच में, एलआइसी डेवलपमेंट ऑफिसर जितेंद्र पाटीदार व्यक्तिगत मार्गदर्शन प्रदान करते हैं। <a href="https://licindia.in" target="_blank" rel="noopener" class="content-link">विवरण के लिए licindia.in पर जाएं</a>।</span>
                </p>
                <p>
                  <span lang="en" class="lang-hidden">This scheme aligns with LIC’s mission: <em>“Zindagi Ke Saath Bhi, Zindagi Ke Baad Bhi”</em>, ensuring lifelong security for policyholders and agents in rural areas like Neemuch.</span>
                  <span lang="hi" class="lang-visible">यह योजना एलआइसी के मिशन के साथ संरेखित है: <em>“ज़िंदगी के साथ भी, ज़िंदगी के बाद भी”</em>, जो नीमच जैसे ग्रामीण क्षेत्रों में पॉलिसीधारकों और एजेंटों के लिए आजीवन की सुरक्षा सुनिश्चित करती है।</span>
                </p>
              </section>
              <section class="section" id="eligibility">
                <h2>
                  <span lang="en" class="lang-hidden">Eligibility Criteria for Bima Sakhi Yojana</span>
                  <span lang="hi" class="lang-visible">बीमा सखी योजना के लिए पात्रता मानदंड</span>
                </h2>
                <p>
                  <span lang="en" class="lang-hidden"><em>Join us to achieve financial independence.</em> Below is the eligibility criteria for women in Neemuch:</span>
                  <span lang="hi" class="lang-visible"><em>विकास के लिए हमसे जुड़ें।</em> नीमच की महिलाओं के लिए पात्रता मानदंड नीचे दिए गए हैं:</span>
                </p>
                <ul>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Age</strong>: 18 to 70 years, inclusive for young and senior women.</span>
                    <span lang="hi" class="lang-visible"><strong>आयु</strong>: 18 से 70 वर्ष, युवा और वरिष्ठ महिलाओं के लिए समावेशी।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Education</strong>: Minimum 10th standard (SSC) pass.</span>
                    <span lang="hi" class="lang-visible"><strong>शिक्षा</strong>: न्यूनतम 10वीं कक्षा (एसएससी) उत्तीर्ण।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Location</strong>: Preference for rural areas like Neemuch, Mandsaur, and Ratlam.</span>
                    <span lang="hi" class="lang-visible"><strong>स्थान</strong>: नीमच, मंदसौर, और रतलाम जैसे ग्रामीण क्षेत्रों को प्राथमिकता।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Ineligibility</strong>: Relatives of LIC agents/employees (spouse, children, parents, siblings, in-laws) and retired LIC staff.</span>
                    <span lang="hi" class="lang-visible"><strong>अपात्रता</strong>: एलआइसी एजेंटों/कर्मचारियों के रिश्तेदार (पति/पत्नी, बच्चे, माता-पिता, भाई-बहन, ससुराल वाले) और सेवानिवृत्त एलआइसी कर्मचारी।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Requirements</strong>: Valid Aadhaar card, bank account, and willingness for training.</span>
                    <span lang="hi" class="lang-visible"><strong>आवशकताएँ</strong>: वैध आधार कार्ड, बैंक खाता, और प्रशिक्षण के लिए इच्छा।</span>
                  </li>
                </ul>
                <p>
                  <span lang="en" class="lang-hidden">Contact Jitendra Patidar at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> for eligibility queries.</span>
                  <span lang="hi" class="lang-visible">पात्रता प्रश्नों के लिए जितेंद्र पाटीदार से <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें।</span>
                </p>
              </section>
                          <section class="section architecture-section" id="architecture" aria-labelledby="architecture-heading">
              <h2 id="architecture-heading">Bima Sakhi Yojana Architecture (ASCII Diagrams)</h2>
              <p lang="en">
                LIC Neemuch operates through a robust, client-centric model, integrating digital tools, agent networks, and rural outreach for seamless service delivery.Below are ASCII diagrams representing the core processes of the LIC Bima Sakhi Yojana, including application, training, policy promotion, and community impact.
              </p>
              <p lang="hi">
                एलआईसी नीमच डिजिटल उपकरणों, एजेंट नेटवर्क और ग्रामीण आउटरीच को एकीकृत करते हुए एक मजबूत, ग्राहक-केंद्रित मॉडल के माध्यम से संचालित होता है।
              </p>
              <h3>1. Application Process Flow</h3>
                            <p lang="en">
                This diagram illustrates the step-by-step process for women to apply as Bima Sakhis, emphasizing simplicity and accessibility.
              </p>
              <p lang="hi">
               यह चित्र महिलाओं के लिए बीमा सखी के रूप में आवेदन करने की चरण-दर-चरण प्रक्रिया को दर्शाता है, तथा सरलता और सुगमता पर जोर देता है।
              </p>
              <pre class="diagram">
+-------------------------+
|      Inquiry Phase      |
| (Website/Phone/WhatsApp)|
+-------------------------+
            |
            v
+-------------------------+
|   Document Submission   |
| (Aadhaar, 10th Cert,    |
|  Bank Details, Photo)   |
+-------------------------+
            |
            v
+-------------------------+
|   Application Review     |
| (LIC Neemuch Branch/    |
|  Jitendra Patidar)      |
+-------------------------+
            |
            v
+-------------------------+
|    Fee Payment (₹650)   |
| (UPI/Net Banking/Card)  |
+-------------------------+
            |
            v
+-------------------------+
|  Confirmation & Training |
| (Email/SMS with Details)|
+-------------------------+
              </pre>
              <h3>2. Training Program Structure</h3>
              <p lang="en">
               This diagram outlines the three-year training program, highlighting key components and support mechanisms.
                             </p>
              <p lang="hi">
               यह आरेख तीन वर्षीय प्रशिक्षण कार्यक्रम की रूपरेखा प्रस्तुत करता है, तथा प्रमुख घटकों और समर्थन तंत्रों पर प्रकाश डालता है।
              </p>
              <pre class="diagram">
+---------------------------+
|     Training Initiation   |
| (Online/Offline at Neemuch|
|  LIC Branch)              |
+---------------------------+
            |
            v
+---------------------------+
| Year 1: Core Skills       |
| - LIC Products            |
| - Sales Techniques        |
| - Financial Literacy      |
| Stipend: ₹7,000/month     |
+---------------------------+
            |
            v
+---------------------------+
| Year 2: Advanced Skills   |
| - Customer Engagement     |
| - Policy Customization    |
| Stipend: ₹6,000/month     |
+---------------------------+
            |
            v
+---------------------------+
| Year 3: Leadership Skills |
| - Community Outreach      |
| - Team Mentoring          |
| Stipend: ₹5,000/month     |
+---------------------------+
            |
            v
+---------------------------+
| Certification & Career    |
| (LIC Agent/Development    |
|  Officer Pathway)         |
+---------------------------+
              </pre>
              <h3>3. Policy Promotion Workflow</h3>
              <p lang="en">
               This diagram shows how Bima Sakhis promote women-centric LIC policies, driving financial inclusion.
              </p>
              <p lang="hi">
               यह आरेख दर्शाता है कि किस प्रकार बीमा सखियां महिला-केंद्रित एलआईसी पॉलिसियों को बढ़ावा देती हैं, जिससे वित्तीय समावेशन को बढ़ावा मिलता है।
              </p>
              <pre class="diagram">
+---------------------------+
|   Community Engagement    |
| (Workshops, Door-to-Door) |
+---------------------------+
            |
            v
+---------------------------+
|  Policy Education         |
| - Aadhaar Shila (₹11L)    |
| - New Jeevan Anand (₹50L) |
| - Tech Term (₹1 Cr)       |
| - Bima Jyoti (₹10L)       |
+---------------------------+
            |
            v
+---------------------------+
| Client Needs Assessment   |
| (Financial Goals, Budget) |
+---------------------------+
            |
            v
+---------------------------+
| Policy Enrollment         |
| (Digital Portal/Agent)    |
+---------------------------+
            |
            v
+---------------------------+
| Commission & Impact       |
| (₹48,000/year, Financial  |
|  Literacy in Neemuch)     |
+---------------------------+
              </pre>
               <h3>4. Community Impact Ecosystem</h3>
              <p lang="en">
               This diagram illustrates the broader impact of Bima Sakhi Yojana on rural communities in Neemuch.
              </p>
              <p lang="hi">
               यह चित्र नीमच के ग्रामीण समुदायों पर बीमा सखी योजना के व्यापक प्रभाव को दर्शाता है।
              </p>
              <pre class="diagram">
+---------------------------+
|   Women Empowerment       |
| (Financial Independence)  |
+---------------------------+
            |
            v
+---------------------------+       +---------------------------+
| Financial Literacy Growth |<----->| Rural Economic Development |
| (Education on Savings,    |       | (Increased Insurance       |
|  Insurance, Investments)  |       |  Penetration in Neemuch)  |
+---------------------------+       +---------------------------+
            |                             |
            v                             v
+---------------------------+       +---------------------------+
| Community Trust Building  |<----->| Social Impact Metrics     |
| (Policyholder Security,   |       | (100,000 Women in Year 1, |
|  LIC Brand Reliability)   |       |  200,000 in 3 Years)      |
+---------------------------+       +---------------------------+
              </pre>
            </section>
          </article>

            </section>

              <section class="section" id="application">
                <h2>
                  <span lang="en" class="lang-hidden">How to Apply for LIC Bima Sakhi Yojana</span>
                  <span lang="hi" class="lang-visible">एलआइसी बीमा सखी योजना के लिए आवेदन कैसे करें</span>
                </h2>
                <p>
                  <span lang="en" class="lang-hidden"><em>Start your journey as a Bima Sakhi</em> with a simple application tailored for women in Neemuch:</span>
                  <span lang="hi" class="lang-visible"><em>बीमा सखी के रूप में अपनी यात्रा शुरू करें</em> नीमच की महिलाओं के लिए तैयार एक सरल आवेदन प्रक्रिया के साथ:</span>
                </p>
                <ol>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Visit Website</strong>: Go to <a href="https://licindia.in/test2" target="_blank" rel="noopener" class="content-link">licindia.in</a> and select “Bima Sakhi Yojana”.</span>
                    <span lang="hi" class="lang-visible"><strong>वेबसाइट पर जाएं</strong>: <a href="https://licindia.in/test2" target="_blank" rel="noopener" class="content-link">licindia.in</a> पर जाएं और “बीमा सखी योजना” चुनें।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Fill Form</strong>: Enter personal details (name, DOB, mobile, email, address, education).</span>
                    <span lang="hi" class="lang-visible"><strong>फॉर्म भरें</strong>: व्यक्तिगत विवरण दर्ज करें (नाम, जन्म तिथि, मोबाइल, ईमेल, पता, शिक्षा)।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Upload Documents</strong>: Aadhaar card, 10th certificate, bank details, passport-size photo.</span>
                    <span lang="hi" class="lang-visible"><strong>दस्तावेज़ अपलोड करें</strong>: आधार कार्ड, 10वीं प्रमाणपत्र, बैंक विवरण, पासपोर्ट आकार की फोटो।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Pay Fees</strong>: ₹650 (₹150 LIC fee + ₹500 IRDAI exam fee) via UPI, net banking, or card.</span>
                    <span lang="hi" class="lang-visible"><strong>शुल्क भुगतान</strong>: ₹650 (₹150 एलआइसी शुल्क + ₹500 आईआरडीएआई परीक्षा शुल्क) यूपीआई, नेट बैंकिंग, या कार्ड के माध्यम से।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Submit</strong>: Receive confirmation email/SMS with training details.</span>
                    <span lang="hi" class="lang-visible"><strong>जमा करें</strong>: प्रशिक्षण विवरण के साथ पुष्टिकरण ईमेल/एसएमएस प्राप्त करें।</span>
                  </li>
                </ol>
                <p>
                  <span lang="en" class="lang-hidden">For assistance, contact Jitendra Patidar at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> or visit LIC Neemuch branch (Vikas Nagar, Scheme No. 14-3).</span>
                  <span lang="hi" class="lang-visible">सहायता के लिए, जितेंद्र पाटीदार से <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें या एलआइसी नीमच शाखा (विकास नगर, स्कीम नंबर 14-3) पर जाएं।</span>
                </p>
              </section>
              <section class="section" id="benefits">
                <h2>
                  <span lang="en" class="lang-hidden">Benefits of Joining LIC Bima Sakhi Yojana</span>
                  <span lang="hi" class="lang-visible">एलआइसी बीमा सखी योजना में शामिल होने के लाभ</span>
                </h2>
                <p>
                  <span lang="en" class="lang-hidden"><em>Unlock financial and professional growth</em> with the LIC Bima Sakhi Yojana in Neemuch:</span>
                  <span lang="hi" class="lang-visible"><em>वित्तीय और पेशेवर विकास को अनलॉक करें</em> नीमच में एलआइसी बीमा सखी योजना के साथ:</span>
                </p>
                <ul>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Stipend</strong>: ₹7,000 (Year 1), ₹6,000 (Year 2), ₹5,000 (Year 3), totaling ₹2.28 lakh.</span>
                    <span lang="hi" class="lang-visible"><strong>वजीफा</strong>: ₹7,000 (पहला वर्ष), ₹6,000 (दूसरा वर्ष), ₹5,000 (तीसरा वर्ष), कुल ₹2.28 लाख।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Commissions</strong>: Up to ₹48,000/year, potential earnings of ₹1.75 lakh/year.</span>
                    <span lang="hi" class="lang-visible"><strong>कमीशन</strong>: प्रति वर्ष ₹48,000 तक, ₹1.75 लाख/वर्ष की संभावित आय।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Flexibility</strong>: Ideal for homemakers, students, and working women.</span>
                    <span lang="hi" class="lang-visible"><strong>लचीलापन</strong>: गृहिणियों, छात्राओं, और कामकाजी महिलाओं के लिए आदर्श।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Training</strong>: Free three-year program on insurance, sales, and financial literacy.</span>
                    <span lang="hi" class="lang-visible"><strong>प्रशिक्षण</strong>: बीमा, बिक्री, और वित्तीय साक्षरता पर मुफ्त तीन-वर्षीय कार्यक्रम।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Career Growth</strong>: Become a permanent LIC agent or Development Officer.</span>
                    <span lang="hi" class="lang-visible"><strong>करियर विकास</strong>: स्थायी एलआइसी एजेंट या डेवलपमेंट ऑफिसर बनें।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Social Impact</strong>: Promote financial inclusion in rural Neemuch.</span>
                    <span lang="hi" class="lang-visible"><strong>सामाजिक प्रभाव</strong>: ग्रामीण नीमच में वित्तीय समावेशन को बढ़ावा दें।</span>
                  </li>
                </ul>
                <p>
                  <span lang="en" class="lang-hidden">Join now! Chat with Jitendra Patidar at <a href="https://wa.me/917987235207" target="_blank" rel="noopener" class="content-link">WhatsApp</a>.</span>
                  <span lang="hi" class="lang-visible">अब शामिल हों! जितेंद्र पाटीदार के साथ <a href="https://wa.me/917987235207" target="_blank" rel="noopener" class="content-link">व्हाट्सएप</a> पर चैट करें।</span>
                </p>
              </section>
              <section class="section" id="policies">
                <h2>
                  <span lang="en" class="lang-hidden">LIC Insurance Policies for Women in Neemuch</span>
                  <span lang="hi" class="lang-visible">नीमच में महिलाओं के लिए एलआइसी बीमा योजनाएं</span>
                </h2>
                <p>
                  <span lang="en" class="lang-hidden"><em>Promote financial security</em> as a Bima Sakhi with these women-centric LIC policies:</span>
                  <span lang="hi" class="lang-visible"><em>वित्तीय सुरक्षा को बढ़ावा दें</em> बीमा सखी के रूप में इन महिलाकेंद्रित एलआइसी योजनाओं के साथ:</span>
                </p>
                <div class="policy-item">
                  <h3>
                    <span lang="en" class="lang-hidden">LIC Aadhaar Shila</span>
                    <span lang="hi" class="lang-visible">एलआइसी आधार शिला</span>
                  </h3>
                  <p>
                    <span lang="en" class="lang-hidden">For women aged 8-55, offers <strong>₹11 lakh</strong> life cover and savings with premiums from ₹29/day. Ideal for rural Neemuch women. <a href="/services/aadhaar-shila" class="content-link">Learn more</a>.</span>
                    <span lang="hi" class="lang-visible">8-55 वर्ष की महिलाओं के लिए, ₹29/दिन से प्रीमियम के साथ <strong>₹11 लाख</strong> जीवन कवर और बचत प्रदान करता है। ग्रामीण नीमच महिलाओं के लिए आदर्श। <a href="/services/aadhaar-shila" class="content-link">और जानें</a>।</span>
                  </p>
                </div>
                <div class="policy-item">
                  <h3>
                    <span lang="en" class="lang-hidden">LIC New Jeevan Anand</span>
                    <span lang="hi" class="lang-visible">एलआइसी नया जीवन आनंद</span>
                  </h3>
                  <p>
                    <span lang="en" class="lang-hidden">Combines endowment and whole-life coverage with returns up to <strong>₹50 lakh</strong>. Perfect for education or retirement planning. <a href="/services/new-jeevan-anand" class="content-link">Explore details</a>.</span>
                    <span lang="hi" class="lang-visible"><strong>₹50 लाख</strong> तक की रिटर्न के साथ एंडोमेंट और पूर्ण जीवन कवर को जोड़ता है। शिक्षा या सेवानिवृत्ति योजना के लिए एकदम सही। <a href="/services/new-jeevan-anand" class="content-link">विवरण देखें</a>।</span>
                  </p>
                </div>
                <div class="policy-item">
                  <h3>
                    <span lang="en" class="lang-hidden">LIC Tech Term</span>
                    <span lang="hi" class="lang-visible">एलआइसी टेक टर्म</span>
                  </h3>
                  <p>
                    <span lang="en" class="lang-hidden">Online term plan for women aged 18-65, up to <strong>₹1 crore</strong> cover at ₹500/month for ₹50 lakh. Suits working professionals. <a href="/services/tech-term" class="content-link">Get started</a>.</span>
                    <span lang="hi" class="lang-visible">18-65 वर्ष की महिलाओं के लिए ऑनलाइन टर्म योजना, ₹50 लाख के लिए ₹500/माह पर <strong>₹1 करोड़</strong> तक कवर। कामकाजी पेशेवरों के लिए उपयुक्त। <a href="/services/tech-term" class="content-link">शुरू करें</a>।</span>
                  </p>
                </div>
                <div class="policy-item">
                  <h3>
                    <span lang="en" class="lang-hidden">LIC Bima Jyoti</span>
                    <span lang="hi" class="lang-visible">एलआइसी बीमा ज्योति</span>
                  </h3>
                  <p>
                    <span lang="en" class="lang-hidden">Savings plan with guaranteed returns and <strong>₹10 lakh</strong> life cover. Flexible for Neemuch women. <a href="/services/bima-jyoti" class="content-link">Discover more</a>.</span>
                    <span lang="hi" class="lang-visible">गारंटीशुदा रिटर्न और <strong>₹10 लाख</strong> जीवन कवर के साथ बचत योजना। नीमच महिलाओं के लिए लचीली। <a href="/services/bima-jyoti" class="content-link">और जानें</a>।</span>
                  </p>
                </div>
                <p>
                  <span lang="en" class="lang-hidden">Bima Sakhis guide clients through these policies. <a href="/services" class="content-link">Explore all LIC plans</a>.</span>
                  <span lang="hi" class="lang-visible">बीमा सखियां इन योजनाओं के माध्यम से ग्राहकों का मार्गदर्शन करती हैं। <a href="/services" class="content-link">सभी एलआइसी योजनाएं देखें</a>।</span>
                </p>
              </section>
              <section class="section" id="training">
                <h2>
                  <span lang="en" class="lang-hidden">Training Program for Bima Sakhis</span>
                  <span lang="hi" class="lang-visible">बीमा सखियों के लिए प्रशिक्षण कार्यक्रम</span>
                </h2>
                <p>
                  <span lang="en" class="lang-hidden"><em>Empower yourself with knowledge</em> through LIC’s comprehensive training for Bima Sakhis in Neemuch:</span>
                  <span lang="hi" class="lang-visible"><em>ज्ञान के साथ खुद को सशक्त करें</em> नीमच में बीमा सखियों के लिए एलआइसी के व्यापक प्रशिक्षण के माध्यम से:</span>
                </p>
                <ul>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Duration</strong>: Three years, free of cost.</span>
                    <span lang="hi" class="lang-visible"><strong>अवधि</strong>: तीन वर्ष, निःशुल्क।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Topics</strong>: LIC products, sales techniques, financial literacy, customer service.</span>
                    <span lang="hi" class="lang-visible"><strong>विषय</strong>: एलआइसी उत्पाद, बिक्री तकनीक, वित्तीय साक्षरता, ग्राहक सेवा।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Mode</strong>: Online or offline at Neemuch’s LIC branch.</span>
                    <span lang="hi" class="lang-visible"><strong>मोड</strong>: ऑनलाइन या नीमच की एलआइसी शाखा पर ऑफलाइन।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Support</strong>: Continuous guidance from trainers and Jitendra Patidar.</span>
                    <span lang="hi" class="lang-visible"><strong>समर्थन</strong>: प्रशिक्षकों और जितेंद्र पाटीदार से निरंतर मार्गदर्शन।</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Outcome</strong>: Certification as an LIC insurance agent.</span>
                    <span lang="hi" class="lang-visible"><strong>परिणाम</strong>: एलआइसी बीमा एजेंट के रूप में प्रमाणन।</span>
                  </li>
                </ul>
                <p>
                  <span lang="en" class="lang-hidden">This training equips women to promote <strong>financial literacy</strong> and <strong>women’s empowerment</strong> in Neemuch. <a href="https://licindia.in/test2" target="_blank" rel="noopener" class="content-link">Apply now</a> to start training.</span>
                  <span lang="hi" class="lang-visible">यह प्रशिक्षण नीमच में <strong>वित्तीय साक्षरता</strong> और <strong>महिलाओं के सशक्तिकरण</strong> को बढ़ावा देने के लिए महिलाओं को सक्षम बनाता है। प्रशिक्षण शुरू करने के लिए <a href="https://licindia.in/test2" target="_blank" rel="noopener" class="content-link">अब आवेदन करें</a>।</span>
                </p>
              </section>
              <section class="section" id="testimonials">
                <h2>
                  <span lang="en" class="lang-hidden">Success Stories of Bima Sakhis in Neemuch</span>
                  <span lang="hi" class="lang-visible">नीमच में बीमा सखियों की सफलता की कहानियाँ</span>
                </h2>
                <p>
                  <span lang="en" class="lang-hidden"><em>Be inspired</em> by women who achieved financial independence through the LIC Bima Sakhi Yojana:</span>
                  <span lang="hi" class="lang-visible"><em>प्रेरित हों</em> उन महिलाओं से जिन्होंने एलआइसी बीमा सखी योजना के माध्यम से वित्तीय स्वतंत्रता हासिल की:</span>
                </p>
                <div class="testimonial-item">
                  <blockquote>
                    <p>
                      <span lang="en" class="lang-hidden">“Bima Sakhi Yojana gave me confidence and income. I earn ₹7,000/month and educate my village about insurance.”</span>
                      <span lang="hi" class="lang-visible">“बीमा सखी योजना ने मुझे आत्मविश्वास और आय दी। मैं ₹7,000/माह कमाती हूँ और अपने गाँव को बीमा के बारे में शिक्षित करती हूँ।”</span>
                    </p>
                    <cite>
                      <span lang="en" class="lang-hidden">Radha Bai, Neemuch</span>
                      <span lang="hi" class="lang-visible">राधा बाई, नीमच</span>
                    </cite>
                  </blockquote>
                </div>
                <div class="testimonial-item">
                  <blockquote>
                    <p>
                      <span lang="en" class="lang-hidden">“As a homemaker, I now earn commissions and plan for my daughter’s future thanks to Bima Sakhi.”</span>
                      <span lang="hi" class="lang-visible">“एक गृहिणी के रूप में, मैं अब बीमा सखी के कारण कमीशन कमाती हूँ और अपनी बेटी के भविष्य की योजना बनाती हूँ।”</span>
                    </p>
                    <cite>
                      <span lang="en" class="lang-hidden">Suman Sharma, Manasa</span>
                      <span lang="hi" class="lang-visible">सुमन शर्मा, मनासा</span>
                    </cite>
                  </blockquote>
                </div>
                <div class="testimonial-item">
                  <blockquote>
                    <p>
                      <span lang="en" class="lang-hidden">“With Jitendra Sir’s guidance, I sold 15 policies and empower my community.”</span>
                      <span lang="hi" class="lang-visible">“जितेंद्र सर के मार्गदर्शन से, मैंने 15 पॉलिसियाँ बेचीं और अपने समुदाय को सशक्त किया।”</span>
                    </p>
                    <cite>
                      <span lang="en" class="lang-hidden">Pooja Kumari, Jawad</span>
                      <span lang="hi" class="lang-visible">पूजा कुमारी, जावद</span>
                    </cite>
                  </blockquote>
                </div>
                <p>
                  <span lang="en" class="lang-hidden">Write your success story! <a href="/join" class="content-link">Apply today</a>.</span>
                  <span lang="hi" class="lang-visible">अपनी सफलता की कहानी लिखें! <a href="/join" class="content-link">आज आवेदन करें</a>।</span>
                </p>
              </section>
              <section class="section" id="faqs">
                <h2>
                  <span lang="en" class="lang-hidden">Frequently Asked Questions About Bima Sakhi Yojana</span>
                  <span lang="hi" class="lang-visible">बीमा सखी योजना के बारे में अक्सर पूछे जाने वाले प्रश्न</span>
                </h2>
                <p>
                  <span lang="en" class="lang-hidden"><em>Clarify your doubts</em> about the LIC Bima Sakhi Yojana in Neemuch:</span>
                  <span lang="hi" class="lang-visible"><em>अपने संदेह दूर करें</em> नीमच में एलआइसी बीमा सखी योजना के बारे में:</span>
                </p>
                <div class="faq-list">
                  <div class="faq-item">
                    <h3 class="faq-question" id="faq-1" aria-controls="answer-1" aria-expanded="false">
                      <span lang="en" class="lang-hidden">What is LIC Bima Sakhi Yojana?</span>
                      <span lang="hi" class="lang-visible">एलआइसी बीमा सखी योजना क्या है?</span>
                    </h3>
                    <div class="faq-answer" id="answer-1">
                      <div lang="en" class="lang-hidden">A 2024 scheme to train women aged 18-70 as LIC insurance agents, offering ₹7,000-₹5,000/month stipends and ₹48,000/year commissions, promoting <strong>women’s empowerment</strong> in Neemuch.</div>
                      <div lang="hi" class="lang-visible">2024 की एक योजना जो 18-70 वर्ष की महिलाओं को एलआइसी बीमा एजेंट के रूप में प्रशिक्षित करती है, ₹7,000-₹5,000/माह वजीफा और ₹48,000/वर्ष कमीशन प्रदान करती है, नीमच में <strong>महिलाओं के सशक्तिकरण</strong> को बढ़ावा देती है।</div>
                    </div>
                  </div>
                  <div class="faq-item">
                    <h3 class="faq-question" id="faq-2" aria-controls="answer-2" aria-expanded="false">
                      <span lang="en" class="lang-hidden">Who is eligible to apply for Bima Sakhi Yojana?</span>
                      <span lang="hi" class="lang-visible">बीमा सखी योजना के लिए कौन पात्र है?</span>
                    </h3>
                    <div class="faq-answer" id="answer-2">
                      <div lang="en" class="lang-hidden">Women aged 18-70 with 10th-class education, preferably from rural Neemuch. LIC agent/employee relatives are ineligible.</div>
                      <div lang="hi" class="lang-visible">18-70 वर्ष की महिलाएं जिन्होंने 10वीं कक्षा पास की हो, विशेष रूप से ग्रामीण नीमच से। एलआइसी एजेंट/कर्मचारी के रिश्तेदार अपात्र हैं।</div>
                    </div>
                  </div>
                  <div class="faq-item">
                    <h3 class="faq-question" id="faq-3" aria-controls="answer-3" aria-expanded="false">
                      <span lang="en" class="lang-hidden">How can I apply for Bima Sakhi Yojana in Neemuch?</span>
                      <span lang="hi" class="lang-visible">मैं नीमच में बीमा सखी योजना के लिए कैसे आवेदन कर सकता हूँ?</span>
                    </h3>
                    <div class="faq-answer" id="answer-3">
                      <div lang="en" class="lang-hidden">Apply at <a href="https://licindia.in/test2" target="_blank" rel="noopener" class="content-link">licindia.in</a>, upload documents, pay ₹650. Contact Jitendra Patidar at <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.</div>
                      <div lang="hi" class="lang-visible"><a href="https://licindia.in/test2" target="_blank" rel="noopener" class="content-link">licindia.in</a> पर आवेदन करें, दस्तावेज़ अपलोड करें, ₹650 का भुगतान करें। जितेंद्र पाटीदार से <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें।</div>
                    </div>
                  </div>
                  <div class="faq-item">
                    <h3 class="faq-question" id="faq-4" aria-controls="answer-4" aria-expanded="false">
                      <span lang="en" class="lang-hidden">What are the stipend details for Bima Sakhis?</span>
                      <span lang="hi" class="lang-visible">बीमा सखियों के लिए वजीफा का विवरण क्या है?</span>
                    </h3>
                    <div class="faq-answer" id="answer-4">
                      <div lang="en" class="lang-hidden">₹7,000/month (Year 1), ₹6,000/month (Year 2), ₹5,000/month (Year 3), totaling ₹2.28 lakh. Commissions up to ₹48,000/year.</div>
                      <div lang="hi" class="lang-visible">₹7,000/माह (पहला वर्ष), ₹6,000/माह (दूसरा वर्ष), ₹5,000/माह (तीसरा वर्ष), कुल ₹2.28 लाख। कमीशन ₹48,000/वर्ष तक।</div>
                    </div>
                  </div>
                  <div class="faq-item">
                    <h3 class="faq-question" id="faq-5" aria-controls="answer-5" aria-expanded="false">
                      <span lang="en" class="lang-hidden">Are there mandatory sales targets for Bima Sakhis?</span>
                      <span lang="hi" class="lang-visible">क्या बीमा सखियों के लिए अनिवार्य बिक्री लक्ष्य हैं?</span>
                    </h3>
                    <div class="faq-answer" id="answer-5">
                      <div lang="en" class="lang-hidden">No mandatory targets; suggested ~24-30 low-value policies annually, focusing on awareness.</div>
                      <div lang="hi" class="lang-visible">कोई अनिवार्य लक्ष्य नहीं; प्रति वर्ष ~24-30 कम मूल्य वाली पॉलिसी की सलाह, जागरूकता पर ध्यान।</div>
                    </div>
                  </div>
                  <div class="faq-item">
                    <h3 class="faq-question" id="faq-6" aria-controls="answer-6" aria-expanded="false">
                      <span lang="en" class="lang-hidden">What training is provided to Bima Sakhis?</span>
                      <span lang="hi" class="lang-visible">बीमा सखियों को कौन सा प्रशिक्षण प्रदान किया जाता है?</span>
                    </h3>
                    <div class="faq-answer" id="answer-6">
                      <div lang="en" class="lang-hidden">Free three-year training on insurance products, sales, financial literacy, online or at Neemuch’s LIC branch.</div>
                      <div lang="hi" class="lang-visible">बीमा उत्पादों, बिक्री, वित्तीय साक्षरता पर मुफ्त तीन-वर्षीय प्रशिक्षण, ऑनलाइन या नीमच की एलआइसी शाखा पर।</div>
                    </div>
                  </div>
                  <div class="faq-item">
                    <h3 class="faq-question" id="faq-7" aria-controls="answer-7" aria-expanded="false">
                      <span lang="en" class="lang-hidden">Can homemakers join Bima Sakhi Yojana?</span>
                      <span lang="hi" class="lang-visible">क्या गृहणियां बीमा सखी योजना में शामिल हो सकती हैं?</span>
                    </h3>
                    <div class="faq-answer" id="answer-7">
                      <div lang="en" class="lang-hidden">Yes, flexible hours suit homemakers with 10th-class education, allowing income while managing home.</div>
                      <div lang="hi" class="lang-visible">हां, लचीले घंटे 10वीं कक्षा की शिक्षा वाली गृहिणियों के लिए उपयुक्त, घर संभालते हुए आय की अनुमति।</div>
                    </div>
                  </div>
                  <div class="faq-item">
                    <h3 class="faq-question" id="faq-8" aria-controls="answer-8" aria-expanded="false">
                      <span lang="en" class="lang-hidden">What documents are required to apply?</span>
                      <span lang="hi" class="lang-visible">आवेदन के लिए किन दस्तावेजों की आवश्यकता है?</span>
                    </h3>
                    <div class="faq-answer" id="answer-8">
                      <div lang="en" class="lang-hidden">Aadhaar card, 10th certificate, bank details, passport-size photo.</div>
                      <div lang="hi" class="lang-visible">आधार कार्ड, 10वीं प्रमाणपत्र, बैंक विवरण, पासपोर्ट आकार की फोटो।</div>
                    </div>
                  </div>
                  <div class="faq-item">
                    <h3 class="faq-question" id="faq-9" aria-controls="answer-9" aria-expanded="false">
                      <span lang="en" class="lang-hidden">Is there an application fee for Bima Sakhi Yojana?</span>
                      <span lang="hi" class="lang-visible">क्या बीमा सखी योजना के लिए आवेदन शुल्क है?</span>
                    </h3>
                    <div class="faq-answer" id="answer-9">
                      <div lang="en" class="lang-hidden">Yes, ₹650 (₹150 LIC fee + ₹500 IRDAI exam fee) via UPI, net banking, or card.</div>
                      <div lang="hi" class="lang-visible">हां, ₹650 (₹150 एलआइसी शुल्क + ₹500 आईआरडीएआई परीक्षा शुल्क) यूपीआई, नेट बैंकिंग, या कार्ड के माध्यम से।</div>
                    </div>
                  </div>
                  <div class="faq-item">
                    <h3 class="faq-question" id="faq-10" aria-controls="answer-10" aria-expanded="false">
                      <span lang="en" class="lang-hidden">How can I contact the LIC office in Neemuch?</span>
                      <span lang="hi" class="lang-visible">मैं नीमच में एलआइसी कार्यालय से कैसे संपर्क कर सकता हूँ?</span>
                    </h3>
                    <div class="faq-answer" id="answer-10">
                      <div lang="en" class="lang-hidden">Contact Jitendra Patidar at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> or <a href="https://wa.me/917987235207" target="_blank" rel="noopener" class="content-link">WhatsApp</a>. Visit Vikas ~
 Nagar, Scheme No. 14-3, Neemuch.</div>
                      <div lang="hi" class="lang-visible">जितेंद्र पाटीदार से <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर या <a href="https://wa.me/917987235207" target="_blank" rel="noopener" class="content-link">व्हाट्सएप</a> पर संपर्क करें। विकास नगर, स्कीम नंबर 14-3, नीमच पर जाएं।</div>
                    </div>
                  </div>
                </div>
                <p>
                  <span lang="en" class="lang-hidden">For more queries, email <a href="mailto:jitendra.licneemuch@gmail.com" class="content-link">jitendra.licneemuch@gmail.com</a> or call <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.</span>
                  <span lang="hi" class="lang-visible">अधिक प्रश्नों के लिए, <a href="mailto:jitendra.licneemuch@gmail.com" class="content-link">jitendra.licneemuch@gmail.com</a> पर ईमेल करें या <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर कॉल करें।</span>
                </p>
              </section>
              <section class="section" id="contact">
                <h2>
                  <span lang="en" class="lang-hidden">Contact LIC Neemuch for Bima Sakhi Yojana</span>
                  <span lang="hi" class="lang-visible">बीमा सखी योजना के लिए नीमच एलआईसी से संपर्क करें</span>
                </h2>
                <p>
                  <span lang="en" class="lang-hidden"><em>Connect with us</em> for personalized guidance on joining the LIC Bima Sakhi Yojana in Neemuch. Our team, led by LIC Development Officer Jitendra Patidar, is here to assist you every step of the way.</span>
                  <span lang="hi" class="lang-visible"><em>हमसे संपर्क करें</em> नीमच में एलआईसी बीमा सखी योजना में शामिल होने के लिए व्यक्तिगत मार्गदर्शन के लिए। हमारी टीम, एलआईसी डेवलपमेंट ऑफिसर जितेंद्र पाटीदार के नेतृत्व में, आपके हर कदम पर सहायता के लिए तैयार है।</span>
                </p>
                <ul>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Phone</strong>: <a href="tel:+917987235207" class="content-link">+91 7987235207</a> (Jitendra Patidar, available 9 AM–6 PM)</span>
                    <span lang="hi" class="lang-visible"><strong>फोन</strong>: <a href="tel:+917987235207" class="content-link">+91 7987235207</a> (जितेंद्र पाटीदार, सुबह 9 बजे–शाम 6 बजे उपलब्ध)</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>WhatsApp</strong>: <a href="https://wa.me/917987235207" target="_blank" rel="noopener" class="content-link">Chat Now</a></span>
                    <span lang="hi" class="lang-visible"><strong>व्हाट्सएप</strong>: <a href="https://wa.me/917987235207" target="_blank" rel="noopener" class="content-link">अब चैट करें</a></span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Email</strong>: <a href="mailto:jitendra.licneemuch@gmail.com" class="content-link">jitendra.licneemuch@gmail.com</a></span>
                    <span lang="hi" class="lang-visible"><strong>ईमेल</strong>: <a href="mailto:jitendra.licneemuch@gmail.com" class="content-link">jitendra.licneemuch@gmail.com</a></span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Address</strong>: LIC of India, Vikas Nagar, Scheme No. 14-3, Neemuch, Madhya Pradesh 458441</span>
                    <span lang="hi" class="lang-visible"><strong>पता</strong>: भारतीय जीवन बीमा निगम, विकास नगर, स्कीम नंबर 14-3, नीमच, मध्य प्रदेश 458441</span>
                  </li>
                  <li>
                    <span lang="en" class="lang-hidden"><strong>Office Hours</strong>: Monday–Saturday, 10 AM–5 PM</span>
                    <span lang="hi" class="lang-visible"><strong>कार्यालय समय</strong>: सोमवार–शनिवार, सुबह 10 बजे–शाम 5 बजे</span>
                  </li>
                </ul>
                <p>
                  <span lang="en" class="lang-hidden">Visit our office or contact us to learn how the Bima Sakhi Yojana can transform your life with <strong>financial independence</strong> and <strong>community impact</strong>. <a href="/join" class="content-link">Start your application today</a>.</span>
                  <span lang="hi" class="lang-visible">हमारे कार्यालय में आएं या हमसे संपर्क करें यह जानने के लिए कि बीमा सखी योजना कैसे <strong>वित्तीय स्वतंत्रता</strong> और <strong>समुदाय प्रभाव</strong> के साथ आपके जीवन को बदल सकती है। <a href="/join" class="content-link">आज अपना आवेदन शुरू करें</a>।</span>
                </p>
              </section>
            </article>
          </main>
        </div>
        <footer>
          <div class="footer-wave"></div>
          <div class="footer-content">
            <div class="footer-section">
              <h3 class="footer-heading">
                <span lang="en" class="lang-hidden">About LIC Neemuch</span>
                <span lang="hi" class="lang-visible">एलआईसी नीमच के बारे में</span>
              </h3>
              <p>
                <span lang="en" class="lang-hidden">Serving Neemuch for over 20 years, we empower communities with LIC’s trusted insurance solutions and women-centric initiatives like Bima Sakhi Yojana.</span>
                <span lang="hi" class="lang-visible">20 वर्षों से नीमच की सेवा करते हुए, हम एलआईसी के विश्वसनीय बीमा समाधानों और बीमा सखी योजना जैसे महिलाकेंद्रित पहलों के साथ समुदायों को सशक्त करते हैं।</span>
              </p>
            </div>
            <div class="footer-section">
              <h3 class="footer-heading">
                <span lang="en" class="lang-hidden">Quick Links</span>
                <span lang="hi" class="lang-visible">त्वरित लिंक</span>
              </h3>
              <ul class="footer-links">
                <li><a href="/home" class="footer-link">Home</a></li>
                <li><a href="/services" class="footer-link">Services</a></li>
                <li><a href="/bimasakhi" class="footer-link">Bima Sakhi</a></li>
                <li><a href="/faqs" class="footer-link">FAQs</a></li>
                <li><a href="/contact" class="footer-link">Contact</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h3 class="footer-heading">
                <span lang="en" class="lang-hidden">Contact Us</span>
                <span lang="hi" class="lang-visible">हमसे संपर्क करें</span>
              </h3>
              <ul class="footer-links">
                <li><a href="tel:+917987235207" class="footer-link">+91 7987235207</a></li>
                <li><a href="mailto:jitendra.licneemuch@gmail.com" class="footer-link">jitendra.licneemuch@gmail.com</a></li>
                <li><a href="/contact" class="footer-link">Vikas Nagar, Neemuch</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h3 class="footer-heading">
                <span lang="en" class="lang-hidden">Our Gift to You</span>
                <span lang="hi" class="lang-visible">आपके लिए हमारा उपहार</span>
              </h3>
              <div class="footer-gift">
                <a href="/join" class="gift-button">
                  <span lang="en" class="lang-hidden">Join Bima Sakhi Today</span>
                  <span lang="hi" class="lang-visible">आज बीमा सखी में शामिल हों</span>
                </a>
              </div>
              <div class="developer-message">
                <p>
                  <span lang="en" class="lang-hidden">Crafted with care by Jitendra Patidar’s team to empower Neemuch’s women.</span>
                  <span lang="hi" class="lang-visible">जितेंद्र पाटीदार की टीम द्वारा नीमच की महिलाओं को सशक्त करने के लिए सावधानी से बनाया गया।</span>
                </p>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>
              <span lang="en" class="lang-hidden">© 2025 LIC Neemuch. All rights reserved. <a href="/privacy" class="content-link">Privacy Policy</a> | <a href="/terms" class="content-link">Terms of Service</a></span>
              <span lang="hi" class="lang-visible">© 2025 एलआईसी नीमच। सर्वाधिकार सुरक्षित। <a href="/privacy" class="content-link">गोपनीयता नीति</a> | <a href="/terms" class="content-link">सेवा की शर्तें</a></span>
            </p>
            <p>
              <span lang="en" class="lang-hidden">This website is for informational purposes only. For official details, visit <a href="https://licindia.in" target="_blank" rel="noopener" class="content-link">licindia.in</a>.</span>
              <span lang="hi" class="lang-visible">यह वेबसाइट केवल सूचना के उद्देश्य से है। आधिकारिक विवरण के लिए, <a href="https://licindia.in" target="_blank" rel="noopener" class="content-link">licindia.in</a> पर जाएं।</span>
            </p>
          </div>
        </footer>
        <script type="application/ld+json">
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "${escapeHTML(metaTitle)}",
            "description": "${escapeHTML(metaDescription)}",
            "url": "${pageUrl}",
            "image": "${metaImage}",
            "publisher": {
              "@type": "Organization",
              "name": "LIC Neemuch",
              "logo": {
                "@type": "ImageObject",
                "url": "${logoImage}"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-7987235207",
                "contactType": "Customer Service",
                "areaServed": "IN",
                "availableLanguage": ["English", "Hindi"]
              }
            },
            "mainEntity": {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "${escapeHTML('What is LIC Bima Sakhi Yojana?')}",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${escapeHTML('A 2024 scheme to train women aged 18-70 as LIC insurance agents, offering ₹7,000-₹5,000/month stipends and ₹48,000/year commissions, promoting women’s empowerment in Neemuch.')}"
                  }
                },
                {
                  "@type": "Question",
                  "name": "${escapeHTML('Who is eligible to apply for Bima Sakhi Yojana?')}",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${escapeHTML('Women aged 18-70 with 10th-class education, preferably from rural Neemuch. LIC agent/employee relatives are ineligible.')}"
                  }
                },
                {
                  "@type": "Question",
                  "name": "${escapeHTML('How can I apply for Bima Sakhi Yojana in Neemuch?')}",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${escapeHTML('Apply at licindia.in, upload documents, pay ₹650. Contact Jitendra Patidar at +91 7987235207.')}"
                  }
                },
                {
                  "@type": "Question",
                  "name": "${escapeHTML('What are the stipend details for Bima Sakhis?')}",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${escapeHTML('₹7,000/month (Year 1), ₹6,000/month (Year 2), ₹5,000/month (Year 3), totaling ₹2.28 lakh. Commissions up to ₹48,000/year.')}"
                  }
                },
                {
                  "@type": "Question",
                  "name": "${escapeHTML('Are there mandatory sales targets for Bima Sakhis?')}",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${escapeHTML('No mandatory targets; suggested ~24-30 low-value policies annually, focusing on awareness.')}"
                  }
                },
                {
                  "@type": "Question",
                  "name": "${escapeHTML('What training is provided to Bima Sakhis?')}",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${escapeHTML('Free three-year training on insurance products, sales, financial literacy, online or at Neemuch’s LIC branch.')}"
                  }
                },
                {
                  "@type": "Question",
                  "name": "${escapeHTML('Can homemakers join Bima Sakhi Yojana?')}",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${escapeHTML('Yes, flexible hours suit homemakers with 10th-class education, allowing income while managing home.')}"
                  }
                },
                {
                  "@type": "Question",
                  "name": "${escapeHTML('What documents are required to apply?')}",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${escapeHTML('Aadhaar card, 10th certificate, bank details, passport-size photo.')}"
                  }
                },
                {
                  "@type": "Question",
                  "name": "${escapeHTML('Is there an application fee for Bima Sakhi Yojana?')}",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${escapeHTML('Yes, ₹650 (₹150 LIC fee + ₹500 IRDAI exam fee) via UPI, net banking, or card.')}"
                  }
                },
                {
                  "@type": "Question",
                  "name": "${escapeHTML('How can I contact the LIC office in Neemuch?')}",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "${escapeHTML('Contact Jitendra Patidar at +91 7987235207 or WhatsApp. Visit Vikas Nagar, Scheme No. 14-3, Neemuch.')}"
                  }
                }
              ]
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://licneemuch.space"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Bima Sakhi Yojana",
                  "item": "https://licneemuch.space/bimasakhi"
                }
              ]
            }
          }
        </script>
        <script>
          // Initialize default language (Hindi)
          document.addEventListener('DOMContentLoaded', function() {
            var lang = localStorage.getItem('language') || 'hi';
            setLanguage(lang);
            updateActiveLangButton(lang);
          });

          // Language toggle functionality
          function setLanguage(lang) {
            document.querySelectorAll('[lang="en"]').forEach(function(el) {
              el.classList.toggle('lang-hidden', lang !== 'en');
              el.classList.toggle('lang-visible', lang === 'en');
            });
            document.querySelectorAll('[lang="hi"]').forEach(function(el) {
              el.classList.toggle('lang-hidden', lang !== 'hi');
              el.classList.toggle('lang-visible', lang === 'hi');
            });
            localStorage.setItem('language', lang);
          }

          function updateActiveLangButton(lang) {
            document.querySelectorAll('.lang-btn').forEach(function(btn) {
              btn.classList.toggle('active', btn.dataset.lang === lang);
            });
          }

          document.querySelectorAll('.lang-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
              var newLang = btn.dataset.lang;
              setLanguage(newLang);
              updateActiveLangButton(newLang);
            });
          });

          // Navbar toggle for mobile
          var navToggle = document.querySelector('.nav-toggle');
          var navMenu = document.querySelector('.nav-menu');
          if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
              var isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
              navMenu.classList.toggle('active');
              navToggle.setAttribute('aria-expanded', !isExpanded);
              navToggle.textContent = isExpanded ? '☰' : '✕';
            });
          }

          // Sidebar toggle for mobile
          var sidebarToggle = document.querySelector('.sidebar-toggle');
          var sidebarNav = document.querySelector('.sidebar-nav');
          if (sidebarToggle && sidebarNav) {
            sidebarToggle.addEventListener('click', function() {
              sidebarNav.classList.toggle('active');
              sidebarToggle.textContent = sidebarNav.classList.contains('active') ? '✕' : '☰';
            });
          }

          // Intersection Observer for sidebar link highlighting
          var sections = document.querySelectorAll('.section');
          var sidebarLinks = document.querySelectorAll('.sidebar-link');
          var observerOptions = {
            root: null,
            rootMargin: '-100px 0px -50% 0px',
            threshold: 0.1
          };

          var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
              if (entry.isIntersecting) {
                var id = entry.target.getAttribute('id');
                sidebarLinks.forEach(function(link) {
                  link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
              }
            });
          }, observerOptions);

          sections.forEach(function(section) {
            observer.observe(section);
          });

          // Back-to-top button
          var backToTop = document.querySelector('.back-to-top');
          if (backToTop) {
            window.addEventListener('scroll', function() {
              backToTop.classList.toggle('visible', window.scrollY > 500);
            });
            backToTop.addEventListener('click', function() {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            });
          }

          // FAQ toggle functionality
          document.querySelectorAll('.faq-question').forEach(function(question) {
            question.addEventListener('click', function() {
              var answer = document.getElementById(question.getAttribute('aria-controls'));
              if (answer) {
                var isExpanded = question.getAttribute('aria-expanded') === 'true';
                answer.classList.toggle('active');
                question.classList.toggle('active');
                question.setAttribute('aria-expanded', !isExpanded);
              }
            });
          });

          // Search functionality
          var searchInput = document.getElementById('search-input');
          var searchBtn = document.querySelector('.search-btn');
          var searchResults = document.getElementById('search-results');
          var searchableContent = [
            ...document.querySelectorAll('.section h2, .section p, .faq-question, .faq-answer div, .policy-item h3, .policy-item p, .testimonial-item p')
          ].map(function(el) {
            return {
              text: el.textContent.trim(),
              element: el,
              section: el.closest('.section')?.querySelector('h2')?.textContent || '',
              id: el.closest('.section')?.id || el.closest('.faq-item')?.querySelector('.faq-question')?.id || ''
            };
          });

          function escapeHTML(str) {
            if (!str || typeof str !== 'string') return '';
            return str.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>').replace(/"/g, '"').replace(/'/g, '');
          }

          function performSearch(query) {
            query = query.toLowerCase().trim();
            searchResults.innerHTML = '';
            if (!query) {
              searchResults.classList.remove('active');
              return;
            }

    var escapedQuery = query.replace(/[.*+?^{}()|[\]\\]/g, '\\$&'); // Escape regex special chars
            var results = searchableContent
              .filter(function(item) {
                return item.text.toLowerCase().includes(query);
              })
              .slice(0, 10); // Limit to 10 results

            if (results.length === 0) {
              var safeQuery = escapeHTML(query);
              searchResults.innerHTML =
                '<div class="no-results">' +
                '<span lang="en" class="lang-hidden">No results found for "' + safeQuery + '". Try different keywords.</span>' +
                '<span lang="hi" class="lang-visible">"' + safeQuery + '" के लिए कोई परिणाम नहीं मिला। अलग कीवर्ड आजमाएं।</span>' +
                '</div>';
              searchResults.classList.add('active');
              return;
            }

            results.forEach(function(result) {
              var highlightedText = result.text.replace(
                new RegExp(escapedQuery, 'gi'),
                '<span class="search-highlight">$&</span>'
              );
              var resultItem = document.createElement('div');
              resultItem.classList.add('search-result-item');
              resultItem.innerHTML =
                '<strong>' +
                '<span lang="en" class="lang-hidden">' + escapeHTML(result.section) + '</span>' +
                '<span lang="hi" class="lang-visible">' + escapeHTML(result.section) + '</span>' +
                '</strong>' +
                '<p>' + highlightedText.slice(0, 150) + (result.text.length > 150 ? '...' : '') + '</p>';
              resultItem.addEventListener('click', function() {
                if (result.id) {
                  window.location.hash = result.id;
                  var target = document.getElementById(result.id);
                  if (target && target.classList.contains('faq-question')) {
                    target.click();
                  }
                  target?.scrollIntoView({ behavior: 'smooth' });
                  searchResults.classList.remove('active');
                  searchInput.value = '';
                }
              });
              searchResults.appendChild(resultItem);
            });

            searchResults.classList.add('active');
          }

          if (searchInput && searchBtn && searchResults) {
            searchInput.addEventListener('input', function(e) {
              performSearch(e.target.value);
            });

            searchBtn.addEventListener('click', function() {
              performSearch(searchInput.value);
            });

            searchInput.addEventListener('keypress', function(e) {
              if (e.key === 'Enter') {
                performSearch(searchInput.value);
              }
            });
          }

          // Navbar scroll effect
          var navbar = document.querySelector('.navbar');
          if (navbar) {
            window.addEventListener('scroll', function() {
              navbar.classList.toggle('scrolled', window.scrollY > 50);
            });
          }
        </script>
      </body>
      </html>
    `;

    // Extract FAQs after htmlContent is defined
    const faqs = extractFAQs(htmlContent);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(htmlContent);
  } catch (error) {
    console.error('SSR Error:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
      </head>
      <body>
        <h1>Something went wrong</h1>
        <p>Please try again later or contact support at +91 7987235207.</p>
      </body>
      </html>
    `);
  }
});

module.exports = router;
