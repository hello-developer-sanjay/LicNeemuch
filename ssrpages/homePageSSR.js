
const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const LICReview = require('../models/LICReview');
const LICRating = require('../models/LICRating');
const crypto = require('crypto-js');

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

  // Prevent parameter injection by sanitizing query parameters
  const queryParams = Object.keys(req.query);
  if (queryParams.length > 0) {
    const allowedParams = ['lang']; // Define allowed query parameters
    const invalidParams = queryParams.filter(param => !allowedParams.includes(param));
    if (invalidParams.length > 0) {
      console.warn(`Invalid query parameters detected: ${invalidParams.join(', ')}`);
      return res.redirect(301, '/');
    }
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
    const [reviews, ratings] = await Promise.all([
      LICReview.find().lean(),
      LICRating.find().lean(),
    ]);

    const mappedReviews = reviews.map((review) => {
      const userId = crypto.MD5(review.email).toString();
      const rating = ratings.find((r) => r.userId === userId) || { rating: 1 };
      return {
        quote: review.comment,
        author: review.username,
        rating: rating.rating,
        language: review.language || 'en-IN',
        datePublished: review.datePublished,
      };
    });

    const averageRating = ratings.length > 0
      ? parseFloat(
          (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
        )
      : 0;

    const ratingCount = ratings.length; // ✅ this was missing

    return { reviews: mappedReviews, ratings, averageRating, ratingCount }; // ✅ include it here
  } catch (error) {
    console.error('Error fetching reviews/ratings:', error.stack);
    return { reviews: [], ratings: [], averageRating: 0, ratingCount: 0 };
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

  try {
    const { averageRating, ratingCount, reviews , ratings} = await fetchRatingsAndReviews();
    console.log(`Fetched ${reviews.length} reviews and ${ratings.length} ratings with average rating ${averageRating}`);
    
    const pageUrl = 'https://licneemuch.space';
 const metaTitle = 'LIC Neemuch: Life Insurance & Pension Plans in Madhya Pradesh';
    const metaDescription =
      `Get life insurance & pension plans in LIC Neemuch, Manasa, Mandsaur (Madhya Pradesh) with Jitendra Patidar. Call +91 7987235207 Rated 4.8/5 by 16 clients.`;
    
   const metaImage = 'https://d12uvtgcxr5qif.cloudfront.net/images/react_2025-06-12_4bd13d82-4fba-4a8e-8b2f-3c4d66b9f463.webp';
    const logoImage = 'https://d12uvtgcxr5qif.cloudfront.net/images/html_2025-06-12_5bc78c6a-1a4b-4908-a854-356cce5ac68f.webp';
    const metaKeywords =
      'LIC Neemuch, Jitendra Patidar, life insurance Neemuch, term plans, pension plans, child plans, ULIPs, financial planning Madhya Pradesh, LIC India, insurance agent Neemuch';



const faqData = [
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-1-en`,
    name: 'What insurance plans are available at LIC Neemuch?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'We offer term insurance, pension plans, child plans, ULIPs, and micro-insurance like Jeevan Dhara. Visit our services page for details.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-1-hi`,
    name: 'एलआईसी नीमच में कौन सी बीमा योजनाएं उपलब्ध हैं?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'हम टर्म बीमा, पेंशन योजनाएं, चाइल्ड प्लान, यूलिप, और सूक्ष्म बीमा जैसे जीवन धारा प्रदान करते हैं। विवरण के लिए हमारी सेवाएं पेज पर जाएं।'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-2-en`,
    name: 'How can I contact LIC Neemuch customer care?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Reach our LIC Neemuch customer care at +917987235207, WhatsApp the same number, or email licneemuch343@licindia.com. For 24x7 support, call LIC’s toll-free number +911125750500.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-2-hi`,
    name: 'एलआईसी नीमच ग्राहक सेवा से कैसे संपर्क करें?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'हमारे एलआईसी नीमच ग्राहक सेवा से +917987235207 पर संपर्क करें, उसी नंबर पर व्हाट्सएप करें, या licneemuch343@licindia.com पर ईमेल करें। 24x7 सहायता के लिए, एलआईसी के टोल-फ्री नंबर +911125750500 पर कॉल करें।'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-3-en`,
    name: 'What is the LIC Neemuch branch address?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Our branch is at Vikas Nagar, Scheme No. 14-3, Neemuch Chawni, Neemuch, Madhya Pradesh 458441. Visit us or call +917987235207.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-3-hi`,
    name: 'एलआईसी नीमच शाखा का पता क्या है?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'हमारी शाखा विकास नगर, स्कीम नंबर 14-3, नीमच चावनी, नीमच, मध्य प्रदेश 458441 में है। हमसे मिलें या +917987235207 पर कॉल करें।'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-4-en`,
    name: 'What is the LIC Neemuch branch code?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'The LIC Neemuch branch code is 343. Use this for policy-related queries.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-4-hi`,
    name: 'एलआईसी नीमच शाखा कोड क्या है?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'एलआईसी नीमच शाखा कोड 343 है। पॉलिसी-संबंधी प्रश्नों के लिए इसका उपयोग करें।'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-5-en`,
    name: 'How can I contact the LIC Divisional Office from Neemuch?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Contact the LIC Indore Divisional Office at +917312523511 or email bo_31c@licindia.com. It’s 140 km from Neemuch.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-5-hi`,
    name: 'नीमच से एलआईसी डिवीजनल कार्यालय से कैसे संपर्क करें?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'एलआईसी इंदौर डिवीजनल कार्यालय से +917312523511 पर संपर्क करें या bo_31c@licindia.com पर ईमेल करें। यह नीमच से 140 किमी दूर है।'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-6-en`,
    name: 'What is LIC’s toll-free customer care number?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'LIC’s 24x7 toll-free customer care number is +911125750500. For local support, use our LIC Neemuch number +917987235207.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-6-hi`,
    name: 'एलआईसी का टोल-फ्री ग्राहक सेवा नंबर क्या है?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'एलआईसी का 24x7 टोल-फ्री ग्राहक सेवा नंबर +911125750500 है। स्थानीय सहायता के लिए, हमारे एलआईसी नीमच नंबर +917987235207 का उपयोग करें।'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-7-en`,
    name: 'How can I find LIC Neemuch near me?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Search for LIC Neemuch near me to find our branch at Vikas Nagar, Neemuch Chawni. We’re near Kileshwar Temple and open Monday to Saturday, 10 AM to 5 PM.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-7-hi`,
    name: 'एलआईसी नीमच मेरे पास कैसे ढूंढें?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'एलआईसी नीमच मेरे पास खोजें और हमारी शाखा विकास नगर, नीमच चावनी में ढूंढें। हम किलेश्वर मंदिर के पास हैं और सोमवार से शनिवार, सुबह 10 बजे से शाम 5 बजे तक खुले हैं।'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-8-en`,
    name: 'What is the LIC Neemuch claim settlement ratio?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Our claim settlement ratio is 98.62% (FY 2020-21), reflecting our reliability.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-8-hi`,
    name: 'एलआईसी नीमच का दावा निपटान अनुपात क्या है?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'हमारा दावा निपटान अनुपात 98.62% (वित्त वर्ष 2020-21) है, जो हमारी विश्वसनीयता को दर्शाता है।'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-9-en`,
    name: 'How can I pay premiums at LIC Neemuch?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Pay premiums online at licindia.in or visit our LIC Neemuch branch at Vikas Nagar. Call +917987235207 for assistance.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-9-hi`,
    name: 'एलआईसी नीमच में प्रीमियम कैसे भुगतान करें?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'प्रीमियम ऑनलाइन licindia.in पर भुगतान करें या विकास नगर में हमारी एलआईसी नीमच शाखा पर आएं। सहायता के लिए +917987235207 पर कॉल करें।'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-10-en`,
    name: 'Who is the LIC Neemuch branch manager?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'For managerial queries, contact Jitendra Patidar, our Development Officer, at +917987235207 or email licneemuch343@licindia.com.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-10-hi`,
    name: 'एलआईसी नीमच शाखा प्रबंधक कौन है?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'प्रबंधकीय प्रश्नों के लिए, हमारे डेवलपमेंट ऑफिसर जितेंद्र पाटीदार से +917987235207 पर संपर्क करें या licneemuch343@licindia.com पर ईमेल करें।'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-11-en`,
    name: 'Can I join LIC Neemuch as an agent?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Yes, become an LIC agent with LIC Neemuch. Contact Jitendra Patidar at +917987235207 or visit our join as agent page for details on training and benefits.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-11-hi`,
    name: 'क्या मैं एलआईसी नीमच में एजेंट के रूप में शामिल हो सकता हूँ?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'हां, एलआईसी नीमच के साथ एलआईसी एजेंट बनें। जितेंद्र पाटीदार से +917987235207 पर संपर्क करें या प्रशिक्षण और लाभों के विवरण के लिए हमारी एजेंट के रूप में शामिल हों पेज पर जाएं।'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-12-en`,
    name: 'What is the Bima Sakhi Yojana at LIC Neemuch?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'The Bima Sakhi Yojana empowers women to become LIC agents, offering financial independence. Learn more at our Bima Sakhi page or call +917987235207.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-12-hi`,
    name: 'एलआईसी नीमच में बीमा सखी योजना क्या है?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'बीमा सखी योजना महिलाओं को एलआईसी एजेंट बनने के लिए सशक्त बनाती है, जो वित्तीय स्वतंत्रता प्रदान करती है। अधिक जानकारी के लिए हमारी बीमा सखी पेज पर जाएं या +917987235207 पर कॉल करें।'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-13-en`,
    name: 'How do I file a claim with LIC Neemuch?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Submit your claim at our LIC Neemuch branch at Vikas Nagar or online via licindia.in. Call +917987235207 for guidance.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-13-hi`,
    name: 'एलआईसी नीमच के साथ दावा कैसे दर्ज करें?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'अपने दावे को विकास नगर में हमारी एलआईसी नीमच शाखा पर या ऑनलाइन licindia.in के माध्यम से जमा करें। मार्गदर्शन के लिए +917987235207 पर कॉल करें।'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-14-en`,
    name: 'What are the office hours of LIC Neemuch?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Our office at Vikas Nagar, Neemuch is open Monday to Saturday, 10 AM to 5 PM. Call +917987235207 for holiday schedules.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-14-hi`,
    name: 'एलआईसी नीमच के कार्यालय समय क्या हैं?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'विकास नगर, नीमच में हमारा कार्यालय सोमवार से शनिवार, सुबह 10 बजे से शाम 5 बजे तक खुला रहता है। अवकाश अनुसूची के लिए +917987235207 पर कॉल करें।'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-15-en`,
    name: 'Does LIC Neemuch offer online premium payment?',
    inLanguage: 'en-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Yes, pay premiums online at licindia.in. For help, visit our Neemuch branch or call +917987235207.'
    }
  },
  {
    '@type': 'Question',
    '@id': `${pageUrl}#faq-15-hi`,
    name: 'क्या एलआईसी नीमच ऑनलाइन प्रीमियम भुगतान प्रदान करता है?',
    inLanguage: 'hi-IN',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'हां, licindia.in पर प्रीमियम ऑनलाइन भुगतान करें। सहायता के लिए, हमारी नीमच शाखा पर आएं या +917987235207 पर कॉल करें।'
    }
  }
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': `${pageUrl}#business`,
      name: 'LIC Neemuch',
      description: 'LIC Neemuch is a trusted life insurance and pension planning office under LIC India. Led by Development Officer Jitendra Patidar, the branch serves Neemuch, Manasa, and Mandsaur with expert policy guidance.',
      url: pageUrl,
      logo: metaImage,
      image: metaImage,
      telephone: '+917987235207',
      email: 'licneemuch343@licindia.com',
      sameAs: [
        'https://licindia.in',
        'https://www.google.com/maps/place/LIC+Neemuch'
      ],
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Vikas Nagar, Scheme No. 14-3, Neemuch Chawni',
        addressLocality: 'Neemuch',
        addressRegion: 'Madhya Pradesh',
        postalCode: '458441',
        addressCountry: 'IN'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 24.4716,
        longitude: 74.8742
      },
      openingHoursSpecification: [
        'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
      ].map(day => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: day,
        opens: '10:00',
        closes: '17:00'
      })),
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+917987235207',
        contactType: 'customer support',
        areaServed: ['IN'],
        availableLanguage: ['en', 'hi']
      },
      areaServed: {
        '@type': 'Place',
        name: 'Neemuch, Manasa, Mandsaur, Madhya Pradesh'
      },
      makesOffer: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Life Insurance Plans',
            serviceType: 'LIC Term Insurance, Whole Life Plans, Endowment Policies',
            provider: { '@id': `${pageUrl}#business` }
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pension Planning',
            serviceType: 'LIC Jeevan Akshay, Annuity, Retirement Plans',
            provider: { '@id': `${pageUrl}#business` }
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Child Plans & ULIPs',
            serviceType: 'LIC Jeevan Tarun, ULIPs, Child Education Insurance',
            provider: { '@id': `${pageUrl}#business` }
          }
        }
      ],
      employee: {
        '@type': 'Person',
        name: 'Jitendra Patidar',
        jobTitle: 'Development Officer',
        worksFor: {
          '@id': `${pageUrl}#business`
        },
        telephone: '+917987235207',
        email: 'licneemuch343@licindia.com'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        '@id': `${pageUrl}#aggregate-rating`,
        ratingValue: averageRating.toString(),
        reviewCount: ratings.length.toString(),
        bestRating: '5',
        worstRating: '1'
      },
      review: reviews.map((review) => ({
        '@type': 'Review',
        '@id': `${pageUrl}#review-${crypto.MD5(review.author + review.datePublished).toString()}`,
        url: `${pageUrl}/reviews#${crypto.MD5(review.author + review.datePublished).toString()}`,
        author: {
          '@type': 'Person',
          name: escapeHTML(review.author)
        },
        datePublished: review.datePublished,
        reviewBody: escapeHTML(review.quote),
        inLanguage: review.language,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating.toString(),
          bestRating: '5',
          worstRating: '1'
        }
      }))
    },
    {
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faqpage`,
      inLanguage: 'en-IN',
      name: 'Frequently Asked Questions About LIC Neemuch',
      mainEntity: faqData
    }
  ]
};



const htmlContent = `
 <header class="header" role="banner" itemscope itemtype="https://schema.org/WPHeader">
    <nav class="navbar" aria-label="Main navigation">
      <div class="navbar-brand">
        <a href="/" class="nav-logo" aria-label="LIC Neemuch Homepage" itemprop="url">
          <img src="${logoImage}" alt="LIC Neemuch Branch Logo" class="logo-img" width="44" height="44" loading="eager" itemprop="logo">
          <span lang="en" class="lang-visible" itemprop="name">LIC Neemuch</span>
          <span lang="hi" class="lang-hidden" itemprop="name">एलआईसी नीमच</span>
        </a>
        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span lang="en" class="lang-visible nav-toggle-icon">☰</span>
          <span lang="hi" class="lang-hidden nav-toggle-icon">☰</span>
        </button>
      </div>
      <div class="nav-menu" id="nav-menu">
        <a href="/" class="nav-link active" aria-current="page">
          <span lang="en" class="lang-visible">Home</span>
          <span lang="hi" class="lang-hidden">होम</span>
        </a>
        <a href="/about" class="nav-link">
          <span lang="en" class="lang-visible">About</span>
          <span lang="hi" class="lang-hidden">हमारे बारे में</span>
        </a>
        <a href="/faqs" class="nav-link">
          <span lang="en" class="lang-visible">LIC FAQs</span>
          <span lang="hi" class="lang-hidden">एलआईसी प्रश्न</span>
        </a>
        <a href="/reviews" class="nav-link">
          <span lang="en" class="lang-visible">Reviews</span>
          <span lang="hi" class="lang-hidden">समीक्षाएँ</span>
        </a>
        <a href="/join" class="nav-link">
          <span lang="en" class="lang-visible">Join as Agent</span>
          <span lang="hi" class="lang-hidden">एजेंट के रूप में शामिल हों</span>
        </a>
        <a href="/services" class="nav-link">
          <span lang="en" class="lang-visible">Services</span>
          <span lang="hi" class="lang-hidden">सेवाएँ</span>
        </a>
        <a href="/bimasakhi" class="nav-link">
          <span lang="en" class="lang-visible">Bima Sakhi Yojana</span>
          <span lang="hi" class="lang-hidden">बीमा सखी योजना</span>
        </a>
      </div>
      <div class="lang-toggle" aria-label="Language toggle">
        <button class="lang-btn active" data-lang="en" aria-label="Switch to English">English</button>
        <button class="lang-btn" data-lang="hi" aria-label="Switch to Hindi">हिन्दी</button>
      </div>
    </nav>
    <div class="hero-section" aria-labelledby="hero-title" itemscope itemtype="https://schema.org/WebPageElement">
      <div class="hero-content">
        <h1 id="hero-title">
          <span lang="en" class="lang-visible">Trusted Life Insurance Solutions at LIC Neemuch (Madhya Pradesh)</span>
          <span lang="hi" class="lang-hidden">एलआईसी नीमच (मध्य प्रदेश) में विश्वसनीय जीवन बीमा समाधान</span>
        </h1>
        <p class="hero-subtitle" lang="en" class="lang-visible">
          Under the expert guidance of <span class="highlight">Jitendra Patidar</span>, LIC Neemuch provides life insurance and financial planning to over <strong>50,000 policyholders</strong>. Located at <span class="highlight">Vikas Nagar, Neemuch (Madhya Pradesh)</span>, we offer personalized plans for families in <span class="highlight">Neemuch, Manasa, and Mandsaur</span>.
        </p>
        <p class="hero-subtitle" lang="hi" class="lang-hidden">
          <span class="highlight">जितेंद्र पाटीदार</span> के विशेषज्ञ मार्गदर्शन में, एलआईसी नीमच <strong>50,000+ पॉलिसीधारकों</strong> को जीवन बीमा और वित्तीय योजना प्रदान करता है। <span class="highlight">विकास नगर, नीमच (मध्य प्रदेश)</span> में स्थित, हम <span class="highlight">नीमच, मनासा और मंदसौर</span> के परिवारों के लिए अनुकूलित योजनाएं प्रदान करते हैं।
        </p>
        ${
          Number(ratingCount) > 0 && Number(averageRating) >= 1
            ? `
        <div class="hero-rating" aria-label="Average rating ${averageRating} out of 5 based on ${ratingCount} reviews">
          <span class="stars" aria-hidden="true">
            ${typeof renderStars === 'function' ? renderStars(averageRating) : 'renderStars not found'}
          </span>
          <span class="rating-text">${averageRating}/5 (${ratingCount} reviews)</span>
        </div>
        `
            : ''
        }
        <div class="hero-cta">
          <a href="tel:+917987235207" class="cta-button">
            <span lang="en" class="lang-visible">Call Now</span>
            <span lang="hi" class="lang-hidden">अभी कॉल करें</span>
          </a>
          <a href="/services" class="cta-button secondary">
            <span lang="en" class="lang-visible">Explore Plans</span>
            <span lang="hi" class="lang-hidden">योजनाएं देखें</span>
          </a>
          <a href="https://wa.me/917987235207" target="_blank" rel="noopener noreferrer" class="cta-button secondary">
            <span lang="en" class="lang-visible">WhatsApp Chat</span>
            <span lang="hi" class="lang-hidden">व्हाट्सएप चैट</span>
          </a>
        </div>
      </div>
      <div class="hero-image">
        <img src="${metaImage}" alt="Jitendra Patidar at LIC Neemuch Branch Office" loading="eager" width="500" height="333" onerror="this.src='https://via.placeholder.com/500x333?text=Image+Not+Found';" itemprop="image">
      </div>
    </div>
  </header>
  <div class="container">
    <aside class="sidebar" aria-label="Section navigation">
      <button class="sidebar-toggle" aria-label="Toggle sidebar" aria-expanded="true">
        <span lang="en" class="lang-visible sidebar-toggle-icon">☰</span>
        <span lang="hi" class="lang-hidden sidebar-toggle-icon">☰</span>
      </button>
      <nav class="sidebar-nav" aria-label="Section links">
        <a href="#welcome" class="sidebar-link">
          <span lang="en" class="lang-visible">Welcome</span>
          <span lang="hi" class="lang-hidden">स्वागत</span>
        </a>
        <a href="#why-choose" class="sidebar-link">
          <span lang="en" class="lang-visible">Why Choose Us</span>
          <span lang="hi" class="lang-hidden">हमें क्यों चुनें</span>
        </a>
        <a href="#about" class="sidebar-link">
          <span lang="en" class="lang-visible">About</span>
          <span lang="hi" class="lang-hidden">हमारे बारे में</span>
        </a>
        <a href="#jitendra" class="sidebar-link">
          <span lang="en" class="lang-visible">Jitendra</span>
          <span lang="hi" class="lang-hidden">जितेंद्र</span>
        </a>
        <a href="#services" class="sidebar-link">
          <span lang="en" class="lang-visible">Services</span>
          <span lang="hi" class="lang-hidden">सेवाएँ</span>
        </a>
        <a href="#architecture" class="sidebar-link">
          <span lang="en" class="lang-visible">Architecture</span>
          <span lang="hi" class="lang-hidden">संरचना</span>
        </a>
        <a href="#team" class="sidebar-link">
          <span lang="en" class="lang-visible">Team</span>
          <span lang="hi" class="lang-hidden">टीम</span>
        </a>
        <a href="#market" class="sidebar-link">
          <span lang="en" class="lang-visible">Market</span>
          <span lang="hi" class="lang-hidden">बाजार</span>
        </a>
        <a href="#social" class="sidebar-link">
          <span lang="en" class="lang-visible">Social</span>
          <span lang="hi" class="lang-hidden">सामाजिक</span>
        </a>
        <a href="#testimonials" class="sidebar-link">
          <span lang="en" class="lang-visible">Testimonials</span>
          <span lang="hi" class="lang-hidden">प्रशंसापत्र</span>
        </a>
        <a href="#calculator" class="sidebar-link">
          <span lang="en" class="lang-visible">Calculator</span>
          <span lang="hi" class="lang-hidden">कैलकुलेटर</span>
        </a>
        <a href="#resources" class="sidebar-link">
          <span lang="en" class="lang-visible">Resources</span>
          <span lang="hi" class="lang-hidden">संसाधन</span>
        </a>
        <a href="#contact" class="sidebar-link">
          <span lang="en" class="lang-visible">Contact</span>
          <span lang="hi" class="lang-hidden">संपर्क</span>
        </a>
        <a href="#faq" class="sidebar-link">
          <span lang="en" class="lang-visible">FAQs</span>
          <span lang="hi" class="lang-hidden">प्रश्न</span>
        </a>
      </nav>
    </aside>
    <main role="main" itemscope itemtype="https://schema.org/LocalBusiness">
      <meta itemprop="name" content="LIC Neemuch">
      <meta itemprop="url" content="https://licneemuch.space">
      <meta itemprop="address" content="Vikas Nagar, Neemuch, MP 458441">
      <meta itemprop="telephone" content="+917987235207">
      <meta itemprop="email" content="licneemuch343@licindia.com">
      <meta itemprop="openingHours" content="Mo-Sa 10:00-17:00">
      <article aria-labelledby="welcome-heading">
        <section class="section welcome-section" id="welcome" aria-labelledby="welcome-heading">
          <h2 id="welcome-heading">
            <span lang="en" class="lang-visible">Welcome to LIC Neemuch – Your Partner in Financial Security</span>
            <span lang="hi" class="lang-hidden">एलआईसी नीमच में आपका स्वागत है – वित्तीय सुरक्षा में आपका साथी</span>
          </h2>
          <p lang="en" class="lang-visible">
            At LIC Neemuch, we are committed to safeguarding the financial future of families in <span class="highlight">Neemuch, Madhya Pradesh</span>. Led by <span class="highlight">Jitendra Patidar</span>, our branch serves over <strong>50,000 policyholders</strong> across <span class="highlight">Neemuch, Manasa, Singoli, and Mandsaur</span>. For <strong>life insurance, pension plans, or child plans</strong>, visit us at <span class="highlight">Vikas Nagar, Neemuch (Madhya Pradesh)</span>. Contact us at <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.
          </p>
          <p lang="hi" class="lang-hidden">
            एलआईसी नीमच में, हम <span class="highlight">नीमच, मध्य प्रदेश</span> के परिवारों के वित्तीय भविष्य की रक्षा के लिए प्रतिबद्ध हैं। <span class="highlight">जितेंद्र पाटीदार</span> के नेतृत्व में, हमारी शाखा <span class="highlight">नीमच, मनासा, सिंगोली, और मंदसौर</span> में <strong>50,000+ पॉलिसीधारकों</strong> की सेवा करती है। <strong>जीवन बीमा, पेंशन योजनाएं, या चाइल्ड प्लान</strong> के लिए, <span class="highlight">विकास नगर, नीमच</span> पर आएं। <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें।
          </p>
          <p lang="en" class="lang-visible">
            Choose LIC Neemuch for your insurance needs due to our high claim settlement ratio of <strong>98.62%</strong> (FY 2020-21), over <strong>150 trained agents</strong>, complimentary consultations, and extensive rural outreach in areas like <span class="highlight">Sarwaniya Maharaj</span> and <span class="highlight">Ratangarh</span>.
          </p>
          <p lang="hi" class="lang-hidden">
            <strong>98.62%</strong> (वित्त वर्ष 2020-21) के उच्च दावा निपटान अनुपात, <strong>150+ प्रशिक्षित एजेंट</strong>, मुफ्त परामर्श, और <span class="highlight">सरवानिया महाराज</span> और <span class="highlight">रतनगढ़</span> जैसे क्षेत्रों में व्यापक ग्रामीण पहुंच के कारण एलआईसी नीमच चुनें।
          </p>
          <a href="/services" class="cta-button secondary">
            <span lang="en" class="lang-visible">Discover Plans</span>
            <span lang="hi" class="lang-hidden">योजनाएं देखें</span>
          </a>
        </section>
      </article>
      <article aria-labelledby="why-choose-heading">
        <section class="section why-choose-section" id="why-choose" aria-labelledby="why-choose-heading">
          <h2 id="why-choose-heading">
            <span lang="en" class="lang-visible">Why LIC Neemuch Stands Out</span>
            <span lang="hi" class="lang-hidden">एलआईसी नीमच क्यों अलग है</span>
          </h2>
          <p lang="en" class="lang-visible">
            LIC Neemuch combines local expertise with the trust of <strong>Life Insurance Corporation of India</strong>. As a leading insurance provider in <span class="highlight">Madhya Pradesh</span>, we prioritize financial security for residents of <span class="highlight">Neemuch Chawni, Manasa, and beyond</span>.
          </p>
          <p lang="hi" class="lang-hidden">
            एलआईसी नीमच स्थानीय विशेषज्ञता को <strong>भारतीय जीवन बीमा निगम</strong> के विश्वास के साथ जोड़ता है। <span class="highlight">मध्य प्रदेश</span> में अग्रणी बीमा प्रदाता के रूप में, हम <span class="highlight">नीमच चावनी, मनासा और उससे आगे</span> के निवासियों के लिए वित्तीय सुरक्षा को प्राथमिकता देते हैं।
          </p>
          <div class="card-grid">
            <div class="card">
              <h3>
                <span lang="en" class="lang-visible">Experienced Leadership</span>
                <span lang="hi" class="lang-hidden">अनुभवी नेतृत्व</span>
              </h3>
              <p lang="en" class="lang-visible">
                Guided by <span class="highlight">Jitendra Patidar</span>, a Chairman’s Club member with over <strong>10 years of expertise</strong>.
              </p>
              <p lang="hi" class="lang-hidden">
                <span class="highlight">जितेंद्र पाटीदार</span> के मार्गदर्शन में, जो <strong>10+ वर्षों की विशेषज्ञता</strong> के साथ चेयरमैन क्लब सदस्य हैं।
              </p>
            </div>
            <div class="card">
              <h3>
                <span lang="en" class="lang-visible">Strong Local Presence</span>
                <span lang="hi" class="lang-hidden">मजबूत स्थानीय उपस्थिति</span>
              </h3>
              <p lang="en" class="lang-visible">
                Located at <span class="highlight">Vikas Nagar, Neemuch (Madhya Pradesh)</span>, serving <span class="highlight">Manasa, Singoli, and Mandsaur</span>.
              </p>
              <p lang="hi" class="lang-hidden">
                <span class="highlight">विकास नगर, नीमच</span> में स्थित, <span class="highlight">मनासा, सिंगोली और मंदसौर</span> की सेवा।
              </p>
            </div>
            <div class="card">
              <h3>
                <span lang="en" class="lang-visible">Exceptional Support</span>
                <span lang="hi" class="lang-hidden">उत्कृष्ट समर्थन</span>
              </h3>
              <p lang="en" class="lang-visible">
                Contact our customer care at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> or LIC’s <strong>24x7 toll-free line</strong> at <a href="tel:+911125750500" class="content-link">+91 1125750500</a>.
              </p>
              <p lang="hi" class="lang-hidden">
                हमारी ग्राहक सेवा से <a href="tel:+917987235207" class="content-link">+91 7987235207</a> या एलआईसी की <strong>24x7 टोल-फ्री लाइन</strong> <a href="tel:+911125750500" class="content-link">+91 1125750500</a> पर संपर्क करें।
              </p>
            </div>
          </div>
          <a href="/about" class="cta-button secondary">
            <span lang="en" class="lang-visible">About Us</span>
            <span lang="hi" class="lang-hidden">हमारे बारे में</span>
          </a>
        </section>
      </article>
      <article aria-labelledby="about-heading">
        <section class="section about-section" id="about" aria-labelledby="about-heading">
          <h2 id="about-heading">
            <span lang="en" class="lang-visible">About LIC Neemuch – A Legacy of Trust</span>
            <span lang="hi" class="lang-hidden">एलआईसी नीमच के बारे में – विश्वास की विरासत</span>
          </h2>
          <p lang="en" class="lang-visible">
            Part of <strong>Life Insurance Corporation of India</strong> (est. 1956), LIC Neemuch is a pillar of financial stability in <span class="highlight">Madhya Pradesh</span>. With assets worth <strong>₹54.52 trillion</strong> (FY25), our branch (code 343) at <span class="highlight">Vikas Nagar, Neemuch, MP 458441</span> serves over <strong>50,000 policyholders</strong>. Reach us at <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a> or <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.
          </p>
          <p lang="hi" class="lang-hidden">
            <strong>भारतीय जीवन बीमा निगम</strong> (स्थापना 1956) का हिस्सा, एलआईसी नीमच <span class="highlight">मध्य प्रदेश</span> में वित्तीय स्थिरता का एक स्तंभ है। <strong>₹54.52 लाख करोड़</strong> (FY25) की संपत्ति के साथ, हमारी शाखा (कोड 343) <span class="highlight">विकास नगर, नीमच, एमपी 458441</span> में <strong>50,000+ पॉलिसीधारकों</strong> की सेवा करती है। <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a> या <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें।
          </p>
          <p lang="en" class="lang-visible">
            For decades, we’ve fostered trust through insurance camps during <span class="highlight">Navratri</span> and <span class="highlight">Diwali</span>, extending outreach to rural areas like <span class="highlight">Sarwaniya Maharaj</span> and <span class="highlight">Ratangarh</span> near <span class="highlight">Kileshwar Temple</span>.
          </p>
          <p lang="hi" class="lang-hidden">
            दशकों से, हमने <span class="highlight">नवरात्रि</span> और <span class="highlight">दिवाली</span> के दौरान बीमा शिविरों के माध्यम से विश्वास को बढ़ावा दिया है, जो <span class="highlight">किलेश्वर मंदिर</span> के पास <span class="highlight">सरवानिया महाराज</span> और <span class="highlight">रतनगढ़</span> जैसे ग्रामीण क्षेत्रों तक फैली है।
          </p>
          <table class="data-table table-responsive">
            <caption>
              <span lang="en" class="lang-visible">LIC Neemuch Branch Overview</span>
              <span lang="hi" class="lang-hidden">एलआईसी नीमच शाखा अवलोकन</span>
            </caption>
            <thead>
              <tr>
                <th>
                  <span lang="en" class="lang-visible">Detail</span>
                  <span lang="hi" class="lang-hidden">विवरण</span>
                </th>
                <th>
                  <span lang="en" class="lang-visible">Information</span>
                  <span lang="hi" class="lang-hidden">जानकारी</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span lang="en" class="lang-visible">Branch Code</span>
                  <span lang="hi" class="lang-hidden">शाखा कोड</span>
                </td>
                <td>343</td>
              </tr>
              <tr>
                <td>
                  <span lang="en" class="lang-visible">Address</span>
                  <span lang="hi" class="lang-hidden">पता</span>
                </td>
                <td>
                  <span lang="en" class="lang-visible">Vikas Nagar, Neemuch (Madhya Pradesh) 458441</span>
                  <span lang="hi" class="lang-hidden">विकास नगर, नीमच (मध्य प्रदेश) 458441</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span lang="en" class="lang-visible">Phone</span>
                  <span lang="hi" class="lang-hidden">फोन</span>
                </td>
                <td>+91 7987235207</td>
              </tr>
              <tr>
                <td>
                  <span lang="en" class="lang-visible">Email</span>
                  <span lang="hi" class="lang-hidden">ईमेल</span>
                </td>
                <td>licneemuch343@licindia.com</td>
              </tr>
              <tr>
                <td>
                  <span lang="en" class="lang-visible">Divisional Office</span>
                  <span lang="hi" class="lang-hidden">डिवीजनल कार्यालय</span>
                </td>
                <td>
                  <span lang="en" class="lang-visible">Indore, +91 731 252 3511, bo_31c@licindia.com</span>
                  <span lang="hi" class="lang-hidden">इंदौर, +91 731 252 3511, bo_31c@licindia.com</span>
                </td>
              </tr>
            </tbody>
          </table>
          <a href="/faqs" class="cta-button secondary">
            <span lang="en" class="lang-visible">Find Answers</span>
            <span lang="hi" class="lang-hidden">उत्तर ढूंढें</span>
          </a>
        </section>
      </article>
      <article aria-labelledby="jitendra-heading">
        <section class="section jitendra-section" id="jitendra" aria-labelledby="jitendra-heading">
          <h2 id="jitendra-heading">
            <span lang="en" class="lang-visible">Meet Jitendra Patidar – Expert Advisor</span>
            <span lang="hi" class="lang-hidden">जितेंद्र पाटीदार से मिलें – विशेषज्ञ सलाहकार</span>
          </h2>
          <p lang="en" class="lang-visible">
            <span class="highlight">Jitendra Patidar</span>, Development Officer at LIC Neemuch, offers over <strong>10 years of experience</strong> in insurance planning. A <strong>Chairman’s Club member</strong> (2020), he specializes in <strong>term insurance, pension plans, and child plans</strong>. Schedule a consultation at <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.
          </p>
          <p lang="hi" class="lang-hidden">
            <span class="highlight">जितेंद्र पाटीदार</span>, एलआईसी नीमच के डेवलपमेंट ऑफिसर, बीमा योजना में <strong>10 वर्षों से अधिक का अनुभव</strong> प्रदान करते हैं। <strong>चेयरमैन क्लब सदस्य</strong> (2020) के रूप में, वे <strong>टर्म बीमा, पेंशन योजनाएं, और चाइल्ड प्लान</strong> में विशेषज्ञ हैं। <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर परामर्श बुक करें।
          </p>
          <div class="card-grid">
            <div class="card">
              <p>
                <strong>
                  <span lang="en" class="lang-visible">Notable Achievements:</span>
                  <span lang="hi" class="lang-hidden">उल्लेखनीय उपलब्धियां:</span>
                </strong>
                <span lang="en" class="lang-visible">Top Development Officer Award (2022), Rural Outreach Excellence (2023).</span>
                <span lang="hi" class="lang-hidden">शीर्ष डेवलपमेंट ऑफिसर पुरस्कार (2022), ग्रामीण आउटरीच उत्कृष्टता (2023)।</span>
              </p>
            </div>
            <div class="card">
              <p>
                <strong>
                  <span lang="en" class="lang-visible">Specialized Expertise:</span>
                  <span lang="hi" class="lang-hidden">विशेषज्ञता:</span>
                </strong>
                <span lang="en" class="lang-visible">Term Plans (New Jeevan Amar), Pension Plans (Jeevan Shanti).</span>
                <span lang="hi" class="lang-hidden">टर्म योजनाएं (न्यू जीवन अमर), पेंशन योजनाएं (जीवन शांति)।</span>
              </p>
            </div>
          </div>
          <div class="timeline">
            <p>
              <strong>
                <span lang="en" class="lang-visible">Career Milestones:</span>
                <span lang="hi" class="lang-hidden">कैरियर मील के पत्थर:</span>
              </strong>
            </p>
            <ol>
              <li>
                <span>2015:</span>
                <span lang="en" class="lang-visible">Joined LIC as Development Officer</span>
                <span lang="hi" class="lang-hidden">एलआईसी में डेवलपमेंट ऑफिसर के रूप में शामिल हुए</span>
              </li>
              <li>
                <span>2020:</span>
                <span lang="en" class="lang-visible">Earned Chairman’s Club Membership</span>
                <span lang="hi" class="lang-hidden">चेयरमैन क्लब सदस्यता प्राप्त की</span>
              </li>
              <li>
                <span>2023:</span>
                <span lang="en" class="lang-visible">Led 50+ rural insurance campaigns</span>
                <span lang="hi" class="lang-hidden">50+ ग्रामीण बीमा अभियान का नेतृत्व किया</span>
              </li>
            </ol>
          </div>
          <a href="/about#jitendra" class="cta-button secondary">
            <span lang="en" class="lang-visible">More About Jitendra</span>
            <span lang="hi" class="lang-hidden">जितेंद्र के बारे में और जानें</span>
          </a>
        </section>
      </article>
      <article aria-labelledby="services-heading">
        <section class="section services-section" id="services" aria-labelledby="services-heading">
          <h2 id="services-heading">
            <span lang="en" class="lang-visible">Comprehensive Insurance Plans</span>
            <span lang="hi" class="lang-hidden">व्यापक बीमा योजनाएं</span>
          </h2>
          <p lang="en" class="lang-visible">
            LIC Neemuch branch offers a range of <strong>insurance plans</strong> for residents of <span class="highlight">Neemuch Chawni, Manasa, and Mandsaur</span>. From <strong>term insurance</strong> to <strong>ULIPs</strong>, our plans meet diverse financial goals. Contact us at <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.
          </p>
          <p lang="hi" class="lang-hidden">
            एलआईसी नीमच शाखा <span class="highlight">नीमच चावनी, मनासा और मंदसौर</span> के निवासियों के लिए <strong>बीमा योजनाओं</strong> की श्रृंखला प्रदान करती है। <strong>टर्म बीमा</strong> से लेकर <strong>यूलिप</strong> तक, हमारी योजनाएं विभिन्न वित्तीय लक्ष्यों को पूरा करती हैं। <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें।
          </p>
          <table class="data-table table-responsive">
            <caption>
              <span lang="en" class="lang-visible">Popular LIC Plans at Neemuch Branch</span>
              <span lang="hi" class="lang-hidden">नीमच शाखा में लोकप्रिय एलआईसी योजनाएं</span>
            </caption>
            <thead>
              <tr>
                <th>
                  <span lang="en" class="lang-visible">Plan Type</span>
                  <span lang="hi" class="lang-hidden">योजना प्रकार</span>
                </th>
                <th>
                  <span lang="en" class="lang-visible">Key Plans</span>
                  <span lang="hi" class="lang-hidden">मुख्य योजनाएं</span>
                </th>
                <th>
                  <span lang="en" class="lang-visible">Benefits</span>
                  <span lang="hi" class="lang-hidden">लाभ</span>
                </th>
                <th>
                  <span lang="en" class="lang-visible">Premium Range</span>
                  <span lang="hi" class="lang-hidden">प्रीमियम रेंज</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span lang="en" class="lang-visible">Term Insurance</span>
                  <span lang="hi" class="lang-hidden">टर्म बीमा</span>
                </td>
                <td>
                  <span lang="en" class="lang-visible">New Jeevan Amar, Saral Jeevan</span>
                  <span lang="hi" class="lang-hidden">न्यू जीवन अमर, सरल जीवन</span>
                </td>
                <td>
                  <span lang="en" class="lang-visible">High coverage, affordable premiums</span>
                  <span lang="hi" class="lang-hidden">उच्च कवरेज, किफायती प्रीमियम</span>
                </td>
                <td>₹5,000–₹50,000</td>
              </tr>
              <tr>
                <td>
                  <span lang="en" class="lang-visible">Pension Plans</span>
                  <span lang="hi" class="lang-hidden">पेंशन योजनाएं</span>
                </td>
                <td>
                  <span lang="en" class="lang-visible">Jeevan Shanti, Saral Pension</span>
                  <span lang="hi" class="lang-hidden">जीवन शांति, सरल पेंशन</span>
                </td>
                <td>
                  <span lang="en" class="lang-visible">Guaranteed lifelong income</span>
                  <span lang="hi" class="lang-hidden">गारंटीकृत आजीवन आय</span>
                </td>
                <td>₹20,000–₹2 lakh</td>
              </tr>
              <tr>
                <td>
                  <span lang="en" class="lang-visible">Child Plans</span>
                  <span lang="hi" class="lang-hidden">चाइल्ड प्लान</span>
                </td>
                <td>
                  <span lang="en" class="lang-visible">Jeevan Tarun, Money Back</span>
                  <span lang="hi" class="lang-hidden">जीवन तरुण, मनी बैक</span>
                </td>
                <td>
                  <span lang="en" class="lang-visible">Funds for education and future</span>
                  <span lang="hi" class="lang-hidden">शिक्षा और भविष्य के लिए धन</span>
                </td>
                <td>₹15,000–₹1 lakh</td>
              </tr>
              <tr>
                <td>
                  <span lang="en" class="lang-visible">ULIPs</span>
                  <span lang="hi" class="lang-hidden">यूलिप</span>
                </td>
                <td>
                  <span lang="en" class="lang-visible">SIIP, Pension Plus</span>
                  <span lang="hi" class="lang-hidden">एसआईआईपी, पेंशन प्लस</span>
                </td>
                <td>
                  <span lang="en" class="lang-visible">Market-linked returns</span>
                  <span lang="hi" class="lang-hidden">बाजार से जुड़े रिटर्न</span>
                </td>
                <td>₹25,000–₹5 lakh</td>
              </tr>
              <tr>
                <td>
                  <span lang="en" class="lang-visible">Micro-Insurance</span>
                  <span lang="hi" class="lang-hidden">सूक्ष्म बीमा</span>
                </td>
                <td>
                  <span lang="en" class="lang-visible">Jeevan Dhara</span>
                  <span lang="hi" class="lang-hidden">जीवन धारा</span>
                </td>
                <td>
                  <span lang="en" class="lang-visible">Low-cost coverage for all</span>
                  <span lang="hi" class="lang-hidden">सभी के लिए कम लागत वाला कवरेज</span>
                </td>
                <td>₹1,000–₹10,000</td>
              </tr>
            </tbody>
          </table>
          <a href="/services" class="cta-button secondary">
            <span lang="en" class="lang-visible">Explore All Plans</span>
            <span lang="hi" class="lang-hidden">सभी योजनाएं देखें</span>
          </a>
        </section>
      </article>
      <article aria-labelledby="architecture-heading">
        <section class="section architecture-section" id="architecture" aria-labelledby="architecture-heading">
          <h2 id="architecture-heading">
            <span lang="en" class="lang-visible">Our Service Model</span>
            <span lang="hi" class="lang-hidden">हमारा सेवा मॉडल</span>
          </h2>
          <p lang="en" class="lang-visible">
            LIC Neemuch delivers seamless insurance services through a <strong>client-centric approach</strong>, using <strong>digital tools</strong>, a robust agent network, and rural outreach programs across <span class="highlight">Neemuch and Mandsaur</span>.
          </p>
          <p lang="hi" class="lang-hidden">
            एलआईसी नीमच <strong>ग्राहक-केंद्रित दृष्टिकोण</strong> के माध्यम से निर्बाध बीमा सेवाएं प्रदान करता है, जो <strong>डिजिटल उपकरणों</strong>, मजबूत एजेंट नेटवर्क, और <span class="highlight">नीमच और मंदसौर</span> में ग्रामीण आउटरीच कार्यक्रमों का लाभ उठाता है।
          </p>
          <p>
            <strong>
              <span lang="en" class="lang-visible">Client Onboarding Process:</span>
              <span lang="hi" class="lang-hidden">ग्राहक शामिल करने की प्रक्रिया:</span>
            </strong>
          </p>
          <pre class="diagram">
+--------------------+
| <span lang="en" class="lang-visible">Client Inquiry</span><span lang="hi" class="lang-hidden">ग्राहक पूछताछ</span>     |
+---------+----------+
          |
          v
+--------------------+
| <span lang="en" class="lang-visible">Consultation</span><span lang="hi" class="lang-hidden">परामर्श</span>       |
| <span lang="en" class="lang-visible">(Jitendra/Agents)</span><span lang="hi" class="lang-hidden">(जितेंद्र/एजेंट)</span>  |
+---------+----------+
          |
          v
+--------------------+
| <span lang="en" class="lang-visible">Plan Selection</span><span lang="hi" class="lang-hidden">योजना चयन</span>     |
| <span lang="en" class="lang-visible">(Term, Pension)</span><span lang="hi" class="lang-hidden">(टर्म, पेंशन)</span>    |
+---------+----------+
          |
          v
+--------------------+
| <span lang="en" class="lang-visible">Policy Issuance</span><span lang="hi" class="lang-hidden">पॉलिसी जारी करना</span>    |
| <span lang="en" class="lang-visible">(Digital Portal)</span><span lang="hi" class="lang-hidden">(डिजिटल पोर्टल)</span>   |
+--------------------+
          </pre>
          <p>
            <strong>
              <span lang="en" class="lang-visible">Efficient Claims Processing:</span>
              <span lang="hi" class="lang-hidden">कुशल दावा प्रसंस्करण:</span>
            </strong>
          </p>
          <pre class="diagram">
+--------------------+
| <span lang="en" class="lang-visible">Claim Submission</span><span lang="hi" class="lang-hidden">दावा जमा करना</span>   |
+---------+----------+
          |
          v
+--------------------+
| <span lang="en" class="lang-visible">Verification</span><span lang="hi" class="lang-hidden">सत्यापन</span>       |
| <span lang="en" class="lang-visible">(Documents)</span><span lang="hi" class="lang-hidden">(दस्तावेज़)</span>        |
+---------+----------+
          |
          v
+--------------------+
| <span lang="en" class="lang-visible">Approval</span><span lang="hi" class="lang-hidden">अनुमोदन</span>           |
| <span lang="en" class="lang-visible">(98.62% Success)</span><span lang="hi" class="lang-hidden">(98.62% सफलता)</span>   |
+---------+----------+
          |
          v
+--------------------+
| <span lang="en" class="lang-visible">Payout</span><span lang="hi" class="lang-hidden">भुगतान</span>             |
| <span lang="en" class="lang-visible">(Bank Transfer)</span><span lang="hi" class="lang-hidden">(बैंक हस्तांतरण)</span>    |
+--------------------+
          </pre>
          <p>
            <strong>
              <span lang="en" class="lang-visible">Rural Outreach Initiatives:</span>
              <span lang="hi" class="lang-hidden">ग्रामीण आउटरीच पहल:</span>
            </strong>
          </p>
          <pre class="diagram">
+--------------------+
| <span lang="en" class="lang-visible">Awareness Camps</span><span lang="hi" class="lang-hidden">जागरूकता शिविर</span>    |
| <span lang="en" class="lang-visible">(Sarwaniya, Ratangarh)</span><span lang="hi" class="lang-hidden">(सरवानिया, रतनगढ़)</span> |
+---------+----------+
          |
          v
+--------------------+
| <span lang="en" class="lang-visible">Micro-Insurance</span><span lang="hi" class="lang-hidden">सूक्ष्म बीमा</span>    |
| <span lang="en" class="lang-visible">(Jeevan Dhara)</span><span lang="hi" class="lang-hidden">(जीवन धारा)</span>     |
+---------+----------+
          |
          v
+--------------------+
| <span lang="en" class="lang-visible">Enrollments</span><span lang="hi" class="lang-hidden">नामांकन</span>        |
| <span lang="en" class="lang-visible">(PMJBY, PMSBY)</span><span lang="hi" class="lang-hidden">(पीएमजेबीवाय, पीएमएसबीवाय)</span>     |
+--------------------+
          </pre>
        </section>
      </article>
      <article aria-labelledby="team-heading">
        <section class="section team-section" id="team" aria-labelledby="team-heading">
          <h2 id="team-heading">
            <span lang="en" class="lang-visible">Our Dedicated Team</span>
            <span lang="hi" class="lang-hidden">हमारी समर्पित टीम</span>
          </h2>
          <p lang="en" class="lang-visible">
            With over <strong>150 agents</strong>, <strong>10 supervisors</strong>, and <strong>5 support staff</strong>, LIC Neemuch ensures exceptional service under <span class="highlight">Jitendra Patidar’s</span> leadership.
          </p>
          <p lang="hi" class="lang-hidden">
            <strong>150+ एजेंट</strong>, <strong>10 सुपरवाइज़र</strong>, और <strong>5 सहायक कर्मचारी</strong> के साथ, एलआईसी नीमच <span class="highlight">जितेंद्र पाटीदार</span> के नेतृत्व में उत्कृष्ट सेवा सुनिश्चित करता है।
          </p>
          <div class="card-grid">
            <div class="card">
              <p>
                <strong>
                  <span lang="en" class="lang-visible">Agents:</span>
                  <span lang="hi" class="lang-hidden">एजेंट:</span>
                </strong>
                <span lang="en" class="lang-visible">150+ trained professionals</span>
                <span lang="hi" class="lang-hidden">150+ प्रशिक्षित पेशेवर</span>
              </p>
            </div>
            <div class="card">
              <p>
                <strong>
                  <span lang="en" class="lang-visible">Supervisors:</span>
                  <span lang="hi" class="lang-hidden">सुपरवाइज़र:</span>
                </strong>
                <span lang="en" class="lang-visible">10 senior experts</span>
                <span lang="hi" class="lang-hidden">10 वरिष्ठ विशेषज्ञ</span>
              </p>
            </div>
            <div class="card">
              <p>
                <strong>
                  <span lang="en" class="lang-visible">Support:</span>
                  <span lang="hi" class="lang-hidden">समर्थन:</span>
                </strong>
                <span lang="en" class="lang-visible">5 dedicated staff</span>
                <span lang="hi" class="lang-hidden">5 समर्पित कर्मचारी</span>
              </p>
            </div>
          </div>
        </section>
      </article>
      <article aria-labelledby="market-heading">
        <section class="section market-section" id="market" aria-labelledby="market-heading">
          <h2 id="market-heading">
            <span lang="en" class="lang-visible">LIC’s Market Dominance</span>
            <span lang="hi" class="lang-hidden">एलआईसी की बाजार प्रभुत्व</span>
          </h2>
          <p lang="en" class="lang-visible">
            <strong>LIC of India</strong> leads with a <strong>61.2% premium share</strong> and <strong>₹54.52 trillion</strong> in assets (FY25). LIC Neemuch strengthens this legacy with local expertise.
          </p>
          <p lang="hi" class="lang-hidden">
            <strong>भारतीय जीवन बीमा निगम</strong> <strong>61.2% प्रीमियम हिस्सेदारी</strong> और <strong>₹54.52 लाख करोड़</strong> की संपत्ति (FY25) के साथ अग्रणी है। एलआईसी नीमच स्थानीय विशेषज्ञता के साथ इस विरासत को मजबूत करता है।
          </p>
          <table class="data-table table-responsive">
            <caption>
              <span lang="en" class="lang-visible">LIC Market Statistics (FY25)</span>
              <span lang="hi" class="lang-hidden">एलआईसी बाजार आंकड़े (FY25)</span>
            </caption>
            <thead>
              <tr>
                <th>
                  <span lang="en" class="lang-visible">Metric</span>
                  <span lang="hi" class="lang-hidden">मेट्रिक</span>
                </th>
                <th>
                  <span lang="en" class="lang-visible">Value</span>
                  <span lang="hi" class="lang-hidden">मूल्य</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span lang="en" class="lang-visible">Premium Share</span>
                  <span lang="hi" class="lang-hidden">प्रीमियम हिस्सेदारी</span>
                </td>
                <td>61.2%</td>
              </tr>
              <tr>
                <td>
                  <span lang="en" class="lang-visible">Assets</span>
                  <span lang="hi" class="lang-hidden">संपत्ति</span>
                </td>
                <td>₹54.52 trillion</td>
              </tr>
              <tr>
                <td>
                  <span lang="en" class="lang-visible">Agents</span>
                  <span lang="hi" class="lang-hidden">एजेंट</span>
                </td>
                <td>13.8 lakh</td>
              </tr>
              <tr>
                <td>
                  <span lang="en" class="lang-visible">Branches</span>
                  <span lang="hi" class="lang-hidden">शाखाएं</span>
                </td>
                <td>2,048</td>
              </tr>
            </tbody>
          </table>
        </section>
      </article>
      <article aria-labelledby="social-heading">
        <section class="section social-section" id="social" aria-labelledby="social-heading">
          <h2 id="social-heading">
            <span lang="en" class="lang-visible">Community Engagement</span>
            <span lang="hi" class="lang-hidden">सामुदायिक सहभागिता</span>
          </h2>
          <p lang="en" class="lang-visible">
            LIC Neemuch champions <strong>education, healthcare, and financial inclusion</strong> in rural areas like <span class="highlight">Sarwaniya Maharaj</span> near <span class="highlight">Gandhi Sagar Dam</span>.
          </p>
          <p lang="hi" class="lang-hidden">
            एलआईसी नीमच <span class="highlight">गांधी सागर बांध</span> के पास <span class="highlight">सरवानिया महाराज</span> जैसे ग्रामीण क्षेत्रों में <strong>शिक्षा, स्वास्थ्य, और वित्तीय समावेशन</strong> को बढ़ावा देता है।
          </p>
          <ul class="benefits-list">
            <li>
              <strong>
                <span lang="en" class="lang-visible">75+ Insurance Literacy Camps</span>
                <span lang="hi" class="lang-hidden">75+ बीमा साक्षरता शिविर</span>
              </strong>
              <span lang="en" class="lang-visible">in 2023 for rural communities.</span>
              <span lang="hi" class="lang-hidden">2023 में ग्रामीण समुदायों के लिए।</span>
            </li>
            <li>
              <strong>
                <span lang="en" class="lang-visible">10,000+ Enrollments</span>
                <span lang="hi" class="lang-hidden">10,000+ नामांकन</span>
              </strong>
              <span lang="en" class="lang-visible">in PMJBY and PMSBY.</span>
              <span lang="hi" class="lang-hidden">पीएमजेबीवाय और पीएमएसबीवाय में।</span>
            </li>
            <li>
              <strong>
                <span lang="en" class="lang-visible">₹5 Lakh Donated</span>
                <span lang="hi" class="lang-hidden">₹5 लाख दान</span>
              </strong>
              <span lang="en" class="lang-visible">to healthcare initiatives in 2022.</span>
              <span lang="hi" class="lang-hidden">2022 में स्वास्थ्य पहलों के लिए।</span>
            </li>
          </ul>
        </section>
      </article>
      <article aria-labelledby="testimonials-heading">
        <section class="section testimonials-section" id="testimonials" aria-labelledby="testimonials-heading">
          <h2 id="testimonials-heading">
            <span lang="en" class="lang-visible">Client Testimonials</span>
            <span lang="hi" class="lang-hidden">ग्राहक प्रशंसापत्र</span>
          </h2>
          <p lang="en" class="lang-visible">
            Discover why residents trust LIC Neemuch. Share your experience at <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.
          </p>
          <p lang="hi" class="lang-hidden">
            जानें क्यों निवासी एलआईसी नीमच पर भरोसा करते हैं। अपने अनुभव को <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर साझा करें।
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
                }>
                  <div class="review-stars" aria-hidden="true">${renderStars(review.rating)}</div>
                  <blockquote class="review-body">${review.quote}</blockquote>
                  <cite class="review-author">
                    <span>${review.author}</span>
                  </cite>
                  <span class="review-date">${new Date(review.datePublished).toLocaleDateString()}</span>
                  <span class="review-language" lang="${review.language}">
                    ${review.language === 'hi-IN' ? 'हिन्दी' : 'English'}
                  </span>
                </div>
              `
              )
              .join('')}
          </div>
          <a href="/reviews" class="cta-button secondary">
            <span lang="en" class="lang-visible">View All Testimonials</span>
            <span lang="hi" class="lang-hidden">सभी प्रशंसापत्र देखें</span>
          </a>
          `
              : `
          <p lang="en" class="lang-visible">No testimonials yet. Be the first to share your experience!</p>
          <p lang="hi" class="lang-hidden">अभी तक कोई समीक्षा नहीं। अपनी अनुभव साझा करने वाले पहले व्यक्ति बनें!</p>
          `
          }
        </section>
      </article>
      <article aria-labelledby="calculator-heading">
        <section class="section calculator-section" id="calculator" aria-labelledby="calculator-heading">
          <h2 id="calculator-heading">
            <span lang="en" class="lang-visible">Calculate Your Premium</span>
            <span lang="hi" class="lang-hidden">अपना प्रीमियम गणना करें</span>
          </h2>
          <p lang="en" class="lang-visible">
            Use our <strong>premium calculator</strong> to estimate insurance costs. For accurate quotes, contact us at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> or visit <span class="highlight">Vikas Nagar</span>.
          </p>
          <p lang="hi" class="lang-hidden">
            हमारा <strong>प्रीमियम कैलकुलेटर</strong> बीमा लागत का अनुमान लगाने के लिए उपयोग करें। सटीक उद्धरणों के लिए, <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें या <span class="highlight">विकास नगर</span> पर आएं।
          </p>
          <div class="calculator-form">
            <label for="age">
              <span lang="en" class="lang-visible">Age:</span>
              <span lang="hi" class="lang-hidden">आयु:</span>
            </label>
            <input type="number" id="age" min="18" max="80" placeholder="Enter age" required>
            <label for="plan-type">
              <span lang="en" class="lang-visible">Plan Type:</span>
              <span lang="hi" class="lang-hidden">योजना प्रकार:</span>
            </label>
            <select id="plan-type" required>
              <option value="term">
                <span lang="en" class="lang-visible">Term Insurance</span>
                <span lang="hi" class="lang-hidden">टर्म बीमा</span>
              </option>
              <option value="pension">
                <span lang="en" class="lang-visible">Pension Plan</span>
                <span lang="hi" class="lang-hidden">पेंशन योजना</span>
              </option>
              <option value="child">
                <span lang="en" class="lang-visible">Child Plan</span>
                <span lang="hi" class="lang-hidden">चाइल्ड प्लान</span>
              </option>
              <option value="ulips">
                <span lang="en" class="lang-visible">ULIP</span>
                <span lang="hi" class="lang-hidden">यूलिप</span>
              </option>
              <option value="micro">
                <span lang="en" class="lang-visible">Micro-Insurance</span>
                <span lang="hi" class="lang-hidden">सूक्ष्म बीमा</span>
              </option>
            </select>
            <label for="sum-assured">
              <span lang="en" class="lang-visible">Sum Assured (₹):</span>
              <span lang="hi" class="lang-hidden">बीमित राशि (₹):</span>
            </label>
            <input type="number" id="sum-assured" min="100000" placeholder="Enter sum assured" required>
            <button type="button" class="cta-button" onclick="calculatePremium()">
              <span lang="en" class="lang-visible">Calculate</span>
              <span lang="hi" class="lang-hidden">गणना करें</span>
            </button>
            <p id="calc-result" aria-live="polite"></p>
          </div>
        </section>
      </article>
      <article aria-labelledby="resources-heading">
        <section class="section resources-section" id="resources" aria-labelledby="resources-heading">
          <h2 id="resources-heading">
            <span lang="en" class="lang-visible">LIC Resources</span>
            <span lang="hi" class="lang-hidden">एलआईसी संसाधन</span>
          </h2>
          <p lang="en" class="lang-visible">
            Access LIC’s online services through LIC Neemuch to pay premiums or check policy status. For assistance, call <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.
          </p>
          <p lang="hi" class="lang-hidden">
            एलआईसी नीमच के माध्यम से एलआईसी की ऑनलाइन सेवाओं तक पहुंचें, प्रीमियम भुगतान करें या पॉलिसी स्थिति जांचें। सहायता के लिए, <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर कॉल करें।
          </p>
          <ul class="benefits-list">
            <li>
              <a href="https://licindia.in/Online-Payment" target="_blank" rel="noopener noreferrer" class="content-link">
                <span lang="en" class="lang-visible">Pay Premium Online</span>
                <span lang="hi" class="lang-hidden">प्रीमियम ऑनलाइन भुगतान करें</span>
              </a>
            </li>
            <li>
              <a href="https://licindia.in/Customer-Services" target="_blank" rel="noopener noreferrer" class="content-link">
                <span lang="en" class="lang-visible">Check Policy Status</span>
                <span lang="hi" class="lang-hidden">पॉलिसी स्थिति जांचें</span>
              </a>
            </li>
            <li>
              <a href="/services" class="content-link">
                <span lang="en" class="lang-visible">Explore Local Plans</span>
                <span lang="hi" class="lang-hidden">स्थानीय योजनाएं देखें</span>
              </a>
            </li>
            <li>
              <span lang="en" class="lang-visible">Contact our branch at </span>
              <span lang="hi" class="lang-hidden">हमारी शाखा से संपर्क करें </span>
              <a href="tel:+917987235207" class="content-link">+91 7987235207</a>
            </li>
          </ul>
          <a href="/faqs" class="cta-button secondary">
            <span lang="en" class="lang-visible">More Resources</span>
            <span lang="hi" class="lang-hidden">और संसाधन</span>
          </a>
        </section>
      </article>
      <article aria-labelledby="contact-heading">
        <section class="section contact-section" id="contact" aria-labelledby="contact-heading">
          <h2 id="contact-heading">
            <span lang="en" class="lang-visible">Get in Touch</span>
            <span lang="hi" class="lang-hidden">संपर्क करें</span>
          </h2>
          <p lang="en" class="lang-visible">
            Connect with LIC Neemuch for personalized insurance solutions. Our team is available via phone, WhatsApp, email, or at <span class="highlight">Vikas Nagar, Neemuch</span>. Search <span class="highlight">LIC Neemuch near me</span> to locate us.
          </p>
          <p lang="hi" class="lang-hidden">
            एलआईसी नीमच से विशेष बीमा समाधानों के लिए संपर्क करें। हमारी टीम फोन, व्हाट्सएप, ईमेल, या <span class="highlight">विकास नगर, नीमच</span> पर उपलब्ध है। हमें ढूंढने के लिए <span class="highlight">एलआईसी नीमच मेरे पास</span> खोजें।
          </p>
          <div class="contact-info" itemscope itemtype="https://schema.org/ContactPoint">
            <div class="contact-details">
              <p>
                📍 <strong>
                  <span lang="en" class="lang-visible">Address:</span>
                  <span lang="hi" class="lang-hidden">पता:</span>
                </strong>
                <span itemprop="address">
                  <span lang="en" class="lang-visible">Vikas Nagar, Neemuch, MP 458441</span>
                  <span lang="hi" class="lang-hidden">विकास नगर, नीमच, एमपी 458441</span>
                </span>
              </p>
              <p>
                📞 <strong>
                  <span lang="en" class="lang-visible">Phone:</span>
                  <span lang="hi" class="lang-hidden">फोन:</span>
                </strong>
                <a href="tel:+917987235207" class="content-link" aria-label="Call LIC Neemuch" itemprop="telephone">+91 7987235207</a>
              </p>
              <p>
                📧 <strong>
                  <span lang="en" class="lang-visible">Email:</span>
                  <span lang="hi" class="lang-hidden">ईमेल:</span>
                </strong>
                <a href="mailto:licneemuch343@licindia.com" class="content-link" aria-label="Email LIC Neemuch" itemprop="email">licneemuch343@licindia.com</a>
              </p>
              <p>
                📱 <strong>
                  <span lang="en" class="lang-visible">WhatsApp:</span>
                  <span lang="hi" class="lang-hidden">व्हाट्सएप:</span>
                </strong>
                <a href="https://wa.me/917987235207" class="content-link" target="_blank" rel="noopener noreferrer" aria-label="Chat with LIC Neemuch">+91 7987235207</a>
              </p>
              <p>
                🏢 <strong>
                  <span lang="en" class="lang-visible">Branch Code:</span>
                  <span lang="hi" class="lang-hidden">शाखा कोड:</span>
                </strong>
                343
              </p>
              <p>
                ⏰ <strong>
                  <span lang="en" class="lang-visible">Office Hours:</span>
                  <span lang="hi" class="lang-hidden">कार्यालय समय:</span>
                </strong>
                <span lang="en" class="lang-visible">Monday to Saturday, 10 AM to 5 PM</span>
                <span lang="hi" class="lang-hidden">सोमवार से शनिवार, सुबह 10 बजे से शाम 5 बजे</span>
              </p>
            </div>
            <div class="contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.392!2d74.8742!3d24.4716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e7d6c8c0f0c1%3A0x9f0b0f0c0c0c0c0c!2sLIC%20Neemuch%20Branch!5e0!3m2!1sen!2sin!4v1698765432100"
                width="100%"
                height="300"
                style="border:0; border-radius: 10px;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                aria-label="Map of LIC Neemuch Branch, Vikas Nagar"
              ></iframe>
            </div>
          </div>
          <p lang="en" class="lang-visible">
            For urgent assistance, reach LIC’s <strong>24x7 toll-free support</strong> at <a href="tel:+911125750500" class="content-link">+91 1125750500</a>. For local support, visit us near <span class="highlight">Neemuch Railway Station</span>.
          </p>
          <p lang="hi" class="lang-hidden">
            तत्काल सहायता के लिए, एलआईसी के <strong>24x7 टोल-फ्री समर्थन</strong> <a href="tel:+911125750500" class="content-link">+91 1125750500</a> पर संपर्क करें। स्थानीय सहायता के लिए, <span class="highlight">नीमच रेलवे स्टेशन</span> के पास हमसे मिलें।
          </p>
          <p lang="en" class="lang-visible">
            For advanced queries, contact the <strong>LIC Indore Divisional Office</strong> at <a href="tel:+917312523511" class="content-link">+91 731 252 3511</a> or <a href="mailto:bo_31c@licindia.com" class="content-link">bo_31c@licindia.com</a>.
          </p>
          <p lang="hi" class="lang-hidden">
            उन्नत प्रश्नों के लिए, <strong>एलआईसी इंदौर डिवीजनल कार्यालय</strong> से <a href="tel:+917312523511" class="content-link">+91 731 252 3511</a> या <a href="mailto:bo_31c@licindia.com" class="content-link">bo_31c@licindia.com</a> पर संपर्क करें।
          </p>
          <p lang="en" class="lang-visible">
            Find us by searching <span class="highlight">LIC Neemuch near me</span>. Our branch is near <span class="highlight">Kileshwar Temple</span>, accessible by auto-rickshaw or taxi.
          </p>
          <p lang="hi" class="lang-hidden">
            <span class="highlight">एलआईसी नीमच मेरे पास</span> खोजकर हमें ढूंढें। हमारी शाखा <span class="highlight">किलेश्वर मंदिर</span> के पास है, ऑटो-रिक्शा या टैक्सी से पहुंचें।
          </p>
          <p lang="en" class="lang-visible">
            Book a <strong>free consultation</strong> to explore insurance options at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> or <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a>.
          </p>
          <p lang="hi" class="lang-hidden">
            बीमा विकल्पों का पता लगाने के लिए <strong>मुफ्त परामर्श</strong> बुक करें: <a href="tel:+917987235207" class="content-link">+91 7987235207</a> या <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a>।
          </p>
          <div class="social-share" aria-label="Share LIC Neemuch Page">
            <a href="https://x.com/intent/post?url=${encodeURIComponent(pageUrl)}&text=${metaTitle}" target="_blank" rel="noopener noreferrer">
              <span lang="en" class="lang-visible">Post on X</span>
              <span lang="hi" class="lang-hidden">एक्स पर पोस्ट करें</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.1 9.1 0 0 1-2.89 1.1A4.52 4.52 0 0 0 16.5 0c-2.53 0-4.5 2.17-4.5 4.84 0 .38.04.75.12 1.1A12.9 12.9 0 0 1 3 1.67a5.06 5.06 0 0 0-.61 2.44c0 1.69.84 3.18 2.13 4.06a4.47 4.47 0 0 1-2.05-.6v.06c0 2.36 1.64 4.33 3.82 4.78a4.4 4.4 0 0 1-2.04.08 4.49 4.49 0 0 0 4.2 3.13A9.05 9.05 0 0 1 1 20.08 12.73 12.73 0 0 0 8 22c7.55 0 11.68-6.49 11.68-12.11 0-.19 0-.39-.01-.58A8.3 8.3 0 0 0 23 3z"/>
              </svg>
            </a>
                      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}" target="_blank" rel="noopener noreferrer">
                <span lang="en" class="lang-visible">Share on Facebook</span>
                <span lang="hi" class="lang-hidden">फेसबुक पर साझा करें</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.41c0-2.5 1.5-3.89 3.8-3.89 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}" target="_blank" rel="noopener noreferrer">
                <span lang="en" class="lang-visible">Share on LinkedIn</span>
                <span lang="hi" class="lang-hidden">लिंक्डइन पर साझा करें</span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.91 1.65-1.87 3.39-1.87 3.62 0 4.29 2.38 4.29 5.48v6.28zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06s.92-2.06 2.06-2.06 2.06.92 2.06 2.06-.92 2.06-2.06 2.06zM6.91 20.45H3.77V9h3.14v11.45zM22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z"/>
                </svg>
              </a>
            </div>
          </section>
        </article>
        <article aria-labelledby="faq-heading">
          <section class="section faq-section" id="faq" aria-labelledby="faq-heading">
            <h2 id="faq-heading">
              <span lang="en" class="lang-visible">Frequently Asked Questions</span>
              <span lang="hi" class="lang-hidden">अक्सर पूछे जाने वाले प्रश्न</span>
            </h2>
            <p lang="en" class="lang-visible">
              Find answers to common queries about LIC policies and services. For more details, contact us at <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.
            </p>
            <p lang="hi" class="lang-hidden">
              एलआईसी पॉलिसियों और सेवाओं के बारे में सामान्य प्रश्नों के उत्तर खोजें। अधिक जानकारी के लिए, <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें।
            </p>
            <div class="faq-list">
              <details class="faq-item">
                <summary>
                  <span lang="en" class="lang-visible">What types of insurance plans does LIC Neemuch offer?</span>
                  <span lang="hi" class="lang-hidden">एलआईसी नीमच कौन से बीमा योजनाएं प्रदान करता है?</span>
                </summary>
                <p lang="en" class="lang-visible">
                  We offer term insurance, pension plans, child plans, ULIPs, and micro-insurance tailored for residents of <span class="highlight">Neemuch, Manasa, and Mandsaur</span>.
                </p>
                <p lang="hi" class="lang-hidden">
                  हम <span class="highlight">नीमच, मनासा और मंदसौर</span> के निवासियों के लिए टर्म बीमा, पेंशन योजनाएं, चाइल्ड प्लान, यूलिप और सूक्ष्म बीमा प्रदान करते हैं।
                </p>
              </details>
              <details class="faq-item">
                <summary>
                  <span lang="en" class="lang-visible">How can I contact LIC Neemuch?</span>
                  <span lang="hi" class="lang-hidden">मैं एलआईसी नीमच से कैसे संपर्क कर सकता हूँ?</span>
                </summary>
                <p lang="en" class="lang-visible">
                  Reach us at <a href="tel:+917987235207" class="content-link">+91 7987235207</a>, <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a>, or visit <span class="highlight">Vikas Nagar, Neemuch</span>.
                </p>
                <p lang="hi" class="lang-hidden">
                  हमसे <a href="tel:+917987235207" class="content-link">+91 7987235207</a>, <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a> पर संपर्क करें या <span class="highlight">विकास नगर, नीमच</span> पर आएं।
                </p>
              </details>
              <details class="faq-item">
                <summary>
                  <span lang="en" class="lang-visible">What is the claim settlement ratio of LIC?</span>
                  <span lang="hi" class="lang-hidden">एलआईसी का दावा निपटान अनुपात क्या है?</span>
                </summary>
                <p lang="en" class="lang-visible">
                  LIC has a claim settlement ratio of <strong>98.62%</strong> (FY 2020-21), ensuring reliable payouts for policyholders.
                </p>
                <p lang="hi" class="lang-hidden">
                  एलआईसी का दावा निपटान अनुपात <strong>98.62%</strong> (वित्त वर्ष 2020-21) है, जो पॉलिसीधारकों के लिए विश्वसनीय भुगतान सुनिश्चित करता है।
                </p>
              </details>
              <details class="faq-item">
                <summary>
                  <span lang="en" class="lang-visible">Can I pay my premium online?</span>
                  <span lang="hi" class="lang-hidden">क्या मैं अपना प्रीमियम ऑनलाइन भुगतान कर सकता हूँ?</span>
                </summary>
                <p lang="en" class="lang-visible">
                  Yes, pay premiums online at <a href="https://licindia.in/Online-Payment" target="_blank" rel="noopener noreferrer" class="content-link">licindia.in/Online-Payment</a> or contact us for assistance.
                </p>
                <p lang="hi" class="lang-hidden">
                  हां, प्रीमियम ऑनलाइन <a href="https://licindia.in/Online-Payment" target="_blank" rel="noopener noreferrer" class="content-link">licindia.in/Online-Payment</a> पर भुगतान करें या सहायता के लिए हमसे संपर्क करें।
                </p>
              </details>
              <details class="faq-item">
                <summary>
                  <span lang="en" class="lang-visible">How can I join as an LIC agent?</span>
                  <span lang="hi" class="lang-hidden">मैं एलआईसी एजेंट के रूप में कैसे शामिल हो सकता हूँ?</span>
                </summary>
                <p lang="en" class="lang-visible">
                  Contact <span class="highlight">Jitendra Patidar</span> at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> to learn about agent opportunities and training.
                </p>
                <p lang="hi" class="lang-hidden">
                  एजेंट अवसरों और प्रशिक्षण के बारे में जानने के लिए <span class="highlight">जितेंद्र पाटीदार</span> से <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें।
                </p>
              </details>
            </div>
            <a href="/faqs" class="cta-button secondary">
              <span lang="en" class="lang-visible">View All FAQs</span>
              <span lang="hi" class="lang-hidden">सभी प्रश्न देखें</span>
            </a>
          </section>
        </article>
      </main>
      <footer class="footer" role="contentinfo" itemscope itemtype="https://schema.org/WPFooter">
        <div class="footer-content">
          <div class="footer-brand">
            <a href="/" class="footer-logo" aria-label="LIC Neemuch Homepage" itemprop="url">
              <img src="${logoImage}" alt="LIC Neemuch Branch Logo" class="logo-img" width="44" height="44" loading="lazy" itemprop="logo">
              <span lang="en" class="lang-visible" itemprop="name">LIC Neemuch</span>
              <span lang="hi" class="lang-hidden" itemprop="name">एलआईसी नीमच</span>
            </a>
            <p lang="en" class="lang-visible">
              Trusted by over <strong>50,000 policyholders</strong> in <span class="highlight">Neemuch, Manasa, and Mandsaur</span>. Visit us at <span class="highlight">Vikas Nagar, Neemuch, MP 458441</span>.
            </p>
            <p lang="hi" class="lang-hidden">
              <span class="highlight">नीमच, मनासा और मंदसौर</span> में <strong>50,000+ पॉलिसीधारकों</strong> द्वारा विश्वसनीय। <span class="highlight">विकास नगर, नीमच, एमपी 458441</span> पर आएं।
            </p>
          </div>
          <div class="footer-links">
            <h3>
              <span lang="en" class="lang-visible">Quick Links</span>
              <span lang="hi" class="lang-hidden">त्वरित लिंक</span>
            </h3>
            <ul>
              <li>
                <a href="/about">
                  <span lang="en" class="lang-visible">About Us</span>
                  <span lang="hi" class="lang-hidden">हमारे बारे में</span>
                </a>
              </li>
              <li>
                <a href="/services">
                  <span lang="en" class="lang-visible">Services</span>
                  <span lang="hi" class="lang-hidden">सेवाएँ</span>
                </a>
              </li>
              <li>
                <a href="/faqs">
                  <span lang="en" class="lang-visible">FAQs</span>
                  <span lang="hi" class="lang-hidden">प्रश्न</span>
                </a>
              </li>
              <li>
                <a href="/join">
                  <span lang="en" class="lang-visible">Join as Agent</span>
                  <span lang="hi" class="lang-hidden">एजेंट के रूप में शामिल हों</span>
                </a>
              </li>
              <li>
                <a href="/contact">
                  <span lang="en" class="lang-visible">Contact</span>
                  <span lang="hi" class="lang-hidden">संपर्क</span>
                </a>
              </li>
            </ul>
          </div>
          <div class="footer-contact">
            <h3>
              <span lang="en" class="lang-visible">Contact Us</span>
              <span lang="hi" class="lang-hidden">हमसे संपर्क करें</span>
            </h3>
            <p>
              📍 <span lang="en" class="lang-visible">Vikas Nagar, Neemuch, MP 458441</span>
              <span lang="hi" class="lang-hidden">विकास नगर, नीमच, एमपी 458441</span>
            </p>
            <p>
              📞 <a href="tel:+917987235207" class="content-link">+91 7987235207</a>
            </p>
            <p>
              📧 <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a>
            </p>
            <p>
              📱 <a href="https://wa.me/917987235207" class="content-link" target="_blank" rel="noopener noreferrer">
                <span lang="en" class="lang-visible">WhatsApp</span>
                <span lang="hi" class="lang-hidden">व्हाट्सएप</span>
              </a>
            </p>
          </div>
          <div class="footer-social">
            <h3>
              <span lang="en" class="lang-visible">Follow Us</span>
              <span lang="hi" class="lang-hidden">हमें फॉलो करें</span>
            </h3>
            <a href="https://x.com/licneemuch" target="_blank" rel="noopener noreferrer">
              <span lang="en" class="lang-visible">X</span>
              <span lang="hi" class="lang-hidden">एक्स</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.1 9.1 0 0 1-2.89 1.1A4.52 4.52 0 0 0 16.5 0c-2.53 0-4.5 2.17-4.5 4.84 0 .38.04.75.12 1.1A12.9 12.9 0 0 1 3 1.67a5.06 5.06 0 0 0-.61 2.44c0 1.69.84 3.18 2.13 4.06a4.47 4.47 0 0 1-2.05-.6v.06c0 2.36 1.64 4.33 3.82 4.78a4.4 4.4 0 0 1-2.04.08 4.49 4.49 0 0 0 4.2 3.13A9.05 9.05 0 0 1 1 20.08 12.73 12.73 0 0 0 8 22c7.55 0 11.68-6.49 11.68-12.11 0-.19 0-.39-.01-.58A8.3 8.3 0 0 0 23 3z"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/licneemuch" target="_blank" rel="noopener noreferrer">
              <span lang="en" class="lang-visible">Facebook</span>
              <span lang="hi" class="lang-hidden">फेसबुक</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.41c0-2.5 1.5-3.89 3.8-3.89 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.89h-2.33v6.99C18.34 21.13 22 16.99 22 12z"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/licneemuch" target="_blank" rel="noopener noreferrer">
              <span lang="en" class="lang-visible">LinkedIn</span>
              <span lang="hi" class="lang-hidden">लिंक्डइन</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.91 1.65-1.87 3.39-1.87 3.62 0 4.29 2.38 4.29 5.48v6.28zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06s.92-2.06 2.06-2.06 2.06.92 2.06 2.06-.92 2.06-2.06 2.06zM6.91 20.45H3.77V9h3.14v11.45zM22 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z"/>
              </svg>
            </a>
          </div>
        </div>
        <div class="footer-bottom">
          <p lang="en" class="lang-visible">
            &copy; ${new Date().getFullYear()} LIC Neemuch. All rights reserved. Powered by <a href="https://licindia.in" target="_blank" rel="noopener noreferrer" class="content-link">Life Insurance Corporation of India</a>.
          </p>
          <p lang="hi" class="lang-hidden">
            &copy; ${new Date().getFullYear()} एलआईसी नीमच। सभी अधिकार सुरक्षित। <a href="https://licindia.in" target="_blank" rel="noopener noreferrer" class="content-link">भारतीय जीवन बीमा निगम</a> द्वारा संचालित।
          </p>
          <p lang="en" class="lang-visible">
            <a href="/privacy" class="content-link">Privacy Policy</a> | <a href="/terms" class="content-link">Terms of Service</a> | <a href="/sitemap" class="content-link">Sitemap</a>
          </p>
          <p lang="hi" class="lang-hidden">
            <a href="/privacy" class="content-link">गोपनीयता नीति</a> | <a href="/terms" class="content-link">सेवा की शर्तें</a> | <a href="/sitemap" class="content-link">साइटमैप</a>
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
        <meta name="og:type" content="website">
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
    /* Highlight class for emphasized text without SEO penalty */
.highlight {
  font-style: italic;
  color:rgb(209, 202, 244); 
  padding: 2px 4px;
  border-radius: 3px;
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
    .social-share{margin:1rem 0;display:flex;flex-wrap:wrap;gap:0.75rem;}
          .social-share a{display:inline-flex;align-items:center;justify-content:center;width:2.75rem;height:2.75rem;border-radius:50%;background:#e5e7eb;text-decoration:none;box-shadow:var(--shadow);transition:var(--transition);}
          .social-share a:hover,.social-share a:focus{background:var(--primary-color);transform:scale(1.1);outline:2px solid var(--secondary-color);outline-offset:2px;}
          .social-share svg{width:1.5rem;height:1.5rem;fill:var(--secondary-color);transition:fill 0.3s ease;}
          .social-share a:hover svg,.social-share a:focus svg{fill:#fff;}
          
          
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
          a {
            color: var(--accent-color);
            text-decoration: none;
            transition: var(--transition);
            position: relative;
            z-index: 1;
          }
          
          a:hover,
          a:focus {
            color: var(--secondary-color);
            text-decoration: none;
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
    
          .diagram {
            background: var(--card-bg);
            padding: 1rem;
            border-radius: var(--border-radius);
            border: 1px solid var(--card-border);
            font-family: 'Courier New', monospace;
            color: var(--secondary-color);
            white-space: pre;
            margin: 0.1rem;
            overflow-x: auto;
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
    
          .testimonials-container {
            margin: 2rem 0;
            padding: 1.5rem;
            background: rgba(230, 57, 70, 0.05);
            border-radius: var(--border-radius);
          }
    
          .testimonials-carousel {
            position: relative;
            overflow: hidden;
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
    
          .calculator-form {
            background: var(--card-bg);
            padding: 1rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
            display: flex;
            flex-direction: column;
            gap: 1rem;
            max-width: 500px;
            margin: auto;
          }
    
          .calculator-form label {
            font-size: 1rem;
            color: var(--text-color);
          }
    
          .calculator-form input,
          .calculator-form select {
            padding: 0.5rem;
            border: 1px solid var(--card-border);
            border-radius: var(--border-radius);
            background: var(--bg-end);
            color: var(--text-color);
            font-size: 1rem;
          }
    
          .calculator-form button {
            cursor: pointer;
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
    
            .main-nav {
              gap: 1rem;
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
    
            h2 {
              font-size: clamp(1.4rem, 3vw, 1.8rem);
            }
    
            h3 {
              font-size: clamp(0.95rem, 1.8vw, 1rem);
            }
    
            p {
              font-size: clamp(0.8rem, 1.6vw, 0.85rem);
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
              padding: 0.3rem 0.7rem;
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
      // Language Toggle Functionality
      function toggleLanguage() {
        const currentLang = localStorage.getItem('preferredLanguage') || 'hi';
        const newLang = currentLang === 'en' ? 'hi' : 'en';
        
        // Update visibility of language-specific elements
        document.querySelectorAll('[lang="en"]').forEach(el => {
          el.classList.toggle('lang-hidden', newLang !== 'en');
          el.classList.toggle('lang-visible', newLang === 'en');
        });
        document.querySelectorAll('[lang="hi"]').forEach(el => {
          el.classList.toggle('lang-hidden', newLang !== 'hi');
          el.classList.toggle('lang-visible', newLang === 'hi');
        });

        // Update language button text and data-lang attribute
        const langBtn = document.querySelector('.lang-btn');
        if (langBtn) {
          langBtn.textContent = newLang === 'en' ? 'हिन्दी' : 'English';
          langBtn.setAttribute('data-lang', newLang);
        }

        // Save language preference
        localStorage.setItem('preferredLanguage', newLang);
      }

      // Initialize language
      function initializeLanguage() {
        const savedLang = localStorage.getItem('preferredLanguage') || 'hi';
        document.querySelectorAll('[lang="en"]').forEach(el => {
          el.classList.toggle('lang-hidden', savedLang !== 'en');
          el.classList.toggle('lang-visible', savedLang === 'en');
        });
        document.querySelectorAll('[lang="hi"]').forEach(el => {
          el.classList.toggle('lang-hidden', savedLang !== 'hi');
          el.classList.toggle('lang-visible', savedLang === 'hi');
        });

        // Set initial language button text
        const langBtn = document.querySelector('.lang-btn');
        if (langBtn) {
          langBtn.textContent = savedLang === 'en' ? 'हिन्दी' : 'English';
          langBtn.setAttribute('data-lang', savedLang);
        }
      }

      // Call initializeLanguage on load
      initializeLanguage();

      // Attach language toggle event
      const langBtn = document.querySelector('.lang-btn');
      if (langBtn) {
        langBtn.addEventListener('click', toggleLanguage);
      }

      // Navbar Toggle for Mobile
      const navToggle = document.querySelector('.nav-toggle');
      const navMenu = document.querySelector('.nav-menu');
      if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
          const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
          navToggle.setAttribute('aria-expanded', !isExpanded);
          navMenu.classList.toggle('active');
        });
      }

      // Sidebar Toggle for Mobile
      const sidebarToggle = document.querySelector('.sidebar-toggle');
      const sidebarNav = document.querySelector('.sidebar-nav');
      if (sidebarToggle && sidebarNav) {
        sidebarToggle.addEventListener('click', () => {
          const isExpanded = sidebarToggle.getAttribute('aria-expanded') === 'true';
          sidebarToggle.setAttribute('aria-expanded', !isExpanded);
          sidebarNav.classList.toggle('active');
        });
      }

      // Smooth Scrolling for Anchor Links
      document.querySelectorAll('.sidebar-link, .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.querySelector('#' + targetId);
            if (targetElement) {
              targetElement.scrollIntoView({ behavior: 'smooth' });
              // Update active link
              document.querySelectorAll('.sidebar-link, .nav-link').forEach(l => l.classList.remove('active'));
              link.classList.add('active');
            } else {
              console.warn('Element with ID ' + targetId + ' not found');
            }
          }
        });
      });

      // Intersection Observer for Sidebar Active Link
      const sections = document.querySelectorAll('section[id]');
      const sidebarLinks = document.querySelectorAll('.sidebar-link');
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            sidebarLinks.forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + sectionId) {
                link.classList.add('active');
              }
            });
          }
        });
      }, observerOptions);

      sections.forEach(section => observer.observe(section));

      // FAQ Accordion
      const faqQuestions = document.querySelectorAll('.faq-question');
      faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
          const faqItem = question.parentElement;
          const faqAnswer = faqItem.querySelector('.faq-answer');
          const isActive = faqAnswer.classList.contains('active');

          // Close all FAQs
          document.querySelectorAll('.faq-answer').forEach(answer => answer.classList.remove('active'));
          document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));

          // Toggle current FAQ
          if (!isActive) {
            faqAnswer.classList.add('active');
            question.classList.add('active');
          }
        });
      });

      // Carousel
      const carousel = document.querySelector('.carousel');
      const carouselItems = document.querySelectorAll('.carousel-item');
      const carouselDots = document.querySelectorAll('.carousel-dot');
      const prevBtn = document.querySelector('.carousel-btn.prev');
      const nextBtn = document.querySelector('.carousel-btn.next');
      let currentIndex = 0;

      function updateCarousel() {
        carousel.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        carouselDots.forEach(dot => dot.classList.remove('active'));
        carouselDots[currentIndex].classList.add('active');
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          currentIndex = currentIndex > 0 ? currentIndex - 1 : carouselItems.length - 1;
          updateCarousel();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          currentIndex = currentIndex < carouselItems.length - 1 ? currentIndex + 1 : 0;
          updateCarousel();
        });
      }

      carouselDots.forEach(dot => {
        dot.addEventListener('click', () => {
          currentIndex = parseInt(dot.getAttribute('data-index'));
          updateCarousel();
        });
      });

      // Auto-slide every 5 seconds
      let autoSlide = setInterval(() => {
        currentIndex = currentIndex < carouselItems.length - 1 ? currentIndex + 1 : 0;
        updateCarousel();
      }, 5000);

      // Pause auto-slide on hover
      if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
        carousel.addEventListener('mouseleave', () => {
          autoSlide = setInterval(() => {
            currentIndex = currentIndex < carouselItems.length - 1 ? currentIndex + 1 : 0;
            updateCarousel();
          }, 5000);
        });
      }

    

      // Navbar Scroll Effect
      const navbar = document.querySelector('.navbar');
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    });

       // Premium calculator
            window.calculatePremium = function() {
              const age = parseInt(document.getElementById('age').value);
              const planType = document.getElementById('plan-type').value;
              const sumAssured = parseInt(document.getElementById('sum-assured').value);
              const result = document.getElementById('calc-result');
    
              if (!age || age < 18 || age > 80 || !sumAssured || sumAssured < 100000) {
                result.textContent = 'Please enter valid age (18–80) and sum assured (₹1,00,000+).';
                result.style.color = 'var(--primary-color)';
                return;
              }
    
              let premium = 0;
              if (planType === 'term') {
                premium = (sumAssured * 0.005) / ((80 - age) / 100);
              } else if (planType === 'pension') {
                premium = (sumAssured * 0.02) / ((80 - age) / 100);
              } else if (planType === 'child') {
                premium = (sumAssured * 0.015) / ((80 - age) / 100);
              } else if (planType === 'ulips') {
                premium = (sumAssured * 0.03) / ((80 - age) / 100);
              }
    
              result.textContent = \`Estimated Annual Premium: ₹\${Math.round(premium).toLocaleString('en-IN')}\`;
              result.style.color = 'var(--secondary-color)';
            };
          });
  </script>

      </head>
      <body>
        <div id="root">${htmlContent}</div>
      </body>
    </html>
    `;
    

    console.log('SSR HTML generated, length:', html.length);
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(html);
    console.log('SSR Response sent for / at', new Date().toISOString());
  } // <-- add this closing parenthesis for the async function
  catch (error) {
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

router.get('/hi', async (req, res) => {
  res.redirect(301, '/');
});


module.exports = router;
