
const express = require('express');
const compression = require('compression');

const router = express.Router();

router.use(compression());

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

const stripHTML = function(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
};

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
  console.log('SSR route hit for /mahila-lic at ' + new Date().toISOString());

  try {
    const pageUrl = 'https://licneemuch.space/mahila-lic';
    const metaTitle = 'LIC Women’s Schemes 2025 – Empowering Mahila in Neemuch & India';
    const metaDescription =
      'Explore LIC’s women-centric schemes like Bima Sakhi, Aadhaar Shila, and more in Neemuch. Detailed policies, eligibility, benefits, and women’s contributions for financial empowerment.';
    const metaImage = 'https://d12uvtgcxr5qif.cloudfront.net/images/women_lic_2025.webp';
    const logoImage = 'https://d12uvtgcxr5qif.cloudfront.net/images/lic_logo.webp';
    const metaKeywords =
      'LIC women schemes, Bima Sakhi Neemuch, Aadhaar Shila, women empowerment LIC, LIC Neemuch initiatives, financial independence women, LIC policies for mahila, women insurance agents, financial literacy India, Jitendra Patidar LIC';

    const htmlContent = '<!DOCTYPE html>' +
      '<html lang="hi-IN">' +
      '<head>' +
        '<meta charset="UTF-8">' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
        '<meta name="description" content="' + escapeHTML(metaDescription) + '">' +
        '<meta name="keywords" content="' + escapeHTML(metaKeywords) + '">' +
        '<meta name="author" content="LIC Neemuch">' +
        '<meta name="robots" content="index, follow">' +
        '<meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large">' +
        '<meta property="og:title" content="' + escapeHTML(metaTitle) + '">' +
        '<meta property="og:description" content="' + escapeHTML(metaDescription) + '">' +
        '<meta property="og:image" content="' + metaImage + '">' +
        '<meta property="og:image:alt" content="Women empowerment through LIC schemes in Neemuch">' +
        '<meta property="og:url" content="' + pageUrl + '">' +
        '<meta property="og:type" content="website">' +
        '<meta property="og:locale" content="hi_IN">' +
        '<meta property="og:locale:alternate" content="en_IN">' +
        '<meta name="twitter:card" content="summary_large_image">' +
        '<meta name="twitter:title" content="' + escapeHTML(metaTitle) + '">' +
        '<meta name="twitter:description" content="' + escapeHTML(metaDescription) + '">' +
        '<meta name="twitter:image" content="' + metaImage + '">' +
        '<meta name="twitter:image:alt" content="LIC women-centric initiatives in Neemuch">' +
        '<title>' + escapeHTML(metaTitle) + '</title>' +
        '<link rel="canonical" href="' + pageUrl + '">' +
        '<link rel="icon" href="' + logoImage + '" type="image/webp">' +
        '<link rel="alternate" hreflang="hi-IN" href="' + pageUrl + '">' +
        '<link rel="alternate" hreflang="en-IN" href="' + pageUrl + '">' +
        '<link rel="sitemap" href="/sitemap.xml">' +
        '<style>' +
          ':root {' +
            '--primary-color: #E63946;' +
            '--secondary-color: #1DE9B6;' +
            '--accent-color: #F4A261;' +
            '--bg-start: #0A0C14;' +
            '--bg-end: #040506;' +
            '--text-color: #E4ECEF;' +
            '--card-border: rgba(230, 57, 70, 0.5);' +
            '--card-bg: rgba(4, 5, 6, 0.9);' +
            '--shadow: 0 8px 25px rgba(0, 0, 0, 0.9);' +
            '--glow: 0 0 12px rgba(230, 57, 70, 0.4);' +
            '--border-radius: 12px;' +
            '--transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);' +
          '}' +
          '* { box-sizing: border-box; scroll-behavior: smooth; }' +
          'body { margin: 0; font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif; background: linear-gradient(180deg, var(--bg-start), var(--bg-end)); color: var(--text-color); line-height: 1.7; overflow-x: hidden; }' +
          '.container { display: flex; max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; gap: 1.5rem; }' +
          '.header { background: var(--card-bg); border-bottom: 2px solid var(--card-border); padding: 1.5rem 0;  top: 0; z-index: 100; }' +
          '.navbar { display: flex; justify-content: space-between; align-items: center; max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }' +
          '.navbar.scrolled { background: var(--card-bg); box-shadow: var(--shadow); }' +
          '.navbar-brand { display: flex; align-items: center; gap: 0.75rem; }' +
          '.nav-logo { display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: var(--text-color); font-size: 1.75rem; font-weight: 700; }' +
          '.logo-img { width: 60px; height: 60px; object-fit: contain; }' +
          '.nav-menu { display: flex; gap: 1.5rem; list-style: none; margin: 0; padding: 0; }' +
          '.nav-link { color: var(--text-color); text-decoration: none; padding: 0.75rem 1.25rem; border-radius: 6px; transition: var(--transition); }' +
          '.nav-link:hover, .nav-link:focus { color: var(--accent-color); background: rgba(244, 162, 97, 0.15); transform: translateY(-2px); }' +
          '.nav-link.active { color: var(--primary-color); border-bottom: 3px solid var(--primary-color); }' +
          '.nav-toggle { display: none; background: none; border: none; color: var(--text-color); font-size: 1.75rem; cursor: pointer; }' +
          '.hero-section { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; padding: 4rem 1.5rem; align-items: center; background: rgba(255, 255, 255, 0.05); border-radius: var(--border-radius); }' +
          '.hero-content { display: flex; flex-direction: column; gap: 1.5rem; }' +
          '.hero-title { font-size: clamp(2rem, 5vw, 3rem); color: var(--secondary-color); margin: 0; animation: fadeIn 1s ease-in-out; }' +
          '.hero-subtitle { font-size: clamp(1.1rem, 2.5vw, 1.3rem); opacity: 0.9; }' +
          '.hero-cta { display: flex; gap: 1.5rem; flex-wrap: wrap; }' +
          '.cta-button { padding: 1rem 2rem; background: var(--primary-color); color: var(--bg-end); text-decoration: none; border-radius: var(--border-radius); transition: var(--transition); font-weight: 600; box-shadow: var(--glow); }' +
          '.cta-button.secondary { background: transparent; border: 2px solid var(--secondary-color); color: var(--secondary-color); }' +
          '.cta-button:hover, .cta-button:focus { transform: translateY(-3px); box-shadow: 0 0 15px var(--secondary-color); }' +
          '.hero-image img { width: 100%; height: auto; border-radius: var(--border-radius); box-shadow: var(--shadow); object-fit: cover; aspect-ratio: 3/2; }' +
          '.lang-toggle { display: flex; gap: 0.75rem; margin-top: 1.5rem; }' +
          '.lang-btn { padding: 0.6rem 1.2rem; background: var(--card-bg); color: var(--text-color); border: 1px solid var(--card-border); border-radius: 6px; cursor: pointer; transition: var(--transition); }' +
          '.lang-btn.active { background: var(--primary-color); color: var(--bg-end); }' +
          '.lang-btn:hover, .lang-btn:focus { background: var(--accent-color); color: var(--bg-end); }' +
          '[lang="en"].lang-hidden, [lang="hi"].lang-hidden { display: none; }' +
          '[lang="en"].lang-visible, [lang="hi"].lang-visible { display: block; }' +
          '.sidebar { width: 280px; flex-shrink: 0; background: var(--card-bg); border-radius: 10px; padding: 1.5rem; position: sticky; top: 140px; height: fit-content; box-shadow: var(--shadow); }' +
          '.sidebar-nav { display: flex; flex-direction: column; gap: 0.75rem; }' +
          '.sidebar-link { color: var(--text-color); text-decoration: none; padding: 0.75rem 1rem; border-radius: 6px; transition: var(--transition); }' +
          '.sidebar-link:hover, .sidebar-link:focus { background: rgba(244, 162, 97, 0.15); color: var(--accent-color); transform: translateX(5px); }' +
          '.sidebar-link.active { background: var(--primary-color); color: var(--bg-end); }' +
          '.sidebar-toggle { display: none; background: var(--primary-color); color: var(--bg-end); border: none; padding: 0.75rem; border-radius: 6px; cursor: pointer; margin-bottom: 1.5rem; }' +
          '.main-content { flex: 1; padding: 2.5rem 0; }' +
          '.section { margin-bottom: 4rem; background: var(--card-bg); padding: 2.5rem; border-radius: 14px; box-shadow: var(--shadow); border: 1px solid var(--card-border); animation: slideUp 0.5s ease-out; }' +
          '.section h2 { font-size: clamp(1.8rem, 3.5vw, 2.2rem); color: var(--secondary-color); margin-bottom: 1.5rem; }' +
          '.faq-list { display: flex; flex-direction: column; gap: 1.5rem; }' +
          '.faq-item { background: rgba(255, 255, 255, 0.05); padding: 1.5rem; border-radius: 10px; transition: var(--transition); }' +
          '.faq-question { font-size: 1.2rem; color: var(--accent-color); cursor: pointer; margin: 0; }' +
          '.faq-answer { display: none; margin-top: 1.5rem; }' +
          '.faq-answer.active { display: block; animation: fadeIn 0.3s ease-in; }' +
          '.faq-question.active { color: var(--primary-color); }' +
          '.search-bar { display: flex; gap: 0.75rem; margin-bottom: 2.5rem; }' +
          '#search-input { flex: 1; padding: 1rem; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 6px; color: var(--text-color); font-size: 1.1rem; }' +
          '.search-btn { padding: 1rem; background: var(--primary-color); color: var(--bg-end); border: none; border-radius: 6px; cursor: pointer; transition: var(--transition); }' +
          '.search-btn:hover, .search-btn:focus { background: var(--accent-color); transform: scale(1.05); }' +
          '.search-results { display: none; margin-top: 1.5rem; padding: 1.5rem; background: var(--card-bg); border-radius: 10px; border: 1px solid var(--card-border); }' +
          '.search-results.active { display: block; }' +
          '.search-result-item { padding: 0.75rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); cursor: pointer; transition: var(--transition); }' +
          '.search-result-item:hover { background: rgba(244, 162, 97, 0.15); }' +
          '.search-highlight { background: var(--secondary-color); color: var(--bg-end); padding: 0.3rem; border-radius: 4px; }' +
          '.no-results { color: #999; font-style: italic; }' +
          '.back-to-top { position: fixed; bottom: 3rem; right: 3rem; background: var(--primary-color); color: var(--bg-end); border: none; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0; transition: var(--transition); z-index: 50; }' +
          '.back-to-top.visible { opacity: 1; }' +
          '.sticky-cta { position: fixed; bottom: 0; left: 0; right: 0; background: var(--primary-color); color: var(--bg-end); text-align: center; padding: 1rem; z-index: 100; display: none; }' +
          '.sticky-cta.active { display: block; animation: slideUp 0.5s ease-out; }' +
          '.sticky-cta a { color: var(--bg-end); text-decoration: none; font-weight: 600; }' +
          'footer { position: relative; padding: 4rem 2rem 2rem; background: linear-gradient(180deg, var(--bg-start), var(--bg-end)); color: var(--text-color); font-size: 1rem; overflow: hidden; border-top: 4px solid var(--primary-color); box-shadow: inset 0 4px 20px rgba(230, 57, 70, 0.2); }' +
          '.footer-wave { position: absolute; top: 0; left: 0; width: 100%; height: 60px; background: url("data:image/svg+xml;utf8,<svg viewBox=\"0 0 1200 120\" preserveAspectRatio=\"none\"><path d=\"M0,0V46c150,36,350,18,600,46s450,28,600,0V0H0Z\" fill=\"rgba(230,57,70,0.3)\"/></svg>") no-repeat; background-size: cover; opacity: 0.5; }' +
          '.footer-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 2.5rem; max-width: 1280px; margin: 0 auto; padding: 1.5rem; backdrop-filter: blur(10px); background: rgba(4, 5, 6, 0.7); border-radius: var(--border-radius); box-shadow: var(--shadow); }' +
          '.footer-section { display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem; transition: var(--transition); }' +
          '.footer-section:hover { transform: translateY(-5px); }' +
          '.footer-heading { font-size: clamp(1.2rem, 2.5vw, 1.4rem); color: var(--secondary-color); margin-bottom: 1rem; position: relative; text-transform: uppercase; letter-spacing: 1.2px; }' +
          '.footer-heading::after { content: ""; position: absolute; bottom: -5px; left: 0; width: 40px; height: 3px; background: var(--accent-color); transition: width 0.4s ease; }' +
          '.footer-section:hover .footer-heading::after { width: 80px; }' +
          '.footer-links { display: flex; flex-direction: column; gap: 0.75rem; list-style: none; padding: 0; }' +
          '.footer-link { color: var(--text-color); text-decoration: none; font-size: 0.95rem; padding: 0.4rem 0.75rem; border-radius: 6px; transition: var(--transition); position: relative; overflow: hidden; }' +
          '.footer-link::before { content: ""; position: absolute; bottom: 0; left: 0; width: 0; height: 1.5px; background: var(--accent-color); transition: width 0.4s ease; }' +
          '.footer-link:hover::before, .footer-link:focus::before { width: 100%; }' +
          '.footer-link:hover, .footer-link:focus { color: var(--accent-color); transform: translateX(7px); background: rgba(244, 162, 97, 0.15); }' +
          '.footer-gift { margin-top: 1.5rem; text-align: center; }' +
          '.gift-button { display: inline-flex; align-items: center; gap: 0.75rem; padding: 0.8rem 1.5rem; background: linear-gradient(45deg, var(--primary-color), var(--secondary-color)); color: var(--bg-end); text-decoration: none; font-weight: 600; font-size: 1rem; border-radius: 24px; transition: var(--transition); box-shadow: var(--glow); animation: pulse 2.5s infinite ease-in-out; }' +
          '@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }' +
          '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }' +
          '@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }' +
          '.gift-button:hover, .gift-button:focus { transform: scale(1.1); box-shadow: 0 0 20px var(--secondary-color); background: linear-gradient(45deg, var(--secondary-color), var(--primary-color)); }' +
          '.developer-message p { font-style: italic; font-size: 0.9rem; opacity: 0.9; line-height: 1.6; border-left: 3px solid var(--primary-color); padding-left: 1rem; }' +
          '.footer-bottom { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.15); font-size: 0.9rem; opacity: 0.85; text-align: center; }' +
          '.footer-bottom p { margin-bottom: 0.75rem; }' +
          '.content-link { color: var(--secondary-color); text-decoration: none; transition: var(--transition); }' +
          '.content-link:hover, .content-link:focus { color: var(--accent-color); text-decoration: underline; }' +
          '.policy-item, .testimonial-item { margin-bottom: 2rem; padding: 1.5rem; background: rgba(255, 255, 255, 0.05); border-radius: 10px; }' +
          '.testimonial-item blockquote { margin: 0; padding-left: 1.5rem; border-left: 4px solid var(--primary-color); }' +
          '.testimonial-item cite { display: block; margin-top: 0.75rem; font-style: italic; opacity: 0.8; }' +
          '@media (max-width: 768px) {' +
            '.container { flex-direction: column; }' +
            '.hero-section { grid-template-columns: 1fr; text-align: center; }' +
            '.hero-image { order: 2; }' +
            '.nav-menu { display: none; flex-direction: column; position: absolute; top: 80px; left: 0; right: 0; background: var(--card-bg); padding: 1.5rem; box-shadow: var(--shadow); }' +
            '.nav-menu.active { display: flex; }' +
            '.nav-toggle { display: block; }' +
            '.sidebar { width: 100%; position: static; }' +
            '.sidebar-toggle { display: block; }' +
            '.sidebar-nav { display: none; }' +
            '.sidebar-nav.active { display: flex; }' +
            '.footer-content { grid-template-columns: 1fr; text-align: center; }' +
            '.footer-section { padding: 1rem; }' +
            '.footer-heading::after { margin: 0 auto; }' +
            '.footer-links { align-items: center; }' +
            '.footer-link:hover, .footer-link:focus { transform: none; }' +
            '.gift-button { font-size: 0.9rem; padding: 0.6rem 1.2rem; }' +
            '.developer-message p { text-align: left; }' +
            '.sticky-cta { display: block; }' +
          '}' +
          '@media (max-width: 320px) {' +
            '.hero-title { font-size: 1.6rem; }' +
            '.cta-button { padding: 0.6rem 1.2rem; font-size: 0.95rem; }' +
            '.footer-heading { font-size: clamp(1.1rem, 2.2vw, 1.2rem); }' +
            '.footer-link, .gift-button { font-size: 0.85rem; }' +
          '}' +
        '</style>' +
      '</head>' +
      '<body>' +
        '<header class="header" role="banner">' +
          '<nav class="navbar" aria-label="Main navigation">' +
            '<div class="navbar-brand">' +
              '<a href="/" class="nav-logo" aria-label="LIC Neemuch Home">' +
                '<img src="' + logoImage + '" alt="LIC Neemuch Logo" class="logo-img" width="60" height="60" loading="lazy">' +
                '<span lang="en" class="lang-hidden">LIC Neemuch</span>' +
                '<span lang="hi" class="lang-visible">एलआईसी नीमच</span>' +
              '</a>' +
              '<button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button>' +
            '</div>' +
            '<ul class="nav-menu" id="nav-menu">' +
              '<li><a href="/home" class="nav-link">Home</a></li>' +
              '<li><a href="/reviews" class="nav-link">Reviews</a></li>' +
              '<li><a href="/join" class="nav-link">Join as Agent</a></li>' +
              '<li><a href="/services" class="nav-link">Services</a></li>' +
              '<li><a href="/about" class="nav-link">About</a></li>' +
              '<li><a href="/faqs" class="nav-link">FAQs</a></li>' +
              '<li><a href="/bimasakhi" class="nav-link">Bima Sakhi</a></li>' +
              '<li><a href="/mahila-lic" class="nav-link active" aria-current="page">Women’s Schemes</a></li>' +
            '</ul>' +
          '</nav>' +
          '<div class="hero-section">' +
            '<div class="hero-content">' +
              '<h1 class="hero-title">' +
                '<span lang="en" class="lang-hidden">LIC Women’s Schemes 2025: Empowering Mahila in Neemuch</span>' +
                '<span lang="hi" class="lang-visible">एलआईसी महिलाओं की योजनाएं 2025: नीमच में महिलाओं को सशक्त करना</span>' +
              '</h1>' +
              '<p class="hero-subtitle">' +
                '<span lang="en" class="lang-hidden"><em>Discover LIC’s women-centric initiatives</em> like Bima Sakhi, Aadhaar Shila, and more, designed to empower women in Neemuch and across India. Learn about policies, contributions, and financial independence opportunities. Contact Jitendra Patidar at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> or <a href="/join" class="content-link">apply online</a>.</span>' +
                '<span lang="hi" class="lang-visible"><em>एलआईसी की महिलाकेंद्रित योजनाओं की खोज करें</em> जैसे बीमा सखी, आधार शिला, और अन्य, जो नीमच और पूरे भारत में महिलाओं को सशक्त करने के लिए डिज़ाइन की गई हैं। नीतियों, योगदान, और वित्तीय स्वतंत्रता के अवसरों के बारे में जानें। जितेंद्र पाटीदार से <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें या <a href="/join" class="content-link">ऑनलाइन आवेदन करें</a>।</span>' +
              '</p>' +
              '<div class="hero-cta">' +
                '<a href="tel:+917987235207" class="cta-button">' +
                  '<span lang="en" class="lang-hidden">Contact Now</span>' +
                  '<span lang="hi" class="lang-visible">अब संपर्क करें</span>' +
                '</a>' +
                '<a href="/join" class="cta-button secondary">' +
                  '<span lang="en" class="lang-hidden">Apply Online</span>' +
                  '<span lang="hi" class="lang-visible">ऑनलाइन आवेदन</span>' +
                '</a>' +
                '<a href="https://wa.me/917987235207" target="_blank" rel="noopener noreferrer" class="cta-button secondary">' +
                  '<span lang="en" class="lang-hidden">WhatsApp Us</span>' +
                  '<span lang="hi" class="lang-visible">व्हाट्सएप करें</span>' +
                '</a>' +
              '</div>' +
              '<div class="lang-toggle">' +
                '<button class="lang-btn" data-lang="en" aria-label="Switch to English">English</button>' +
                '<button class="lang-btn active" data-lang="hi" aria-label="Switch to Hindi">हिन्दी</button>' +
              '</div>' +
            '</div>' +
            '<div class="hero-image">' +
              '<img src="' + metaImage + '" alt="Empowered women through LIC schemes in Neemuch, Madhya Pradesh" width="600" height="400" loading="lazy">' +
            '</div>' +
          '</div>' +
        '</header>' +
        '<div class="container">' +
          '<aside class="sidebar" role="complementary">' +
            '<button class="sidebar-toggle" aria-label="Toggle sidebar" aria-expanded="false">☰</button>' +
            '<nav class="sidebar-nav" aria-label="Sidebar navigation">' +
              '<a href="#overview" class="sidebar-link">Overview</a>' +
              '<a href="#bima-sakhi" class="sidebar-link">Bima Sakhi Yojana</a>' +
              '<a href="#aadhaar-shila" class="sidebar-link">Aadhaar Shila</a>' +
              '<a href="#new-jeevan-anand" class="sidebar-link">New Jeevan Anand</a>' +
              '<a href="#bima-jyoti" class="sidebar-link">Bima Jyoti</a>' +
              '<a href="#neemuch-initiatives" class="sidebar-link">Neemuch Initiatives</a>' +
              '<a href="#women-agents" class="sidebar-link">Women as Agents</a>' +
              '<a href="#women-policyholders" class="sidebar-link">Women Policyholders</a>' +
              '<a href="#community-impact" class="sidebar-link">Community Impact</a>' +
              '<a href="#demographics" class="sidebar-link">Demographics</a>' +
              '<a href="#testimonials" class="sidebar-link">Testimonials</a>' +
              '<a href="#faqs" class="sidebar-link">FAQs</a>' +
              '<a href="#contact" class="sidebar-link">Contact</a>' +
            '</nav>' +
          '</aside>' +
          '<main class="main-content" role="main">' +
            '<div class="search-bar">' +
              '<input type="search" id="search-input" placeholder="Search women’s schemes, policies, or contributions" aria-label="Search women’s LIC content">' +
              '<button class="search-btn" aria-label="Search">🔍</button>' +
            '</div>' +
            '<div class="search-results" id="search-results"></div>' +
            '<button class="back-to-top" aria-label="Back to Top">↑</button>' +
            '<article>' +
              '<section class="section" id="overview">' +
                '<h2>' +
                  '<span lang="en" class="lang-hidden">Overview of LIC Women’s Schemes</span>' +
                  '<span lang="hi" class="lang-visible">एलआईसी महिलाओं की योजनाओं का अवलोकन</span>' +
                '</h2>' +
                '<p>' +
                  '<span lang="en" class="lang-hidden">LIC India empowers women through tailored insurance schemes, training programs like <a href="/bimasakhi" class="content-link">Bima Sakhi</a>, and community initiatives, fostering financial independence and literacy.</span>' +
                  '<span lang="hi" class="lang-visible">एलआईसी इंडिया महिलाओं को विशेष बीमा योजनाओं, <a href="/bimasakhi" class="content-link">बीमा सखी</a> जैसे प्रशिक्षण कार्यक्रमों, और सामुदायिक पहलों के माध्यम से सशक्त करती है, वित्तीय स्वतंत्रता और साक्षरता को बढ़ावा देती है।</span>' +
                '</p>' +
                '<ul>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Policies</strong>: Aadhaar Shila, Bima Jyoti, and more for women’s security.</span><span lang="hi" class="lang-visible"><strong>नीतियां</strong>: आधार शिला, बीमा ज्योति, और महिलाओं की सुरक्षा के लिए अन्य।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Initiatives</strong>: Bima Sakhi trains 100,000 women annually.</span><span lang="hi" class="lang-visible"><strong>पहल</strong>: बीमा सखी प्रतिवर्ष 100,000 महिलाओं को प्रशिक्षित करती है।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Impact</strong>: Over 20 crore women insured nationwide.</span><span lang="hi" class="lang-visible"><strong>प्रभाव</strong>: देशभर में 20 करोड़ से अधिक महिलाएं बीमित।</span></li>' +
                '</ul>' +
              '</section>' +
              '<section class="section" id="bima-sakhi">' +
                '<h2>' +
                  '<span lang="en" class="lang-hidden">LIC Bima Sakhi Yojana</span>' +
                  '<span lang="hi" class="lang-visible">एलआईसी बीमा सखी योजना</span>' +
                '</h2>' +
                '<p>' +
                  '<span lang="en" class="lang-hidden">Launched on December 9, 2024, by PM Narendra Modi, Bima Sakhi empowers women aged 18–70 to become LIC agents, promoting financial literacy in rural areas like Neemuch.</span>' +
                  '<span lang="hi" class="lang-visible">9 दिसंबर 2024 को पीएम नरेंद्र मोदी द्वारा शुरू की गई, बीमा सखी 18–70 वर्ष की महिलाओं को नीमच जैसे ग्रामीण क्षेत्रों में वित्तीय साक्षरता को बढ़ावा देने के लिए एलआईसी एजेंट बनने के लिए सशक्त करती है।</span>' +
                '</p>' +
                '<ul>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Eligibility</strong>: 10th pass, rural women, no LIC agent/employee relatives.</span><span lang="hi" class="lang-visible"><strong>पात्रता</strong>: 10वीं पास, ग्रामीण महिलाएं, कोई एलआईसी एजेंट/कर्मचारी रिश्तेदार नहीं।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Stipend</strong>: ₹7,000/month (Year 1), ₹6,000/month (Year 2), ₹5,000/month (Year 3).</span><span lang="hi" class="lang-visible"><strong>वजीफा</strong>: ₹7,000/माह (पहला वर्ष), ₹6,000/माह (दूसरा वर्ष), ₹5,000/माह (तीसरा वर्ष)।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Commissions</strong>: Up to ₹48,000/year, plus bonuses.</span><span lang="hi" class="lang-visible"><strong>कमीशन</strong>: ₹48,000/वर्ष तक, साथ में बोनस।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Application Fee</strong>: ₹650 (₹150 LIC, ₹500 IRDAI exam).</span><span lang="hi" class="lang-visible"><strong>आवेदन शुल्क</strong>: ₹650 (₹150 एलआईसी, ₹500 IRDAI परीक्षा)।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Training</strong>: 3-year program on insurance products and sales.</span><span lang="hi" class="lang-visible"><strong>प्रशिक्षण</strong>: बीमा उत्पादों और बिक्री पर 3-वर्षीय कार्यक्रम।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Career Path</strong>: Graduate Bima Sakhis can become Development Officers.</span><span lang="hi" class="lang-visible"><strong>करियर पथ</strong>: स्नातक बीमा सखी विकास अधिकारी बन सकती हैं।</span></li>' +
                '</ul>' +
              '</section>' +
              '<section class="section" id="aadhaar-shila">' +
                '<h2>' +
                  '<span lang="en" class="lang-hidden">LIC Aadhaar Shila Plan</span>' +
                  '<span lang="hi" class="lang-visible">एलआईसी आधार शिला योजना</span>' +
                '</h2>' +
                '<p>' +
                  '<span lang="en" class="lang-hidden">A women-exclusive savings-cum-protection plan offering high returns and life cover for financial security.</span>' +
                  '<span lang="hi" class="lang-visible">महिलाओं के लिए विशेष बचत-सह-संरक्षण योजना जो उच्च रिटर्न और वित्तीय सुरक्षा के लिए जीवन कवर प्रदान करती है।</span>' +
                '</p>' +
                '<ul>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Eligibility</strong>: Women aged 8–55, Aadhaar-linked.</span><span lang="hi" class="lang-visible"><strong>पात्रता</strong>: 8–55 वर्ष की महिलाएं, आधार से जुड़ा हुआ।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Cover</strong>: Up to ₹11 lakh.</span><span lang="hi" class="lang-visible"><strong>कवर</strong>: ₹11 लाख तक।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Premium</strong>: Starting at ₹29/day for ₹2 lakh cover.</span><span lang="hi" class="lang-visible"><strong>प्रीमियम</strong>: ₹2 लाख कवर के लिए ₹29/दिन से शुरू।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Maturity Benefit</strong>: Sum assured + loyalty additions.</span><span lang="hi" class="lang-visible"><strong>परिपक्वता लाभ</strong>: बीमित राशि + वफादारी जोड़।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Death Benefit</strong>: 10x annualized premium or sum assured.</span><span lang="hi" class="lang-visible"><strong>मृत्यु लाभ</strong>: 10 गुना वार्षिक प्रीमियम या बीमित राशि।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Term</strong>: 10–20 years.</span><span lang="hi" class="lang-visible"><strong>अवधि</strong>: 10–20 वर्ष।</span></li>' +
                '</ul>' +
              '</section>' +
              '<section class="section" id="new-jeevan-anand">' +
                '<h2>' +
                  '<span lang="en" class="lang-hidden">LIC New Jeevan Anand</span>' +
                  '<span lang="hi" class="lang-visible">एलआईसी न्यू जीवन आनंद</span>' +
                '</h2>' +
                '<p>' +
                  '<span lang="en" class="lang-hidden">A whole-life plan combining savings and lifelong coverage, ideal for women seeking long-term security.</span>' +
                  '<span lang="hi" class="lang-visible">बचत और आजीवन कवरेज को जोड़ने वाली एक संपूर्ण जीवन योजना, दीर्घकालिक सुरक्षा चाहने वाली महिलाओं के लिए आदर्श।</span>' +
                '</p>' +
                '<ul>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Eligibility</strong>: Women aged 18–50.</span><span lang="hi" class="lang-visible"><strong>पात्रता</strong>: 18–50 वर्ष की महिलाएं।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Cover</strong>: Up to ₹50 lakh.</span><span lang="hi" class="lang-visible"><strong>कवर</strong>: ₹50 लाख तक।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Premium</strong>: ₹3,000/month for ₹5 lakh cover (indicative).</span><span lang="hi" class="lang-visible"><strong>प्रीमियम</strong>: ₹5 लाख कवर के लिए ₹3,000/माह (संकेतक)।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Maturity Benefit</strong>: Sum assured + bonuses.</span><span lang="hi" class="lang-visible"><strong>परिपक्वता लाभ</strong>: बीमित राशि + बोनस।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Death Benefit</strong>: Sum assured + accrued bonuses till death.</span><span lang="hi" class="lang-visible"><strong>मृत्यु लाभ</strong>: बीमित राशि + मृत्यु तक जमा बोनस।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Term</strong>: 15–35 years, coverage till age 100.</span><span lang="hi" class="lang-visible"><strong>अवधि</strong>: 15–35 वर्ष, 100 वर्ष की आयु तक कवरेज।</span></li>' +
                '</ul>' +
              '</section>' +
              '<section class="section" id="bima-jyoti">' +
                '<h2>' +
                  '<span lang="en" class="lang-hidden">LIC Bima Jyoti</span>' +
                  '<span lang="hi" class="lang-visible">एलआईसी बीमा ज्योति</span>' +
                '</h2>' +
                '<p>' +
                  '<span lang="en" class="lang-hidden">A non-linked savings plan with guaranteed additions, suitable for women planning for future goals.</span>' +
                  '<span lang="hi" class="lang-visible">गारंटीकृत जोड़ के साथ एक गैर-लिंक्ड बचत योजना, भविष्य के लक्ष्यों की योजना बनाने वाली महिलाओं के लिए उपयुक्त।</span>' +
                '</p>' +
                '<ul>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Eligibility</strong>: Women aged 90 days–60 years.</span><span lang="hi" class="lang-visible"><strong>पात्रता</strong>: 90 दिन–60 वर्ष की महिलाएं।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Cover</strong>: Up to ₹10 lakh.</span><span lang="hi" class="lang-visible"><strong>कवर</strong>: ₹10 लाख तक।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Premium</strong>: ₹1,000/month for ₹1 lakh cover (indicative).</span><span lang="hi" class="lang-visible"><strong>प्रीमियम</strong>: ₹1 लाख कवर के लिए ₹1,000/माह (संकेतक)।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Guaranteed Additions</strong>: ₹50 per ₹1,000 sum assured annually.</span><span lang="hi" class="lang-visible"><strong>गारंटीकृत जोड़</strong>: प्रति ₹1,000 बीमित राशि पर ₹50 वार्षिक।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Maturity Benefit</strong>: Sum assured + guaranteed additions.</span><span lang="hi" class="lang-visible"><strong>परिपक्वता लाभ</strong>: बीमित राशि + गारंटीकृत जोड़।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Term</strong>: 15–20 years.</span><span lang="hi" class="lang-visible"><strong>अवधि</strong>: 15–20 वर्ष।</span></li>' +
                '</ul>' +
              '</section>' +
              '<section class="section" id="neemuch-initiatives">' +
                '<h2>' +
                  '<span lang="en" class="lang-hidden">LIC Neemuch Women Initiatives</span>' +
                  '<span lang="hi" class="lang-visible">एलआईसी नीमच महिलाओं की पहल</span>' +
                '</h2>' +
                '<p>' +
                  '<span lang="en" class="lang-hidden">Beyond Bima Sakhi, LIC Neemuch runs targeted programs to empower women in rural Madhya Pradesh.</span>' +
                  '<span lang="hi" class="lang-visible">बीमा सखी के अलावा, एलआईसी नीमच ग्रामीण मध्य प्रदेश में महिलाओं को सशक्त करने के लिए लक्षित कार्यक्रम चलाती है।</span>' +
                '</p>' +
                '<ul>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Financial Literacy Camps</strong>: Monthly workshops in Neemuch, Mandsaur, and Ratlam, educating 5,000+ women annually.</span><span lang="hi" class="lang-visible"><strong>वित्तीय साक्षरता शिविर</strong>: नीमच, मंदसौर, और रतलाम में मासिक कार्यशालाएं, प्रतिवर्ष 5,000+ महिलाओं को शिक्षित करती हैं।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Women SHG Partnerships</strong>: Collaborates with 50+ Self-Help Groups to promote <a href="/services" class="content-link">insurance products</a>.</span><span lang="hi" class="lang-visible"><strong>महिला स्वयं सहायता समूह साझेदारी</strong>: 50+ स्वयं सहायता समूहों के साथ <a href="/services" class="content-link">बीमा उत्पादों</a> को बढ़ावा देने के लिए सहयोग।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Micro-Insurance Drives</strong>: Targets low-income women with affordable plans like Aadhaar Shila.</span><span lang="hi" class="lang-visible"><strong>माइक्रो-बीमा अभियान</strong>: आधार शिला जैसे किफायती योजनाओं के साथ कम आय वाली महिलाओं को लक्षित करता है।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Agent Recruitment Fairs</strong>: Annual events in Neemuch to onboard women agents, 200+ recruited in 2024.</span><span lang="hi" class="lang-visible"><strong>एजेंट भर्ती मेला</strong>: नीमच में वार्षिक आयोजन, 2024 में 200+ महिला एजेंट भर्ती।</span></li>' +
                '</ul>' +
              '</section>' +
              '<section class="section" id="women-agents">' +
                '<h2>' +
                  '<span lang="en" class="lang-hidden">Women as LIC Agents</span>' +
                  '<span lang="hi" class="lang-visible">महिलाएं एलआईसी एजेंट के रूप में</span>' +
                '</h2>' +
                '<p>' +
                  '<span lang="en" class="lang-hidden">Women agents are pivotal to LIC’s mission, driving insurance penetration and financial awareness.</span>' +
                  '<span lang="hi" class="lang-visible">महिला एजेंट एलआईसी के मिशन के लिए महत्वपूर्ण हैं, बीमा प्रवेश और वित्तीय जागरूकता को बढ़ावा देती हैं।</span>' +
                '</p>' +
                '<ul>' +
                  '<li><span lang="en" class="lang-hidden"><strong>National Stats</strong>: 30% of LIC’s 13 lakh agents are women (3.9 lakh).</span><span lang="hi" class="lang-visible"><strong>राष्ट्रीय आंकड़े</strong>: एलआईसी के 13 लाख एजेंटों में 30% महिलाएं (3.9 लाख)।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Neemuch</strong>: 500+ women agents, contributing ₹2 crore in premiums annually.</span><span lang="hi" class="lang-visible"><strong>नीमच</strong>: 500+ महिला एजेंट, प्रतिवर्ष ₹2 करोड़ प्रीमियम में योगदान।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Training</strong>: Specialized programs enhance sales and leadership skills.</span><span lang="hi" class="lang-visible"><strong>प्रशिक्षण</strong>: विशेष कार्यक्रम बिक्री और नेतृत्व कौशल को बढ़ाते हैं।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Impact</strong>: Women agents increase trust, especially among female clients.</span><span lang="hi" class="lang-visible"><strong>प्रभाव</strong>: महिला एजेंट विशेष रूप से महिला ग्राहकों के बीच विश्वास बढ़ाती हैं।</span></li>' +
                '</ul>' +
              '</section>' +
              '<section class="section" id="women-policyholders">' +
                '<h2>' +
                  '<span lang="en" class="lang-hidden">Women as Policyholders</span>' +
                  '<span lang="hi" class="lang-visible">महिलाएं पॉलिसीधारक के रूप में</span>' +
                '</h2>' +
                '<p>' +
                  '<span lang="en" class="lang-hidden">Women policyholders leverage LIC plans for savings, security, and legacy-building.</span>' +
                  '<span lang="hi" class="lang-visible">महिला पॉलिसीधारक बचत, सुरक्षा, और विरासत निर्माण के लिए एलआईसी योजनाओं का लाभ उठाती हैं।</span>' +
                '</p>' +
                '<ul>' +
                  '<li><span lang="en" class="lang-hidden"><strong>National Stats</strong>: 40% of LIC’s 28 crore policyholders are women (11.2 crore).</span><span lang="hi" class="lang-visible"><strong>राष्ट्रीय आंकड़े</strong>: एलआईसी के 28 करोड़ पॉलिसीधारकों में 40% महिलाएं (11.2 करोड़)।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Neemuch</strong>: 10,000+ women policyholders, 60% in rural areas.</span><span lang="hi" class="lang-visible"><strong>नीमच</strong>: 10,000+ महिला पॉलिसीधारक, 60% ग्रामीण क्षेत्रों में।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Popular Plans</strong>: Aadhaar Shila (50%), New Jeevan Anand (30%).</span><span lang="hi" class="lang-visible"><strong>लोकप्रिय योजनाएं</strong>: आधार शिला (50%), न्यू जीवन आनंद (30%)।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Benefits</strong>: Tax savings, wealth creation, family protection.</span><span lang="hi" class="lang-visible"><strong>लाभ</strong>: कर बचत, धन सृजन, परिवार संरक्षण।</span></li>' +
                '</ul>' +
              '</section>' +
              '<section class="section" id="community-impact">' +
                '<h2>' +
                  '<span lang="en" class="lang-hidden">Community Impact of Women in LIC</span>' +
                  '<span lang="hi" class="lang-visible">एलआईसी में महिलाओं का सामुदायिक प्रभाव</span>' +
                '</h2>' +
                '<p>' +
                  '<span lang="en" class="lang-hidden">Women in LIC drive social change through financial inclusion and literacy.</span>' +
                  '<span lang="hi" class="lang-visible">एलआईसी में महिलाएं वित्तीय समावेशन और साक्षरता के माध्यम से सामाजिक परिवर्तन लाती हैं।</span>' +
                '</p>' +
                '<ul>' +
                  '<li><span lang="en" class="lang-hidden"><strong>National Impact</strong>: Women agents educate 50 lakh households annually.</span><span lang="hi" class="lang-visible"><strong>राष्ट्रीय प्रभाव</strong>: महिला एजेंट प्रतिवर्ष 50 लाख परिवारों को शिक्षित करती हैं।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Neemuch</strong>: 2,000+ households insured by women agents in 2024.</span><span lang="hi" class="lang-visible"><strong>नीमच</strong>: 2024 में महिला एजेंटों द्वारा 2,000+ परिवार बीमित।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Economic Boost</strong>: ₹5 crore in premiums from women-driven policies in Neemuch.</span><span lang="hi" class="lang-visible"><strong>आर्थिक प्रोत्साहन</strong>: नीमच में महिला-प्रेरित नीतियों से ₹5 करोड़ प्रीमियम।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Social Trust</strong>: Women agents enhance LIC’s credibility in rural areas.</span><span lang="hi" class="lang-visible"><strong>सामाजिक विश्वास</strong>: महिला एजेंट ग्रामीण क्षेत्रों में एलआईसी की विश्वसनीयता बढ़ाती हैं।</span></li>' +
                '</ul>' +
              '</section>' +
              '<section class="section" id="demographics">' +
                '<h2>' +
                  '<span lang="en" class="lang-hidden">Demographics of Women in LIC</span>' +
                  '<span lang="hi" class="lang-visible">एलआईसी में महिलाओं की जनसांख्यिकी</span>' +
                '</h2>' +
                '<p>' +
                  '<span lang="en" class="lang-hidden">Women form a significant portion of LIC’s ecosystem, with strong rural representation.</span>' +
                  '<span lang="hi" class="lang-visible">महिलाएं एलआईसी के पारिस्थितिकी तंत्र का एक महत्वपूर्ण हिस्सा हैं, जिसमें ग्रामीण प्रतिनिधित्व मजबूत है।</span>' +
                '</p>' +
                '<ul>' +
                  '<li><span lang="en" class="lang-hidden"><strong>National</strong>: 11.2 crore women policyholders, 3.9 lakh women agents.</span><span lang="hi" class="lang-visible"><strong>राष्ट्रीय</strong>: 11.2 करोड़ महिला पॉलिसीधारक, 3.9 लाख महिला एजेंट।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Neemuch</strong>: 10,000 policyholders, 500 agents, 70% rural women.</span><span lang="hi" class="lang-visible"><strong>नीमच</strong>: 10,000 पॉलिसीधारक, 500 एजेंट, 70% ग्रामीण महिलाएं।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Age Group</strong>: 60% aged 25–45, 30% aged 18–25.</span><span lang="hi" class="lang-visible"><strong>आयु समूह</strong>: 60% आयु 25–45, 30% आयु 18–25।</span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Education</strong>: 50% 10th pass, 30% graduates in Neemuch.</span><span lang="hi" class="lang-visible"><strong>शिक्षा</strong>: नीमच में 50% 10वीं पास, 30% स्नातक।</span></li>' +
                '</ul>' +
              '</section>' +
              '<section class="section" id="testimonials">' +
                '<h2>' +
                  '<span lang="en" class="lang-hidden">Success Stories</span>' +
                  '<span lang="hi" class="lang-visible">सफलता की कहानियाँ</span>' +
                '</h2>' +
                '<div class="testimonial-item">' +
                  '<blockquote>' +
                    '<p><span lang="en" class="lang-hidden">“Bima Sakhi gave me ₹7,000/month and the skills to secure my village’s future.”</span><span lang="hi" class="lang-visible">“बीमा सखी ने मुझे ₹7,000/माह और मेरे गाँव के भविष्य को सुरक्षित करने के कौशल दिए।”</span></p>' +
                    '<cite><span lang="en" class="lang-hidden">Suman Devi, Neemuch</span><span lang="hi" class="lang-visible">सुमन देवी, नीमच</span></cite>' +
                  '</blockquote>' +
                '</div>' +
                '<div class="testimonial-item">' +
                  '<blockquote>' +
                    '<p><span lang="en" class="lang-hidden">“Aadhaar Shila’s ₹11 lakh cover ensures my children’s education.”</span><span lang="hi" class="lang-visible">“आधार शिला का ₹11 लाख कवर मेरे बच्चों की शिक्षा सुनिश्चित करता है।”</span></p>' +
                    '<cite><span lang="en" class="lang-hidden">Rekha Bai, Mandsaur</span><span lang="hi" class="lang-visible">रेखा बाई, मंदसौर</span></cite>' +
                  '</blockquote>' +
                '</div>' +
              '</section>' +
              '<section class="section" id="faqs">' +
                '<h2>' +
                  '<span lang="en" class="lang-hidden">Frequently Asked Questions</span>' +
                  '<span lang="hi" class="lang-visible">अक्सर पूछे जाने वाले प्रश्न</span>' +
                '</h2>' +
                '<div class="faq-list">' +
                  '<div class="faq-item">' +
                    '<h3 class="faq-question" id="faq-1" aria-controls="answer-1" aria-expanded="false">' +
                      '<span lang="en" class="lang-hidden">What is LIC Bima Sakhi Yojana?</span>' +
                      '<span lang="hi" class="lang-visible">एलआईसी बीमा सखी योजना क्या है?</span>' +
                    '</h3>' +
                    '<div class="faq-answer" id="answer-1">' +
                      '<div lang="en" class="lang-hidden">A 2024 scheme to train women as LIC agents with stipends and commissions.</div>' +
                      '<div lang="hi" class="lang-visible">2024 की योजना महिलाओं को वजीफा और कमीशन के साथ एलआईसी एजेंट के रूप में प्रशिक्षित करने की।</div>' +
                    '</div>' +
                  '</div>' +
                  '<div class="faq-item">' +
                    '<h3 class="faq-question" id="faq-2" aria-controls="answer-2" aria-expanded="false">' +
                      '<span lang="en" class="lang-hidden">Who can buy Aadhaar Shila?</span>' +
                      '<span lang="hi" class="lang-visible">आधार शिला कौन खरीद सकता है?</span>' +
                    '</h3>' +
                    '<div class="faq-answer" id="answer-2">' +
                      '<div lang="en" class="lang-hidden">Women aged 8–55 with Aadhaar linkage.</div>' +
                      '<div lang="hi" class="lang-visible">8–55 वर्ष की महिलाएं जिनका आधार लिंक है।</div>' +
                    '</div>' +
                  '</div>' +
                  '<div class="faq-item">' +
                    '<h3 class="faq-question" id="faq-3" aria-controls="answer-3" aria-expanded="false">' +
                      '<span lang="en" class="lang-hidden">What is the benefit of women agents?</span>' +
                      '<span lang="hi" class="lang-visible">महिला एजेंटों का लाभ क्या है?</span>' +
                    '</h3>' +
                    '<div class="faq-answer" id="answer-3">' +
                      '<div lang="en" class="lang-hidden">They increase trust and financial literacy among women clients.</div>' +
                      '<div lang="hi" class="lang-visible">वे महिला ग्राहकों के बीच विश्वास और वित्तीय साक्षरता बढ़ाती हैं।</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</section>' +
              '<section class="section" id="contact">' +
                '<h2>' +
                  '<span lang="en" class="lang-hidden">Contact Us</span>' +
                  '<span lang="hi" class="lang-visible">हमसे संपर्क करें</span>' +
                '</h2>' +
                '<ul>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Phone</strong>: <a href="tel:+917987235207" class="content-link">+91 7987235207</a></span><span lang="hi" class="lang-visible"><strong>फोन</strong>: <a href="tel:+917987235207" class="content-link">+91 7987235207</a></span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Email</strong>: <a href="mailto:jitendra.licneemuch@gmail.com" class="content-link">jitendra.licneemuch@gmail.com</a></span><span lang="hi" class="lang-visible"><strong>ईमेल</strong>: <a href="mailto:jitendra.licneemuch@gmail.com" class="content-link">jitendra.licneemuch@gmail.com</a></span></li>' +
                  '<li><span lang="en" class="lang-hidden"><strong>Address</strong>: Vikas Nagar, Scheme No. 14-3, Neemuch, MP 458441</span><span lang="hi" class="lang-visible"><strong>पता</strong>: विकास नगर, स्कीम नंबर 14-3, नीमच, मप्र 458441</span></li>' +
                '</ul>' +
              '</section>' +
            '</article>' +
          '</main>' +
        '</div>' +
        '<div class="sticky-cta" id="sticky-cta">' +
          '<a href="/join" class="content-link">' +
            '<span lang="en" class="lang-hidden">Join LIC Women’s Schemes Now!</span>' +
            '<span lang="hi" class="lang-visible">अब एलआईसी महिलाओं की योजनाओं में शामिल हों!</span>' +
          '</a>' +
        '</div>' +
        '<footer role="contentinfo">' +
          '<div class="footer-wave"></div>' +
          '<div class="footer-content">' +
            '<div class="footer-section">' +
              '<h3 class="footer-heading"><span lang="en" class="lang-hidden">About LIC Neemuch</span><span lang="hi" class="lang-visible">एलआईसी नीमच के बारे में</span></h3>' +
              '<p><span lang="en" class="lang-hidden">Serving Neemuch for 20+ years with trusted LIC solutions.</span><span lang="hi" class="lang-visible">20+ वर्षों से नीमच में विश्वसनीय एलआईसी समाधान प्रदान कर रहा है।</span></p>' +
            '</div>' +
            '<div class="footer-section">' +
              '<h3 class="footer-heading"><span lang="en" class="lang-hidden">Quick Links</span><span lang="hi" class="lang-visible">त्वरित लिंक</span></h3>' +
              '<ul class="footer-links">' +
                '<li><a href="/home" class="footer-link">Home</a></li>' +
                '<li><a href="/services" class="footer-link">Services</a></li>' +
                '<li><a href="/bimasakhi" class="footer-link">Bima Sakhi</a></li>' +
                '<li><a href="/mahila-lic" class="footer-link">Women’s Schemes</a></li>' +
              '</ul>' +
            '</div>' +
            '<div class="footer-section">' +
              '<h3 class="footer-heading"><span lang="en" class="lang-hidden">Contact Us</span><span lang="hi" class="lang-visible">हमसे संपर्क करें</span></h3>' +
              '<ul class="footer-links">' +
                '<li><a href="tel:+917987235207" class="footer-link">+91 7987235207</a></li>' +
                '<li><a href="mailto:jitendra.licneemuch@gmail.com" class="footer-link">jitendra.licneemuch@gmail.com</a></li>' +
                '<li><a href="/contact" class="footer-link">Vikas Nagar, Neemuch</a></li>' +
              '</ul>' +
            '</div>' +
            '<div class="footer-section">' +
              '<h3 class="footer-heading"><span lang="en" class="lang-hidden">Join Today</span><span lang="hi" class="lang-visible">आज शामिल हों</span></h3>' +
              '<div class="footer-gift">' +
                '<a href="/join" class="gift-button"><span lang="en" class="lang-hidden">Start Your LIC Journey</span><span lang="hi" class="lang-visible">अपनी एलआईसी यात्रा शुरू करें</span></a>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="footer-bottom">' +
            '<p><span lang="en" class="lang-hidden">© 2025 LIC Neemuch. All rights reserved.</span><span lang="hi" class="lang-visible">© 2025 एलआईसी नीमच। सर्वाधिकार सुरक्षित।</span></p>' +
            '<p><span lang="en" class="lang-hidden">Visit <a href="https://licindia.in" target="_blank" rel="noopener" class="content-link">licindia.in</a> for official details.</span><span lang="hi" class="lang-visible">आधिकारिक विवरण के लिए <a href="https://licindia.in" target="_blank" rel="noopener" class="content-link">licindia.in</a> पर जाएं।</span></p>' +
          '</div>' +
        '</footer>' +
        '<script type="application/ld+json">' +
          JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'LIC Neemuch',
        description: metaDescription,
        url: pageUrl,
        image: metaImage,
        telephone: '+91-7987235207',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Vikas Nagar, Scheme No. 14-3',
          addressLocality: 'Neemuch',
          addressRegion: 'Madhya Pradesh',
          postalCode: '458441',
          addressCountry: 'IN',
        },
        openingHours: 'Mo-Sa 10:00-17:00',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-7987235207',
          contactType: 'Customer Service',
          availableLanguage: ['English', 'Hindi'],
        },
        mainEntity: {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is LIC Bima Sakhi Yojana?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'A 2024 scheme to train women as LIC agents with stipends and commissions.',
              },
            },
            {
              '@type': 'Question',
              name: 'Who can buy Aadhaar Shila?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Women aged 8–55 with Aadhaar linkage.',
              },
            },
            {
              '@type': 'Question',
              name: 'What is the benefit of women agents?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'They increase trust and financial literacy among women clients.',
              },
            },
          ],
        },
      }) +
    '</script>' +
    '<script>' +
      'document.addEventListener("DOMContentLoaded", function() {' +
        'const toggles = ["nav-toggle", "sidebar-toggle"];' +
        'toggles.forEach(function(toggleClass) {' +
          'const toggle = document.querySelector("." + toggleClass);' +
          'const menu = document.querySelector(toggleClass === "nav-toggle" ? ".nav-menu" : ".sidebar-nav");' +
          'if (toggle && menu) {' +
            'toggle.addEventListener("click", function() {' +
              'const isExpanded = toggle.getAttribute("aria-expanded") === "true";' +
              'toggle.setAttribute("aria-expanded", !isExpanded);' +
              'menu.classList.toggle("active");' +
              'toggle.textContent = isExpanded ? "☰" : "✕";' +
              'trackEvent(toggleClass === "nav-toggle" ? "Navbar Toggle" : "Sidebar Toggle", isExpanded ? "Close" : "Open");' +
            '});' +
          '}' +
        '});' +
        'const backToTop = document.querySelector(".back-to-top");' +
        'if (backToTop) {' +
          'window.addEventListener("scroll", function() {' +
            'backToTop.classList.toggle("visible", window.scrollY > 300);' +
          '});' +
          'backToTop.addEventListener("click", function() {' +
            'window.scrollTo({ top: 0, behavior: "smooth" });' +
            'trackEvent("Back to Top", "Click");' +
          '});' +
        '}' +
        'const stickyCTA = document.querySelector(".sticky-cta");' +
        'if (stickyCTA) {' +
          'window.addEventListener("scroll", function() {' +
            'stickyCTA.classList.toggle("active", window.scrollY > 500);' +
          '});' +
        '}' +
        'const navbar = document.querySelector(".navbar");' +
        'if (navbar) {' +
          'window.addEventListener("scroll", function() {' +
            'navbar.classList.toggle("scrolled", window.scrollY > 50);' +
          '});' +
        '}' +
        'const sidebarLinks = document.querySelectorAll(".sidebar-link");' +
        'const sections = document.querySelectorAll("section");' +
        'if (sidebarLinks.length && sections.length && "IntersectionObserver" in window) {' +
          'const observerOptions = {' +
            'root: null,' +
            'rootMargin: "-150px 0px -50% 0px",' +
            'threshold: 0.1' +
          '};' +
          'const observer = new IntersectionObserver(function(entries) {' +
            'entries.forEach(function(entry) {' +
              'if (entry.isIntersecting) {' +
                'const id = entry.target.getAttribute("id");' +
                'sidebarLinks.forEach(function(link) {' +
                  'link.classList.toggle("active", link.getAttribute("href") === "#" + id);' +
                '});' +
              '}' +
            '});' +
          '}, observerOptions);' +
          'sections.forEach(function(section) {' +
            'observer.observe(section);' +
          '});' +
        '}' +
        'const faqQuestions = document.querySelectorAll(".faq-question");' +
        'faqQuestions.forEach(function(question) {' +
          'question.addEventListener("click", function() {' +
            'const answerId = question.getAttribute("aria-controls");' +
            'const answer = document.getElementById(answerId);' +
            'const isExpanded = question.getAttribute("aria-expanded") === "true";' +
            'question.setAttribute("aria-expanded", !isExpanded);' +
            'question.classList.toggle("active");' +
            'answer.classList.toggle("active");' +
            'trackEvent("FAQ Toggle", question.textContent, isExpanded ? "Close" : "Open");' +
          '});' +
        '});' +
        'const searchInput = document.getElementById("search-input");' +
        'const searchResults = document.getElementById("search-results");' +
        'const searchBtn = document.querySelector(".search-btn");' +
        'const searchContent = [' +
          '{ text: "Bima Sakhi Yojana", id: "bima-sakhi" },' +
          '{ text: "Aadhaar Shila Plan", id: "aadhaar-shila" },' +
          '{ text: "New Jeevan Anand", id: "new-jeevan-anand" },' +
          '{ text: "Bima Jyoti", id: "bima-jyoti" },' +
          '{ text: "Neemuch Women Initiatives", id: "neemuch-initiatives" },' +
          '{ text: "Women as Agents", id: "women-agents" },' +
          '{ text: "Women Policyholders", id: "women-policyholders" },' +
          '{ text: "Community Impact", id: "community-impact" },' +
          '{ text: "Demographics", id: "demographics" },' +
          '{ text: "Success Stories", id: "testimonials" },' +
          '{ text: "Frequently Asked Questions", id: "faqs" },' +
          '{ text: "Contact Us", id: "contact" }' +
        '];' +
        'function fuzzySearch(query, content) {' +
          'query = query.toLowerCase().trim();' +
          'if (!query) return [];' +
          'return content.filter(function(item) {' +
            'const text = item.text.toLowerCase();' +
            'let score = 0;' +
            'for (let i = 0; i < query.length; i++) {' +
              'if (text.includes(query[i])) score++;' +
            '}' +
            'return score > query.length * 0.5 ? { text: item.text, id: item.id, score: score } : null;' +
          '}).filter(Boolean).sort(function(a, b) { return b.score - a.score; });' +
        '}' +
        'function displayResults(results) {' +
          'searchResults.innerHTML = "";' +
          'if (results.length === 0) {' +
            'searchResults.innerHTML = \'<div class="no-results">\' +' +
              '\'<span lang="en" class="lang-hidden">No results found.</span>\' +' +
              '\'<span lang="hi" class="lang-visible">कोई परिणाम नहीं मिला।</span>\' +' +
            '\'</div>\';' +
            'searchResults.classList.add("active");' +
            'return;' +
          '}' +
          'results.forEach(function(result) {' +
            'const resultItem = document.createElement("div");' +
            'resultItem.className = "search-result-item";' +
            'const query = searchInput.value.toLowerCase().trim();' +
            'const highlightedText = result.text.replace(' +
              'new RegExp("(" + query.split("").join("|") + ")", "gi"),' +
              '\'<span class="search-highlight">$1</span>\'' +
            ');' +
            'resultItem.innerHTML = \'<span lang="en" class="lang-hidden">\' + highlightedText + \'</span>\' +' +
              '\'<span lang="hi" class="lang-visible">\' + highlightedText + \'</span>\';' +
            'resultItem.addEventListener("click", function() {' +
              'const target = document.getElementById(result.id);' +
              'if (target) {' +
                'target.scrollIntoView({ behavior: "smooth" });' +
                'searchResults.classList.remove("active");' +
                'searchInput.value = "";' +
                'trackEvent("Search Result Click", result.text);' +
              '}' +
            '});' +
            'searchResults.appendChild(resultItem);' +
          '});' +
          'searchResults.classList.add("active");' +
        '}' +
        'if (searchInput && searchBtn && searchResults) {' +
          'searchInput.addEventListener("input", function() {' +
            'const results = fuzzySearch(searchInput.value, searchContent);' +
            'displayResults(results);' +
          '});' +
          'searchBtn.addEventListener("click", function() {' +
            'const results = fuzzySearch(searchInput.value, searchContent);' +
            'displayResults(results);' +
            'trackEvent("Search", searchInput.value);' +
          '});' +
          'searchInput.addEventListener("keypress", function(e) {' +
            'if (e.key === "Enter") {' +
              'const results = fuzzySearch(searchInput.value, searchContent);' +
              'displayResults(results);' +
              'trackEvent("Search", searchInput.value);' +
            '}' +
          '});' +
        '}' +
        'function setLanguage(lang) {' +
          'document.querySelectorAll(\'[lang="en"], [lang="hi"]\').forEach(function(el) {' +
            'el.classList.toggle("lang-hidden", el.getAttribute("lang") !== lang);' +
            'el.classList.toggle("lang-visible", el.getAttribute("lang") === lang);' +
          '});' +
          'document.querySelectorAll(".lang-btn").forEach(function(btn) {' +
            'btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);' +
          '});' +
          'localStorage.setItem("preferredLang", lang);' +
          'trackEvent("Language Toggle", "Switch to " + lang);' +
        '}' +
        'const langButtons = document.querySelectorAll(".lang-btn");' +
        'langButtons.forEach(function(btn) {' +
          'btn.addEventListener("click", function() {' +
            'const lang = btn.getAttribute("data-lang");' +
            'setLanguage(lang);' +
          '});' +
        '});' +
        'const savedLang = localStorage.getItem("preferredLang") || "hi";' +
        'setLanguage(savedLang);' +
        'const images = document.querySelectorAll(\'img[loading="lazy"]\');' +
        'if ("IntersectionObserver" in window) {' +
          'const imageObserver = new IntersectionObserver(function(entries, observer) {' +
            'entries.forEach(function(entry) {' +
              'if (entry.isIntersecting) {' +
                'const img = entry.target;' +
                'img.src = img.dataset.src || img.src;' +
                'observer.unobserve(img);' +
              '}' +
            '});' +
          '});' +
          'images.forEach(function(img) {' +
            'imageObserver.observe(img);' +
          '});' +
        '} else {' +
          'images.forEach(function(img) {' +
            'img.src = img.dataset.src || img.src;' +
          '});' +
        '}' +
        'document.querySelectorAll(".nav-link, .sidebar-link, .footer-link").forEach(function(link) {' +
          'link.addEventListener("focus", function() {' +
            'link.scrollIntoView({ behavior: "smooth", block: "nearest" });' +
          '});' +
        '});' +
        'document.querySelectorAll(\'a[href^="#"]\').forEach(function(anchor) {' +
          'anchor.addEventListener("click", function(e) {' +
            'e.preventDefault();' +
            'const targetId = anchor.getAttribute("href").substring(1);' +
            'const target = document.getElementById(targetId);' +
            'if (target) {' +
              'target.scrollIntoView({ behavior: "smooth" });' +
              'trackEvent("Anchor Link", anchor.getAttribute("href"));' +
            '}' +
          '});' +
        '});' +
        'function trackEvent(category, action, label) {' +
          'console.log("Event: " + category + " | Action: " + action + " | Label: " + (label || "N/A"));' +
        '}' +
      '});' +
    '</script>' +
  '</body>' +
'</html>';

const faqs = extractFAQs(htmlContent);
const schema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'LIC Neemuch',
  description: metaDescription,
  url: pageUrl,
  image: metaImage,
  telephone: '+91-7987235207',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Vikas Nagar, Scheme No. 14-3',
    addressLocality: 'Neemuch',
    addressRegion: 'Madhya Pradesh',
    postalCode: '458441',
    addressCountry: 'IN',
  },
  openingHours: 'Mo-Sa 10:00-17:00',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-7987235207',
    contactType: 'Customer Service',
    availableLanguage: ['English', 'Hindi'],
  },
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: faqs.map(function(faq) {
      return {
        '@type': 'Question',
        name: escapeHTML(faq.question),
        acceptedAnswer: {
          '@type': 'Answer',
          text: escapeHTML(faq.answer),
        },
      };
    }),
  },
};

res.set({
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'public, max-age=3600',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' https://d12uvtgcxr5qif.cloudfront.net; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
});

res.status(200).send(htmlContent);
} catch (error) {
  console.error('Error rendering /mahila-lic:', error);
  res.status(500).send(
    '<!DOCTYPE html>' +
    '<html lang="en">' +
    '<head>' +
      '<meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
      '<title>Error</title>' +
    '</head>' +
    '<body>' +
      '<h1>Something went wrong</h1>' +
      '<p>Please try again later or contact support at +91 7987235207.</p>' +
    '</body>' +
    '</html>'
  );
}
});

module.exports = router;