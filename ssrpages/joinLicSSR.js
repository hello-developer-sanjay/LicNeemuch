const express = require('express');
const compression = require('compression');
const router = express.Router();

// Enable compression middleware
router.use(compression());

// Debug middleware for HTTPS and non-www redirects
router.use((req, res, next) => {
  const host = req.get('host');
  const isHttps = req.headers['x-forwarded-proto'] === 'https' || req.secure;
  console.log(`Redirect middleware: host=${host}, isHttps=${isHttps}, url=${req.originalUrl}`);

  if (host && (host.startsWith('www.') || !isHttps)) {
    const cleanHost = host.replace(/^www\./, '');
    const redirectUrl = `https://${cleanHost}${req.originalUrl}`;
    console.log(`Redirecting to: ${redirectUrl}`);
    return res.redirect(301, redirectUrl);
  }

  res.removeHeader('X-Powered-By');
  next();
});

// Test route for debugging
router.get('/test', (req, res) => {
  console.log('Test route hit in joinLicSSR');
  res.send('joinLicSSR test route working');
});

router.get('/', (req, res) => {
  console.log(`SSR route hit for /join at ${new Date().toISOString()}`);

  try {
    const pageUrl = 'https://www.licneemuch.space/join';
    const metaTitle = 'Join LIC Neemuch: Become an LIC Agent or Officer';
    const metaDescription =
      'Join LIC Neemuch as an Agent with Jitendra Patidar. Explore qualifications, benefits & steps to start a rewarding career with LIC India.';
      const logoImage = 'https://d12uvtgcxr5qif.cloudfront.net/images/html_2025-06-12_5bc78c6a-1a4b-4908-a854-356cce5ac68f.webp';

      const metaImage = 'https://d12uvtgcxr5qif.cloudfront.net/images/react_2025-06-12_4bd13d82-4fba-4a8e-8b2f-3c4d66b9f463.webp';
          const metaKeywords =
      'Join LIC Neemuch, LIC Agent, LIC Development Officer, Jitendra Patidar, LIC career, insurance agent requirements, Neemuch jobs';

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: metaTitle,
      description: metaDescription,
      url: pageUrl,
      mainEntity: {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What are the qualifications to become an LIC Agent?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'To become an LIC Agent, you need to be at least 18 years old, have passed 10th standard (12th preferred in urban areas), and complete IRDAI training.',
            },
          },
          {
            '@type': 'Question',
            name: 'How can I become an LIC Development Officer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'To become an LIC Development Officer, you need a bachelor’s degree, pass the LIC AAO/ADO exam, and undergo training.',
            },
          },
        ],
      },
    };

    const css = `
      :root {
        --primary-color: #E63946; /* Red */
        --secondary-color: #1DE9B6; /* Teal */
        --accent-color: #F4A261; /* Orange */
        --bg-start: #0A0C14; /* Dark Blue-Black */
        --bg-end: #040506; /* Deep Black */
        --text-color: #E4ECEF; /* Off-White */
        --card-border: rgba(230, 57, 70, 0.5);
        --card-bg: rgba(4, 5, 6, 0.9);
        --shadow: 0 8px 25px rgba(0, 0, 0, 0.9);
        --glow: 0 0 12px rgba(230, 57, 70, 0.4);
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
        z-index: 1000;
        transition: var(--transition);
      }
      .navbar.scrolled {
        box-shadow: var(--shadow);
      }
      .navbar-brand {
        display: flex;
        align-items: center;
        gap: 1rem;
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
        align-items: center;
        padding: 1.2rem;
        min-height: 70vh;
        background: linear-gradient(90deg, rgba(230, 57, 70, 0.08), transparent);
        border-radius: var(--border-radius);
        margin: 1.2rem auto;
        max-width: 1200px;
      }
      .hero-content {
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
      .hero-cta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        animation: fade-in-up 0.8s ease-out 0.6s;
        animation-fill-mode: both;
      }
      .hero-image img {
        width: 100%;
        height: auto;
        max-height: 400px;
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
        background: none;
        border: 2px solid var(--accent-color);
        color: var(--accent-color);
      }
      .cta-button.secondary:hover,
      .cta-button.secondary:focus {
        background: var(--accent-color);
        color: var(--bg-end);
        box-shadow: 0 0 8px var(--accent-color);
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1.2rem;
        display: flex;
        gap: 1rem;
      }
      .sidebar {
        flex: 1;
        position: sticky;
        top: 80px;
        align-self: flex-start;
        background: var(--card-bg);
        border-radius: var(--border-radius);
        padding: 1rem;
        box-shadow: var(--shadow);
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
        color: var(--text-color);
        text-decoration: none;
        font-size: 0.95rem;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        border-radius: var(--border-radius);
        transition: var(--transition);
      }
      .sidebar-link:hover,
      .sidebar-link:focus,
      .sidebar-link.active {
        color: var(--accent-color);
        background: rgba(230, 57, 70, 0.1);
        transform: translateX(5px);
      }
      .main {
        flex: 3;
        flex-direction: column;
        display: flex;
        overflow-y: auto;
        padding-right: 0.5rem;
        scrollbar-width: thin;
        scrollbar-color: var(--primary-color) var(--bg-end);
      }
      .main::-webkit-scrollbar {
        background: var(--bg-end);
        width: 8px;
      }
      .main::-webkit-scrollbar-thumb {
        background: var(--primary-color);
        border-radius: 4px;
      }
      .main::-webkit-scrollbar-thumb:hover {
        background: var(--secondary-color);
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
        font-size: clamp(1rem, 2vw, 1.2rem);
        color: var(--accent-color);
        margin-bottom: 0.5rem;
      }
      p {
        font-size: clamp(0.85rem, 1.8vw, 0.95rem);
        margin-bottom: 0.5rem;
        color: var(--text-color);
        opacity: 0.85;
      }
      .benefits-list {
        list-style: none;
        padding-left: 1rem;
      }
      .benefits-list li {
        position: relative;
        padding-left: 1.6rem;
        margin-bottom: 0.5rem;
        color: var(--text-color);
        transition: var(--transition);
      }
      .benefits-list li:hover {
        transform: translateX(6px);
        color: var(--secondary-color);
      }
      .benefits-list li::before {
        content: '➤';
        position: absolute;
        left: 0;
        color: var(--primary-color);
        font-size: 1.1rem;
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
        background: var(--card-bg);
        position: relative;
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

@media (max-width: 1024px) {
        .hero-section {
          grid-template-columns: 1fr;
          text-align: center;
          padding: 0.8rem;
          margin-bottom: 0.8rem;
        }
        .hero-content {
          max-width: 100%;
          padding: 0.8rem;
        }
        .hero-image img {
          max-width: 100%;
          margin-top: 1rem;
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
      }
      @media (max-width: 768px) {
        .hero-title {
          font-size: clamp(1.5rem, 3vw, 2rem);
        }
        .hero-subtitle {
          font-size: clamp(0.8rem, 1.6vw, 0.9rem);
        }
        .nav-toggle {
          display: block;
        }
        .nav-menu {
          display: none;
          flex-direction: column;
          width: 100%;
          gap: 0;
          position: absolute;
          top: 100%;
          left: 0;
          background: var(--card-bg);
          padding: 0.1rem;
          box-shadow: var(--shadow);
        }
        .nav-menu.active {
          display: flex;
        }
        .nav-link {
          padding: 0.5rem;
          width: 100%;
          text-align: center;
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
        .hero-cta {
          flex-direction: column;
        }
      }
      @media (max-width: 320px) {
        .hero-title {
          font-size: clamp(1.2rem, 2.5vw, 1.5rem);
        }
        .hero-subtitle {
          font-size: clamp(0.75rem, 1.5vw, 0.8rem);
        }
        .hero-content {
          padding: 0.5rem;
        }
        .hero-image img {
          max-height: 180px;
        }
        .container {
          padding: 0.6rem;
        }
        .cta-button {
          padding: 0.3rem 0.7rem;
          font-size: 0.8rem;
        }
      }
    `;

    const htmlContent = `
      <header class="header" role="banner">
        <nav class="navbar" aria-label="Main navigation">
          <div class="navbar-brand">
            <a href="/" class="nav-logo" aria-label="LIC Neemuch Homepage">
              <img src="${logoImage}" alt="LIC Neemuch Logo" class="logo-img" width="44" height="44" loading="eager">
              <span>LIC Neemuch</span>
            </a>
            <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
              <span class="nav-toggle-icon"></span>
            </button>
          </div>
          <div class="nav-menu" id="nav-menu">
            <a href="/" class="nav-link" aria-label="Homepage">Home</a>
            <a href="/reviews" class="nav-link" aria-label="Customer Reviews">Reviews</a>
            <a href="/join" class="nav-link active" aria-current="page" aria-label="Join as LIC Agent">Join as Agent</a>
            <a href="/services" class="nav-link" aria-label="Insurance Services">Services</a>
            <a href="/about" class="nav-link" aria-label="About Us">About</a>
            <a href="/faqs" class="nav-link" aria-label="LIC FAQs">LIC FAQs</a>
            <a href="/bimasakhi" class="nav-link">Bima Sakhi Yojana</a>

          </div>
        </nav>
        <div class="hero-section" aria-labelledby="hero-title">
          <div class="hero-content">
            <h1 class="hero-title" id="hero-title" aria-label="Join LIC Neemuch as an Agent or Officer">
              <span lang="en">Join LIC Neemuch: Start Your Career</span>
              <span lang="hi" class="hidden">एलआईसी नीमच में शामिल हों: अपना करियर शुरू करें</span>
            </h1>
            <p class="hero-subtitle" lang="en">
              Become an LIC Agent or Officer with Jitendra Patidar and build a rewarding career in Neemuch, Madhya Pradesh.
            </p>
            <p class="hero-subtitle" lang="hi">
              जीतेंद्र पाटीदार के साथ एलआईसी एजेंट या अधिकारी बनें और नीमच, मध्य प्रदेश में एक पुरस्कृत करियर बनाएं।
            </p>
            <div class="hero-cta">
              <a href="tel:+917987235207" class="cta-button" aria-label="Contact Jitendra Patidar">Contact Now</a>
              <a href="#agent" class="cta-button secondary" aria-label="Apply as LIC Agent or Officer">Apply Now</a>
            </div>
          </div>
          <div class="hero-image">
            <img src="${metaImage}" alt="LIC Neemuch Career" loading="eager" width="500" height="333" onerror="this.src='https://via.placeholder.com/500x333?text=Image+Not+Found';">
          </div>
        </div>
      </header>
      <div class="container">
        <aside class="sidebar" aria-label="Section navigation">
          <button class="sidebar-toggle" aria-label="Toggle sidebar" aria-expanded="true">
            <span class="sidebar-toggle-icon">☰</span>
          </button>
          <nav class="sidebar-nav" aria-label="Section links">
            <a href="#agent" class="sidebar-link active" aria-label="LIC Agent Section">LIC Agent</a>
            <a href="#officer" class="sidebar-link" aria-label="LIC Officer Section">LIC Officer</a>
            <a href="#process" class="sidebar-link" aria-label="Application Process Section">Application Process</a>
            <a href="#benefits" class="sidebar-link" aria-label="Benefits Section">Benefits</a>
            <a href="#documents" class="sidebar-link" aria-label="Required Documents Section">Required Documents</a>
            <a href="#faq" class="sidebar-link" aria-label="FAQs Section">FAQs</a>
          </nav>
        </aside>
        <main class="main" role="main">
          <article aria-labelledby="agent-heading">
            <section class="section" id="agent" aria-labelledby="agent-heading">
              <h2 id="agent-heading">Become an LIC Agent</h2>
              <p lang="en">
                Joining LIC as an Agent offers a flexible and rewarding career. Work under the guidance of Jitendra Patidar in Neemuch to help clients secure their financial future.
              </p>
              <p lang="hi">
                एलआईसी में एजेंट के रूप में शामिल होना एक लचीला और पुरस्कृत करियर प्रदान करता है। नीमच में जीतेंद्र पाटीदार के मार्गदर्शन में काम करें और ग्राहकों को उनके वित्तीय भविष्य को सुरक्षित करने में मदद करें।
              </p>
              <h3>Qualifications</h3>
              <ul class="benefits-list">
                <li>Minimum age: 18 years</li>
                <li>Education: 10th pass (12th preferred in urban areas)</li>
                <li>Good communication skills</li>
                <li>Resident of India</li>
              </ul>
              <h3>Key Information (Kya Janna Jaruri Hai)</h3>
              <p lang="en">
                LIC Agents sell life insurance policies, earning commissions. You’ll need to complete IRDAI-mandated training (25 hours online/offline) and pass an exam.
              </p>
              <p lang="hi">
                एलआईसी एजेंट जीवन बीमा पॉलिसी बेचते हैं और कमीशन कमाते हैं। आपको IRDAI द्वारा अनिवार्य प्रशिक्षण (25 घंटे ऑनलाइन/ऑफलाइन) पूरा करना होगा और एक परीक्षा पास करनी होगी।
              </p>
            </section>
          </article>
          <article aria-labelledby="officer-heading">
            <section class="section" id="officer" aria-labelledby="officer-heading">
              <h2 id="officer-heading">Become an LIC Development Officer</h2>
              <p lang="en">
                Aspire to be like Jitendra Patidar? Become an LIC Development Officer (DO) to lead a team of agents and drive business growth in Neemuch.
              </p>
              <p lang="hi">
                जीतेंद्र पाटीदार की तरह बनने की इच्छा है? एलआईसी विकास अधिकारी (DO) बनें और नीमच में एजेंटों की टीम का नेतृत्व करें और व्यवसाय वृद्धि को बढ़ाएं।
              </p>
              <h3>Qualifications</h3>
              <ul class="benefits-list">
                <li>Bachelor’s degree from a recognized university</li>
                <li>Age: 21–35 years (relaxations for reserved categories)</li>
                <li>Strong leadership and management skills</li>
                <li>Pass LIC AAO/ADO exam</li>
              </ul>
              <h3>Key Information</h3>
              <p lang="en">
                Development Officers recruit and train agents, earning a salary plus incentives. The selection process includes a competitive exam, interview, and training.
              </p>
              <p lang="hi">
                विकास अधिकारी एजेंटों की भर्ती और प्रशिक्षण करते हैं, वेतन और प्रोत्साहन कमाते हैं। चयन प्रक्रिया में एक प्रतियोगी परीक्षा, साक्षात्कार और प्रशिक्षण शामिल है।
              </p>
            </section>
          </article>
          <article aria-labelledby="process-heading">
            <section class="section" id="process" aria-labelledby="process-heading">
              <h2 id="process-heading">Application Process</h2>
              <p lang="en">
                The process to join LIC as an Agent or Officer is straightforward but requires dedication.
              </p>
              <p lang="hi">
                एलआईसी में एजेंट या अधिकारी के रूप में शामिल होने की प्रक्रिया सरल है लेकिन इसके लिए समर्पण की आवश्यकता है।
              </p>
              <div class="card-grid">
                <div class="card">
                  <h3>LIC Agent</h3>
                  <ul class="benefits-list">
                    <li>Contact Jitendra Patidar at +91 7987235207</li>
                    <li>Submit application with documents</li>
                    <li>Complete 25-hour IRDAI training</li>
                    <li>Pass IRDAI exam</li>
                    <li>Receive agency license</li>
                  </ul>
                </div>
                <div class="card">
                  <h3>LIC Development Officer</h3>
                  <ul class="benefits-list">
                    <li>Apply for LIC AAO/ADO exam</li>
                    <li>Clear preliminary and main exams</li>
                    <li>Pass interview</li>
                    <li>Complete training program</li>
                    <li>Join as DO</li>
                  </ul>
                </div>
              </div>
            </section>
          </article>
          <article aria-labelledby="benefits-heading">
            <section class="section" id="benefits" aria-labelledby="benefits-heading">
              <h2 id="benefits-heading">Benefits of Joining LIC</h2>
              <p lang="en">
                A career with LIC offers financial rewards and personal growth. Learn why thousands choose LIC Neemuch.
              </p>
              <p lang="hi">
                एलआईसी के साथ करियर वित्तीय पुरस्कार और व्यक्तिगत विकास प्रदान करता है। जानें कि हजारों लोग एलआईसी नीमच क्यों चुनते हैं।
              </p>
              <ul class="benefits-list">
                <li>Flexible working hours (Agents)</li>
                <li>Competitive salary and incentives (Officers)</li>
                <li>Commission-based earnings (Agents)</li>
                <li>Job security and prestige</li>
                <li>Training and support from LIC</li>
              </ul>
              <p lang="en">
                Read more about Jitendra Patidar’s expertise in our <a href="https://zedemy.vercel.app/post/lic-neemuch-why-jitendra-patidar-is-the-trusted-insurance-expert" target="_blank" class="content-link" rel="noopener noreferrer">Hindi blog</a>.
              </p>
              <p lang="hi">
                जीतेंद्र पाटीदार की विशेषज्ञता के बारे में और जानें हमारे <a href="https://zedemy.vercel.app/post/lic-neemuch-why-jitendra-patidar-is-the-trusted-insurance-expert" target="_blank" class="content-link" rel="noopener">हिन्दी ब्लॉग</a> में।
              </p>
            </section>
          </article>
          <article aria-labelledby="documents-heading">
            <section class="section" id="documents" aria-labelledby="documents-heading">
              <h2 id="documents-heading">Required Documents</h2>
              <p lang="en">
                Ensure you have the following documents ready for a smooth application process.
              </p>
              <p lang="hi">
                सुचारू आवेदन प्रक्रिया के लिए निम्नलिखित दस्तावेज तैयार रखें।
              </p>
              <div class="card-grid">
                <div class="card">
                  <h3>LIC Agent</h3>
                  <ul class="benefits-list">
                    <li>Aadhaar Card</li>
                    <li>PAN Card</li>
                    <li>10th/12th Marksheet</li>
                    <li>Passport-size photographs</li>
                    <li>Bank account details</li>
                  </ul>
                </div>
                <div class="card">
                  <h3>LIC Development Officer</h3>
                  <ul class="benefits-list">
                    <li>Aadhaar Card</li>
                    <li>PAN Card</li>
                    <li>Degree Certificate</li>
                    <li>Passport-size photographs</li>
                    <li>Address proof</li>
                  </ul>
                </div>
              </div>
            </section>
          </article>
          <article aria-labelledby="faq-heading">
            <section class="section" id="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading">Frequently Asked Questions</h2>
              <div class="faq-list">
                <div class="faq-item" itemscope itemtype="https://schema.org/Question">
                  <h3 itemprop="name">What is the earning potential for an LIC Agent?</h3>
                  <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <p itemprop="text" lang="en">Earnings depend on policy sales, with commissions ranging from 5% to 35%.</p>
                    <p itemprop="text" lang="hi">कमाई पॉलिसी बिक्री पर निर्भर करती है, जिसमें कमीशन 5% से 35% तक होता है।</p>
                  </div>
                </div>
                <div class="faq-item" itemscope itemtype="https://schema.org/Question">
                  <h3 itemprop="name">Is prior experience required to become an LIC Agent?</h3>
                  <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <p itemprop="text" lang="en">No, LIC provides training. Passion and communication skills are key.</p>
                    <p itemprop="text" lang="hi">नहीं, LIC प्रशिक्षण प्रदान करता है। जुनून और संचार कौशल महत्वपूर्ण हैं।</p>
                  </div>
                </div>
                <div class="faq-item" itemscope itemtype="https://schema.org/Question">
                  <h3 itemprop="name">How long is the training for a Development Officer?</h3>
                  <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
                    <p itemprop="text" lang="en">Training typically lasts 3–6 months, including classroom and field sessions.</p>
                    <p itemprop="text" lang="hi">प्रशिक्षण आमतौर पर 3-6 महीने तक चलता है, जिसमें कक्षा और क्षेत्रीय सत्र शामिल हैं।</p>
                  </div>
                </div>
              </div>
            </section>
          </article>
          <section class="section cta-section">
            <h2>Start Your LIC Journey Today</h2>
            <p lang="en">
              Join LIC Neemuch and build a rewarding career with Jitendra Patidar. Contact us to get started!
            </p>
            <p lang="hi">
              एलआईसी नीमच में शामिल हों और जीतेंद्र पाटीदार के साथ एक पुरस्कृत करियर बनाएं। शुरू करने के लिए हमसे संपर्क करें!
            </p>
            <a href="tel:+917987235207" class="cta-button" aria-label="Get Started with LIC Career">Get Started</a>
          </section>
        </main>
      </div>
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

    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="description" content="${metaDescription}">
          <meta name="keywords" content="${metaKeywords}">
          <meta name="author" content="Jitendra Patidar">
          <meta name="robots" content="index, follow">
          <meta name="geo.region" content="IN-MP">
          <meta name="geo.placename" content="Neemuch">
          <meta name="geo.position" content="24.4716;74.8742">
          <meta name="ICBM" content="24.4716, 74.8742">
          <meta property="og:type" content="website">
          <meta property="og:title" content="${metaTitle}">
          <meta property="og:description" content="${metaDescription}">
          <meta property="og:url" content="${pageUrl}">
          <meta property="og:image" content="${metaImage}">
          <meta property="og:image:width" content="1200">
          <meta property="og:image:height" content="630">
          <meta property="og:site_name" content="LIC Neemuch">
          <meta property="og:locale" content="en_IN">
          <meta property="og:locale:alternate" content="hi_IN">
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${metaTitle}">
          <meta name="twitter:description" content="${metaDescription}">
          <meta name="twitter:image" content="${metaImage}">
          <meta name="twitter:site" content="@do_jitendrapatidar_lic">
          <title>${metaTitle}</title>
          <link rel="canonical" href="${pageUrl}">
          <link rel="icon" type="image/jpeg" href="${metaImage}" sizes="32x32">
          <link rel="apple-touch-icon" href="${metaImage}" sizes="180x180">
          <link rel="alternate" hreflang="en-IN" href="${pageUrl}">
          <link rel="alternate" hreflang="hi-IN" href="${pageUrl}/hi">
          <link rel="alternate" hreflang="x-default" href="${pageUrl}">
          <link rel="preconnect" href="https://mys3resources.s3.ap-south-1.amazonaws.com">
          <link rel="preload" href="${metaImage}" as="image">
          <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
          <style>${css}</style>
          <script>
            document.addEventListener('DOMContentLoaded', () => {
              console.log('Client-side script loaded for /join');
              const navToggle = document.querySelector('.nav-toggle');
              const navMenu = document.querySelector('.nav-menu');
              const sidebarToggle = document.querySelector('.sidebar-toggle');
              const sidebarNav = document.querySelector('.sidebar-nav');
              const links = document.querySelectorAll('a[href^="#"]');

              if (navToggle && navMenu) {
                navToggle.addEventListener('click', () => {
                  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
                  navToggle.setAttribute('aria-expanded', !expanded);
                  navMenu.classList.toggle('active');
                });
              }

              if (sidebarToggle && sidebarNav) {
                sidebarToggle.addEventListener('click', () => {
                  const expanded = sidebarToggle.getAttribute('aria-expanded') === 'true';
                  sidebarToggle.setAttribute('aria-expanded', !expanded);
                  sidebarNav.classList.toggle('active');
                  sidebarToggle.querySelector('.sidebar-toggle-icon').textContent = expanded ? '☰' : '✕';
                });
              }

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
                    if (navMenu && navMenu.classList.contains('active')) {
                      navToggle.click();
                    }
                    if (sidebarNav && sidebarNav.classList.contains('active')) {
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
                if (navbar) {
                  navbar.classList.toggle('scrolled', window.scrollY > 0);
                }
              });
            });
          </script>
        </head>
        <body>
          <div id="root">${htmlContent}</div>
        </body>
      </html>
    `;

    console.log('SSR HTML generated for /join, length:', html.length);
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(html);
    console.log('SSR Response sent for /join at', new Date().toISOString());
  } catch (error) {
    console.error('SSR Error for /join:', error.stack);
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
          .error {
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
          <div class="error">An error occurred. Please try again later.</div>
          <a href="/" aria-label="Back to Home">Home</a>
        </div>
      </body>
      </html>
    `);
  }
});

module.exports = router;