const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
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

const escapeHTML = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const fetchRatingsAndReviews = async () => {
  try {
    const [ratings, reviews] = await Promise.all([
      LICRating.find().lean().exec(),
      LICReview.find().sort({ createdAt: -1 }).limit(5).lean().exec(),
    ]);
    const validRatings = ratings.filter((r) => r.rating >= 1 && r.rating <= 5);
    const averageRating = validRatings.length
      ? validRatings.reduce((sum, r) => sum + r.rating, 0) / validRatings.length
      : 0;
    return {
      averageRating: averageRating.toFixed(1),
      ratingCount: validRatings.length,
      reviews: reviews.map((review) => ({
        username: escapeHTML(review.username),
        comment: escapeHTML(review.comment),
        createdAt: review.createdAt,
        rating: validRatings.find((r) => r.userId === review.userId)?.rating || averageRating,
      })),
    };
  } catch (error) {
    console.error('[fetchRatingsAndReviews] Error:', error.stack);
    return { averageRating: 0, ratingCount: 0, reviews: [] };
  }
};

const renderStars = (rating) => {
  const starCount = Math.round(rating);
  return Array(5)
    .fill('☆')
    .map((star, i) => (i < starCount ? '★' : star))
    .join('');
};

router.get('/', async (req, res) => {
  console.log('SSR route hit for /about at', new Date().toISOString());

  try {
    const { averageRating, ratingCount, reviews } = await fetchRatingsAndReviews();
    const pageUrl = 'https://www.licneemuch.space/about';
    const metaTitle = 'About LIC Neemuch: Jitendra Patidar, Trusted Insurance Leader';
    const metaDescription =
      'Discover LIC Neemuch with Jitendra Patidar, trusted LIC officer in Madhya Pradesh. Explore our journey, awards & insurance plans: term, child, pension.';
      const logoImage = 'https://d12uvtgcxr5qif.cloudfront.net/images/html_2025-06-12_5bc78c6a-1a4b-4908-a854-356cce5ac68f.webp';

      const metaImage = 'https://d12uvtgcxr5qif.cloudfront.net/images/react_2025-06-12_4bd13d82-4fba-4a8e-8b2f-3c4d66b9f463.webp';
      const metaKeywords =
      'LIC Neemuch, Jitendra Patidar, life insurance Neemuch, term plans, pension plans, child plans, ULIPs, financial planning Madhya Pradesh, LIC India, insurance agent Neemuch, claim settlement, rural insurance, financial inclusion';

    // Enhanced Structured Data
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'LocalBusiness',
          name: 'LIC Neemuch',
          description: metaDescription,
          url: pageUrl,
          logo: metaImage,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Vikas Nagar, Scheme No. 14-3, Neemuch Chawni',
            addressLocality: 'Neemuch',
            addressRegion: 'Madhya Pradesh',
            postalCode: '458441',
            addressCountry: 'IN',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 24.4716,
            longitude: 74.8742,
          },
          telephone: '+917987235207',
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '17:00',
            },
          ],
          image: metaImage,
          aggregateRating: ratingCount > 0
            ? {
                '@type': 'AggregateRating',
                ratingValue: averageRating,
                reviewCount: ratingCount,
                bestRating: '5',
                worstRating: '1',
              }
            : undefined,
          review: reviews.map((review) => ({
            '@type': 'Review',
            itemReviewed: {
              '@type': 'LocalBusiness',
              name: 'LIC Neemuch',
              sameAs: pageUrl,
            },
            author: {
              '@type': 'Person',
              name: review.username,
            },
            datePublished: new Date(review.createdAt).toISOString().split('T')[0],
            reviewBody: review.comment,
            reviewRating: {
              '@type': 'Rating',
              ratingValue: review.rating.toString(),
              bestRating: '5',
              worstRating: '1',
            },
          })),
        },
        {
          '@type': 'Person',
          name: 'Jitendra Patidar',
          jobTitle: 'Development Officer',
          worksFor: {
            '@type': 'Organization',
            name: 'LIC Neemuch',
          },
          telephone: '+917987235207',
          image: metaImage,
          sameAs: [
            'https://www.instagram.com/do_jitendrapatidar_lic/',
            'https://www.linkedin.com/in/jitendra-patidar-lic/',
          ],
        },
        {
          '@type': 'WebPage',
          url: pageUrl,
          name: metaTitle,
          description: metaDescription,
          inLanguage: ['en-IN', 'hi-IN'],
          isPartOf: {
            '@type': 'WebSite',
            name: 'LIC Neemuch',
            url: 'https://d3fd3xyi5mztjw.cloudfront.net',
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://d3fd3xyi5mztjw.cloudfront.net',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'About',
                item: pageUrl,
              },
            ],
          },
        },
      ],
    };

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
            <a href="/join" class="nav-link" aria-label="Join as LIC Agent">Join as Agent</a>
            <a href="/services" class="nav-link" aria-label="Insurance Services">Services</a>
            <a href="/about" class="nav-link active" aria-current="page" aria-label="About Us">About</a>
            <a href="/faqs" class="nav-link" aria-label="LIC FAQs">LIC FAQs</a>
            <a href="/bimasakhi" class="nav-link">Bima Sakhi Yojana</a>

          </div>
        </nav>
        <div class="hero-section" aria-labelledby="hero-title">
          <div class="hero-content">
            <h1 class="hero-title" id="hero-title" aria-label="About LIC Neemuch">
              <span lang="en">About LIC Neemuch</span>
              <span lang="hi" class="hidden">एलआईसी नीमच के बारे में</span>
            </h1>
            <p class="hero-subtitle" lang="en">
              Under the leadership of Jitendra Patidar, LIC Neemuch delivers trusted life insurance and financial planning services in Neemuch, Madhya Pradesh, serving over 50,000 policyholders with a 98.62% claim settlement ratio.
            </p>
            <p class="hero-subtitle" lang="hi">
              जितेंद्र पाटीदार के नेतृत्व में, एलआईसी नीमच नीमच, मध्य प्रदेश में विश्वसनीय जीवन बीमा और वित्तीय योजना सेवाएँ प्रदान करता है, जो 50,000+ पॉलिसीधारकों की सेवा करता है और 98.62% क्लेम सेटलमेंट अनुपात रखता है।
            </p>
            ${
              ratingCount > 0 && averageRating >= 1
                ? `
              <div class="hero-rating" aria-label="Average rating ${averageRating} out of 5 based on ${ratingCount} reviews">
                <span class="stars" aria-hidden="true">${renderStars(averageRating)}</span>
                <span class="rating-text">${averageRating}/5 (${ratingCount} reviews)</span>
              </div>
            `
                : ''
            }
            <div class="hero-cta">
              <a href="tel:+917987235207" class="cta-button" aria-label="Contact Jitendra Patidar">Call Now</a>
              <a href="/services" class="cta-button secondary" aria-label="Explore LIC Insurance Plans">Explore Plans</a>
              <a href="https://wa.me/917987235207" target="_blank" rel="noopener noreferrer" class="cta-button secondary" aria-label="Chat on WhatsApp">WhatsApp Chat</a>
            </div>
          </div>
          <div class="hero-image">
            <img src="${metaImage}" alt="Jitendra Patidar, LIC Development Officer in Neemuch" loading="eager" width="500" height="333" onerror="this.src='https://via.placeholder.com/500x333?text=Image+Not+Found';">
          </div>
        </div>
      </header>
      <div class="container">
        <aside class="sidebar" aria-label="Section navigation">
          <button class="sidebar-toggle" aria-label="Toggle sidebar" aria-expanded="true">
            <span class="sidebar-toggle-icon">☰</span>
          </button>
          <nav class="sidebar-nav" aria-label="Section links">
            <a href="#about" class="sidebar-link" aria-label="About LIC Neemuch">About</a>
            <a href="#jitendra" class="sidebar-link" aria-label="Jitendra Patidar">Jitendra</a>
            <a href="#history" class="sidebar-link" aria-label="LIC History">History</a>
            <a href="#team" class="sidebar-link" aria-label="Our Team">Team</a>
            <a href="#awards" class="sidebar-link" aria-label="Awards and Recognition">Awards</a>
            <a href="#social" class="sidebar-link" aria-label="Social Initiatives">Social</a>
            <a href="#testimonials" class="sidebar-link" aria-label="Client Testimonials">Testimonials</a>
            <a href="#contact" class="sidebar-link" aria-label="Contact Us">Contact</a>
            <a href="#architecture" class="sidebar-link" aria-label="Service Architecture">Architecture</a>
          </nav>
        </aside>
        <main role="main">
          <article aria-labelledby="about-heading">
            <section class="section about-section" id="about" aria-labelledby="about-heading">
              <h2 id="about-heading">About LIC Neemuch</h2>
              <p lang="en">
                LIC Neemuch, a branch of the <a href="https://www.licindia.in" target="_blank" rel="noopener noreferrer" class="content-link" aria-label="Visit LIC India Official Website">Life Insurance Corporation of India</a> (established 1956), is a leading insurance provider in Madhya Pradesh, managing assets worth ₹54.52 trillion (FY25). Guided by Development Officer Jitendra Patidar, we serve over 50,000 policyholders with customized financial solutions, including term plans, pension plans, child plans, and ULIPs.
              </p>
              <p lang="hi">
                भारतीय जीवन बीमा निगम (स्थापना 1956) की एक शाखा, <a href="https://www.licindia.in/hi" target="_blank" rel="noopener noreferrer" class="content-link" aria-label="एलआईसी इंडिया की आधिकारिक वेबसाइट पर जाएँ">एलआईसी नीमच</a>, मध्य प्रदेश में एक प्रमुख बीमा प्रदाता है, जो ₹54.52 लाख करोड़ (FY25) की संपत्ति का प्रबंधन करता है। डेवलपमेंट ऑफिसर जितेंद्र पाटीदार के मार्गदर्शन में, हम 50,000+ पॉलिसीधारकों को टर्म प्लान, पेंशन प्लान, चाइल्ड प्लान और यूलिप्स सहित अनुकूलित वित्तीय समाधान प्रदान करते हैं।
              </p>
              <h3>Vision and Mission</h3>
              <ul class="benefits-list">
                <li>Empowering every household with affordable and accessible insurance solutions.</li>
                <li>Promoting financial literacy and inclusion in rural Madhya Pradesh.</li>
                <li>Ensuring transparency, trust, and customer-centric services in all interactions.</li>
              </ul>
              <table class="data-table">
                <caption>LIC Neemuch at a Glance</caption>
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Policyholders</td>
                    <td>50,000+</td>
                  </tr>
                  <tr>
                    <td>Agents</td>
                    <td>150+</td>
                  </tr>
                  <tr>
                    <td>Claim Settlement Ratio</td>
                    <td>98.62% (FY 2020-21)</td>
                  </tr>
                  <tr>
                    <td>Service Areas</td>
                    <td>Neemuch, Manasa, Singoli, Mandsaur</td>
                  </tr>
                </tbody>
              </table>
              <h3>Why Choose LIC Neemuch?</h3>
              <p lang="en">
                With a legacy of trust and a commitment to excellence, LIC Neemuch offers unparalleled insurance services. Our high claim settlement ratio, extensive agent network, and personalized financial planning make us the preferred choice in Madhya Pradesh. Learn more about our <a href="/services" class="content-link" aria-label="Explore LIC Insurance Services">insurance plans</a> or <a href="/join" class="content-link" aria-label="Join as an LIC Agent">join our team</a>.
              </p>
              <a href="/services" class="cta-button secondary" aria-label="Explore Our Services">Explore Services</a>
            </section>
          </article>

          <article aria-labelledby="jitendra-heading">
            <section class="section jitendra-section" id="jitendra" aria-labelledby="jitendra-heading">
              <h2 id="jitendra-heading">Meet Jitendra Patidar</h2>
              <p lang="en">
                Jitendra Patidar, an esteemed LIC Development Officer, has been the driving force behind LIC Neemuch’s success for over a decade. A <a href="https://www.licindia.in/Agents/Chairman-Club" target="_blank" rel="noopener noreferrer" class="content-link" aria-label="Learn about LIC Chairman’s Club">Chairman’s Club member (2020)</a>, he specializes in term plans like New Jeevan Amar, pension plans like Jeevan Shanti, and child plans like Jeevan Tarun, offering tailored financial planning to meet diverse client needs.
              </p>
              <p lang="hi">
                जितेंद्र पाटीदार, एक प्रतिष्ठित एलआईसी डेवलपमेंट ऑफिसर, एक दशक से अधिक समय से एलआईसी नीमच की सफलता के पीछे प्रेरक शक्ति रहे हैं। <a href="https://www.licindia.in/hi/Agents/Chairman-Club" target="_blank" rel="noopener noreferrer" class="content-link" aria-label="एलआईसी चेयरमैन क्लब के बारे में जानें">चेयरमैन क्लब सदस्य (2020)</a>, वे न्यू जीवन अमर जैसे टर्म प्लान, जीवन शांति जैसे पेंशन प्लान, और जीवन तरुण जैसे चाइल्ड प्लान में विशेषज्ञ हैं, जो विविध ग्राहक आवश्यकताओं को पूरा करने के लिए अनुकूलित वित्तीय योजना प्रदान करते हैं।
              </p>
              <div class="card-grid">
                <div class="card">
                  <h3>Achievements</h3>
                  <ul class="benefits-list">
                    <li>Top Development Officer (2022)</li>
                    <li>Rural Outreach Award (2023)</li>
                    <li>Chairman’s Club Member (2020)</li>
                    <li>Best Performer, Mandsaur Division (2021)</li>
                  </ul>
                </div>
                <div class="card">
                  <h3>Expertise</h3>
                  <ul class="benefits-list">
                    <li>Term Plans: New Jeevan Amar, LIC’s Tech Term</li>
                    <li>Pension Plans: Jeevan Shanti, Saral Pension</li>
                    <li>Child Plans: Jeevan Tarun, New Children’s Money Back</li>
                    <li>ULIPs: Nivesh Plus, SIIP</li>
                  </ul>
                </div>
              </div>
              <div class="timeline">
                <h3>Career Milestones</h3>
                <ul>
                  <li><span>2015:</span> Joined LIC as Development Officer</li>
                  <li><span>2018:</span> Promoted to Senior Development Officer</li>
                  <li><span>2020:</span> Earned Chairman’s Club Membership</li>
                  <li><span>2023:</span> Led 50+ rural insurance literacy campaigns</li>
                </ul>
              </div>
              <h3>Jitendra’s Commitment</h3>
              <p lang="en">
                Jitendra’s client-centric approach ensures that every policyholder receives personalized advice. His expertise in <a href="https://www.licindia.in/Products/Term-Plans" target="_blank" rel="noopener noreferrer" class="content-link" aria-label="Explore LIC Term Plans">term insurance</a> and pension planning has helped thousands secure their financial future. Connect with him on <a href="https://www.linkedin.com/in/jitendra-patidar-lic/" target="_blank" rel="noopener noreferrer" class="content-link" aria-label="Visit Jitendra’s LinkedIn Profile">LinkedIn</a> or <a href="https://www.instagram.com/do_jitendrapatidar_lic/" target="_blank" rel="noopener noreferrer" class="content-link" aria-label="Follow Jitendra on Instagram">Instagram</a>.
              </p>
              <a href="tel:+917987235207" class="cta-button secondary" aria-label="Contact Jitendra Patidar">Contact Jitendra</a>
            </section>
          </article>

          <article aria-labelledby="history-heading">
            <section class="section history-section" id="history" aria-labelledby="history-heading">
              <h2 id="history-heading">LIC’s Illustrious History</h2>
              <p lang="en">
                Established in 1956 through an Act of Parliament, the <a href="https://www.licindia.in/About-Us" target="_blank" rel="noopener noreferrer" class="content-link" aria-label="Learn about LIC India’s History">Life Insurance Corporation of India</a> is India’s largest insurer, serving over 29 crore policyholders with a claim settlement ratio of 98.62% (FY 2020-21). LIC Neemuch upholds this legacy by providing localized expertise and trusted services in Madhya Pradesh.
              </p>
              <p lang="hi">
                1956 में संसद के एक अधिनियम के माध्यम से स्थापित, <a href="https://www.licindia.in/hi/About-Us" target="_blank" rel="noopener noreferrer" class="content-link" aria-label="एलआईसी इंडिया के इतिहास के बारे में जानें">भारतीय जीवन बीमा निगम</a> भारत का सबसे बड़ा बीमाकर्ता है, जो 29 करोड़ से अधिक पॉलिसीधारकों की सेवा करता है और 98.62% क्लेम सेटलमेंट अनुपात (वित्त वर्ष 2020-21) रखता है। एलआईसी नीमच मध्य प्रदेश में स्थानीय विशेषज्ञता और विश्वसनीय सेवाएँ प्रदान करके इस विरासत को बनाए रखता है।
              </p>
              <div class="timeline">
                <h3>Key Milestones</h3>
                <ul>
                  <li><span>1956:</span> LIC founded by an Act of Parliament</li>
                  <li><span>2000:</span> Surpassed 10 crore policies</li>
                  <li><span>2010:</span> Introduced online policy services</li>
                  <li><span>2022:</span> Listed on BSE and NSE</li>
                </ul>
              </div>
              <h3>LIC’s Global Impact</h3>
              <p lang="en">
                LIC operates internationally in countries like the UK, Fiji, and Sri Lanka, reinforcing its global trust. Visit <a href="https://www.licinternational.com" target="_blank" rel="noopener noreferrer" class="content-link" aria-label="Explore LIC International">LIC International</a> for more details.
              </p>
            </section>
          </article>

          <article aria-labelledby="team-heading">
            <section class="section team-section" id="team" aria-labelledby="team-heading">
              <h2 id="team-heading">Our Dedicated Team</h2>
              <p lang="en">
                Our team of 150+ agents, 10 supervisors, and 5 support staff, led by Jitendra Patidar, ensures seamless service delivery across Neemuch, Manasa, Singoli, and Mandsaur. Each member is trained to provide expert guidance on LIC’s diverse product portfolio.
              </p>
              <p lang="hi">
                जितेंद्र पाटीदार के नेतृत्व में हमारी 150+ एजेंटों, 10 सुपरवाइज़रों और 5 सहायक कर्मचारियों की टीम नीमच, मनासा, सिंगोली और मंदसौर में निर्बाध सेवा वितरण सुनिश्चित करती है। प्रत्येक सदस्य को एलआईसी के विविध उत्पाद पोर्टफोलियो पर विशेषज्ञ मार्गदर्शन प्रदान करने के लिए प्रशिक्षित किया जाता है।
              </p>
              <div class="card-grid">
                <div class="card">
                  <h3>Agents</h3>
                  <p>150+ certified professionals trained in LIC products</p>
                </div>
                <div class="card">
                  <h3>Supervisors</h3>
                  <p>10 senior experts overseeing operations</p>
                </div>
                <div class="card">
                  <h3>Support Staff</h3>
                  <p>5 dedicated members for customer assistance</p>
                </div>
              </div>
              <h3>Team Training</h3>
              <p lang="en">
                Our agents undergo rigorous training through <a href="https://www.licindia.in/Agents/Training" target="_blank" rel="noopener noreferrer" class="content-link" aria-label="Learn about LIC Agent Training">LIC’s training programs</a>, ensuring they are well-equipped to handle client queries and provide accurate advice.
              </p>
            </section>
          </article>

          <article aria-labelledby="awards-heading">
            <section class="section awards-section" id="awards" aria-labelledby="awards-heading">
              <h2 id="awards-heading">Awards and Recognition</h2>
              <p lang="en">
                LIC Neemuch and Jitendra Patidar have been recognized for their outstanding contributions to insurance services and rural outreach in Madhya Pradesh.
              </p>
              <p lang="hi">
                एलआईसी नीमच और जितेंद्र पाटीदार को मध्य प्रदेश में बीमा सेवाओं और ग्रामीण आउटरीच में उनके उत्कृष्ट योगदान के लिए सम्मानित किया गया है।
              </p>
              <ul class="benefits-list">
                <li>Top Development Officer Award (2022, Mandsaur Division)</li>
                <li>Rural Outreach Award (2023, LIC India)</li>
                <li>Chairman’s Club Membership (2020)</li>
                <li>Best Customer Service Award (2021, Neemuch Branch)</li>
              </ul>
            </section>
          </article>

          <article aria-labelledby="social-heading">
            <section class="section social-section" id="social" aria-labelledby="social-heading">
              <h2 id="social-heading">Social Initiatives</h2>
              <p lang="en">
                LIC Neemuch is deeply committed to social welfare, focusing on education, healthcare, and financial inclusion in rural areas like Sarwaniya Maharaj, Ratangarh, and Manasa. Our initiatives align with <a href="https://www.licindia.in/Corporate-Social-Responsibility" target="_blank" rel="noopener noreferrer" class="content-link" aria-label="Learn about LIC’s CSR Activities">LIC’s CSR objectives</a>.
              </p>
              <p lang="hi">
                एलआईसी नीमच सामाजिक कल्याण के लिए गहराई से प्रतिबद्ध है, जो सरवानिया महाराज, रतनगढ़ और मनासा जैसे ग्रामीण क्षेत्रों में शिक्षा, स्वास्थ्य और वित्तीय समावेशन पर केंद्रित है। हमारी पहल <a href="https://www.licindia.in/hi/Corporate-Social-Responsibility" target="_blank" rel="noopener noreferrer" class="content-link" aria-label="एलआईसी की सीएसआर गतिविधियों के बारे में जानें">एलआईसी के सीएसआर उद्देश्यों</a> के साथ संरेखित है।
              </p>
              <ul class="benefits-list">
                <li>75+ insurance literacy camps conducted in 2023</li>
                <li>10,000+ enrollments in PMJBY and PMSBY schemes</li>
                <li>₹5 lakh donated to healthcare initiatives in 2022</li>
                <li>500+ school kits distributed in rural schools</li>
              </ul>
              <h3>Community Impact</h3>
              <p lang="en">
                Through partnerships with local NGOs and government schemes like <a href="https://www.jansuraksha.gov.in" target="_blank" rel="noopener noreferrer" class="content-link" aria-label="Learn about Pradhan Mantri Jan Suraksha Schemes">Pradhan Mantri Jan Suraksha</a>, we’ve empowered thousands with financial security.
              </p>
              <a href="/join" class="cta-button secondary" aria-label="Join Our Social Initiatives">Join Our Initiatives</a>
            </section>
          </article>

          <article aria-labelledby="testimonials-heading">
            <section class="section testimonials-section" id="testimonials" aria-labelledby="testimonials-heading">
              <h2 id="testimonials-heading">Client Testimonials</h2>
              <p lang="en">
                Our clients trust LIC Neemuch for its reliable service, transparent processes, and Jitendra Patidar’s expert guidance. Read their experiences below or share your own on our <a href="/reviews" class="content-link" aria-label="View All Customer Reviews">reviews page</a>.
              </p>
              <p lang="hi">
                हमारे ग्राहक विश्वसनीय सेवा, पारदर्शी प्रक्रियाओं और जितेंद्र पाटीदार के विशेषज्ञ मार्गदर्शन के लिए एलआईसी नीमच पर भरोसा करते हैं। नीचे उनके अनुभव पढ़ें या हमारी <a href="/reviews" class="content-link" aria-label="सभी ग्राहक समीक्षाएँ देखें">समीक्षा पेज</a> पर अपनी राय साझा करें।
              </p>
              ${
                reviews.length > 0
                  ? `
                <div class="testimonials-carousel" aria-label="Client testimonials carousel">
                  ${reviews
                    .map(
                      (review, index) => `
                    <div class="testimonial-card" data-index="${index}" ${
                        index === 0 ? 'style="display: block;"' : 'style="display: none;"'
                      } itemscope itemtype="https://schema.org/Review">
                      <div class="review-stars" aria-hidden="true">${renderStars(review.rating)}</div>
                      <blockquote class="review-body" itemprop="reviewBody">${review.comment}</blockquote>
                      <cite class="review-author" itemprop="author" itemscope itemtype="https://schema.org/Person">
                        <span itemprop="name">${review.username}</span>
                      </cite>
                      <meta itemprop="datePublished" content="${
                        new Date(review.createdAt).toISOString().split('T')[0]
                      }">
                      <meta itemprop="reviewRating" content="${review.rating}">
                    </div>
                  `
                    )
                    .join('')}
                </div>
                <button class="carousel-prev" aria-label="Previous testimonial">❮</button>
                <button class="carousel-next" aria-label="Next testimonial">❯</button>
                <a href="/reviews" class="cta-button secondary" aria-label="View All Testimonials">View All</a>
              `
                  : '<p lang="en">No testimonials yet. Be the first to share your experience!</p><p lang="hi">अभी तक कोई समीक्षा नहीं। अपनी अनुभव साझा करने वाले पहले व्यक्ति बनें!</p>'
              }
            </section>
          </article>

          <article aria-labelledby="architecture-heading">
            <section class="section architecture-section" id="architecture" aria-labelledby="architecture-heading">
              <h2 id="architecture-heading">Our Service Architecture</h2>
              <p lang="en">
                LIC Neemuch’s service delivery is designed for efficiency and client satisfaction, as illustrated in the diagram below. From inquiry to policy issuance, our process ensures seamless support.
              </p>
              <pre class="ascii-diagram" aria-label="LIC Neemuch Service Architecture Diagram">
+---------------------------------+
|         Client Inquiry          |
|  (Phone, WhatsApp, In-Person)   |
+---------------------------------+
                 |
                 v
+---------------------------------+
|       Initial Consultation      |
|   (Jitendra/Expert Agents)      |
+---------------------------------+
                 |
                 v
+---------------------------------+
|         Needs Assessment        |
|  (Financial Goals Analysis)     |
+---------------------------------+
                 |
                 v
+---------------------------------+
|         Plan Recommendation     |
| (Term, Pension, Child, ULIP)    |
+---------------------------------+
                 |
                 v
+---------------------------------+
|       Policy Application        |
|    (Digital/Physical Forms)     |
+---------------------------------+
                 |
                 v
+---------------------------------+
|        Policy Issuance          |
|    (Secure Digital Portal)      |
+---------------------------------+
                 |
                 v
+---------------------------------+
|      Post-Sale Support          |
| (Claims, Updates, Queries)      |
+---------------------------------+
              </pre>
              <p lang="en">
                This streamlined process, overseen by Jitendra Patidar, ensures that every client receives personalized attention. Learn more about our <a href="/services" class="content-link" aria-label="Explore LIC Insurance Services">services</a>.
              </p>
            </section>
          </article>

          <article aria-labelledby="contact-heading">
            <section class="section contact-section" id="contact" aria-labelledby="contact-heading">
              <h2 id="contact-heading">Connect with Us</h2>
              <p lang="en">
                Reach out to Jitendra Patidar for expert insurance advice in Neemuch, Madhya Pradesh. Our team is available to assist with policy selection, claims, and more.
              </p>
              <p lang="hi">
                नीमच, मध्य प्रदेश में विशेषज्ञ बीमा सलाह के लिए जितेंद्र पाटीदार से संपर्क करें। हमारी टीम पॉलिसी चयन, दावों और अन्य के लिए सहायता के लिए उपलब्ध है।
              </p>
              <div class="contact-info">
                <div class="contact-details">
                  <p>
                    📞 <strong>Phone:</strong> <a href="tel:+917987235207" class="content-link" aria-label="Call Jitendra Patidar">+91 7987235207</a>
                  </p>
                  <p>
                    📸 <strong>Instagram:</strong> <a href="https://www.instagram.com/do_jitendrapatidar_lic/" class="content-link" target="_blank" rel="noopener noreferrer" aria-label="Visit Instagram Profile">do_jitendrapatidar_lic</a>
                  </p>
                  <p>
                    💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/jitendra-patidar-lic/" class="content-link" target="_blank" rel="noopener noreferrer" aria-label="Visit Jitendra’s LinkedIn Profile">Jitendra Patidar</a>
                  </p>
                  <address>
                    <strong>Office:</strong> Vikas Nagar, Scheme No. 14-3, Neemuch Chawni, Neemuch, Madhya Pradesh 458441
                  </address>
                  <p>
                    📍 <strong>WhatsApp:</strong> <a href="https://wa.me/917987235207" class="content-link" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">Chat Now</a>
                  </p>
                </div>
                <div class="contact-map">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.392!2d74.8742!3d24.4716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e7d6c8c0f0c1%3A0x9f0b0f0c0c0c0c0c!2sNeemuch%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1698765432100"
                    width="100%"
                    height="300"
                    style="border:0; border-radius: 10px;"
                    allowfullscreen=""
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    aria-label="Map of Neemuch"
                  ></iframe>
                </div>
              </div>
              <a href="tel:+917987235207" class="cta-button" aria-label="Get Started Now">Get Started Now</a>
            </section>
          </article>
        </main>
      </div>
      <button class="scroll-to-top" aria-label="Scroll to top" title="Back to top">↑</button>
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
        <meta name="description" content="${escapeHTML(metaDescription)}">
        <meta name="keywords" content="${escapeHTML(metaKeywords)}">
        <meta name="author" content="Jitendra Patidar">
        <meta name="robots" content="index, follow">
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

          .hero-rating {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: fade-in-up 0.8s ease-out 0.4s;
            animation-fill-mode: both;
          }

          .stars {
            font-size: 1.2rem;
            color: var(--primary-color);
          }

          .rating-text {
            font-size: 0.95rem;
          }

          .hero-cta {
            display: flex;
            flex-wrap: wrap;
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
            transition: transform 0.3s ease;
          }

          .sidebar.sticky {
            transform: translateY(0);
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

          .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            background: var(--card-bg);
            border-radius: var(--border-radius);
            overflow: hidden;
          }

          .data-table th,
          .data-table td {
            padding: 0.8rem;
            text-align: left;
            border-bottom: 1px solid var(--card-border);
          }

          .data-table th {
            background: linear-gradient(90deg, var(--primary-color), var(--primary-color));
            color: var(--bg-end);
            font-weight: 600;
          }

          .data-table tr:nth-child(even) {
            background: rgba(230, 57, 70, 0.05);
          }

          .data-table tr:hover {
            background: rgba(244, 162, 97, 0.1);
          }

          .data-table caption {
            font-size: 0.9rem;
            color: var(--text-color);
            padding: 0.5rem;
            text-align: left;
          }

          .timeline {
            position: relative;
            padding-left: 0.2rem;
          }

          .timeline ul {
            list-style: none;
            position: relative;
            padding-left: 2rem;
          }

          .timeline ul::before {
            content: '';
            position: absolute;
            left: 0.5rem;
            top: 0;
            bottom: 0;
            width: 4px;
            background: var(--primary-color);
          }

          .timeline li {
            position: relative;
            margin-bottom: 1.5rem;
            padding-left: 2rem;
          }

          .timeline li::before {
            content: '';
            position: absolute;
            left: -0.3rem;
            top: 0.5rem;
            width: 12px;
            height: 12px;
            background: var(--secondary-color);
            border-radius: 50%;
            border: 2px solid var(--bg-end);
          }

          .timeline span {
            font-weight: bold;
            color: var(--primary-color);
          }

          .testimonials-section {
            margin: 2rem 0;
            padding: 1.5rem;
            background: rgba(230, 57, 70, 0.05);
            border-radius: var(--border-radius);
            position: relative;
          }

          .testimonials-carousel {
            position: relative;
            overflow: hidden;
            height: auto;
          }

          .testimonial-card {
            padding: 2rem;
            text-align: center;
            color: var(--text-color);
            transition: transform 0.5s ease, opacity 0.5s ease;
          }

          .review-body {
            font-size: 1.1rem;
            font-style: italic;
            margin-bottom: 1rem;
            position: relative;
            padding-left: 2rem;
          }

          .review-body::before {
            content: '“';
            position: absolute;
            left: 0;
            top: 0;
            font-size: 2rem;
            color: var(--primary-color);
          }

          .review-author {
            font-size: 1rem;
            color: var(--accent-color);
          }

          .review-stars {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: var(--primary-color);
          }

          .carousel-prev,
          .carousel-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: var(--primary-color);
            color: var(--text-color);
            border: none;
            padding: 0.5rem;
            cursor: pointer;
            border-radius: 50%;
            font-size: 1.2rem;
            transition: var(--transition);
          }

          .carousel-prev {
            left: 10px;
          }

          .carousel-next {
            right: 10px;
          }

          .carousel-prev:hover,
          .carousel-next:hover {
            background: var(--secondary-color);
            transform: translateY(-50%) scale(1.1);
          }

          .contact-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            background: var(--card-bg);
            padding: 1rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
          }

          .contact-details p {
            margin-bottom: 0.5rem;
          }

          .contact-map iframe {
            width: 100%;
            height: 300px;
            border-radius: var(--border-radius);
          }

          .ascii-diagram {
            font-family: monospace;
            background: var(--card-bg);
            padding: 1rem;
            border-radius: var(--border-radius);
            white-space: pre;
            overflow-x: auto;
          }

          .scroll-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-color);
            color: var(--text-color);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
            cursor: pointer;
            display: none;
            transition: var(--transition);
            z-index: 1000;
          }

          .scroll-to-top:hover {
            background: var(--secondary-color);
            transform: scale(1.1);
          }

          .scroll-to-top.visible {
            display: block;
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

            .contact-info {
              grid-template-columns: 1fr;
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

            .sidebar {
              max-width: 100%;
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

            .footer-content {
              flex-direction: column;
              text-align: center;
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
              padding: 0.3rem;
              margin-bottom: 0.7rem;
              font-size: 0.8rem;
            }

            .data-table th,
            .data-table td {
              padding: 0.4rem;
              font-size: 0.8rem;
            }
          }
        </style>
        <script>
          document.addEventListener('DOMContentLoaded', () => {
            // Navigation toggle
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            navToggle?.addEventListener('click', () => {
              const expanded = navToggle.getAttribute('aria-expanded') === 'true';
              navToggle.setAttribute('aria-expanded', !expanded);
              navMenu.classList.toggle('active');
            });

            // Sidebar toggle
            const sidebarToggle = document.querySelector('.sidebar-toggle');
            const sidebarNav = document.querySelector('.sidebar-nav');
            sidebarToggle?.addEventListener('click', () => {
              const expanded = sidebarToggle.getAttribute('aria-expanded') === 'true';
              sidebarToggle.setAttribute('aria-expanded', !expanded);
              sidebarNav.classList.toggle('active');
              sidebarToggle.querySelector('.sidebar-toggle-icon').textContent = expanded ? '☰' : '✕';
            });

            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(link => {
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
                  if (sidebarNav.classList.contains('active')) {
                    sidebarToggle.click();
                  }
                }
              });
            });

           // Highlight active section
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
  

            // Testimonial carousel
            const cards = document.querySelectorAll('.testimonial-card');
            const prevButton = document.querySelector('.carousel-prev');
            const nextButton = document.querySelector('.carousel-next');
            if (cards.length > 0) {
              let current = 0;
              const showCard = (index) => {
                cards.forEach((card, i) => {
                  card.style.display = i === index ? 'block' : 'none';
                });
              };
              prevButton?.addEventListener('click', () => {
                current = (current - 1 + cards.length) % cards.length;
                showCard(current);
              });
              nextButton?.addEventListener('click', () => {
                current = (current + 1) % cards.length;
                showCard(current);
              });
              setInterval(() => {
                current = (current + 1) % cards.length;
                showCard(current);
              }, 5000);
            }

            // Navbar scroll effect
            window.addEventListener('scroll', () => {
              const navbar = document.querySelector('.navbar');
              navbar.classList.toggle('scrolled', window.scrollY > 0);
            });

            // Scroll-to-top button
            const scrollToTop = document.querySelector('.scroll-to-top');
            window.addEventListener('scroll', () => {
              scrollToTop.classList.toggle('visible', window.scrollY > 300);
            });
            scrollToTop?.addEventListener('click', () => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Lazy load images
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
              if ('IntersectionObserver' in window) {
                const imgObserver = new IntersectionObserver((entries, observer) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const image = entry.target;
                      image.src = image.dataset.src || image.src;
                      observer.unobserve(image);
                    }
                  });
                });
                imgObserver.observe(img);
              } else {
                img.src = img.dataset.src || img.src;
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

    console.log('SSR HTML generated for /about, length:', html.length);
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(html);
    console.log('SSR response sent for /about at', new Date().toISOString());
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
            background: linear-gradient(180deg, #0A1C14, #0A0506);
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

router.get('/hi', async (req, res) => {
  res.redirect(301, '/about');
});

module.exports = router;