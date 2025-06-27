
const express = require('express');
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
  console.log('SSR route hit for / at', new Date().toISOString());

  try {
    const { averageRating, ratingCount, reviews , ratings} = await fetchRatingsAndReviews();
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
          <span itemprop="name">LIC Neemuch</span>
        </a>
        <button class="nav-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span class="nav-toggle-icon"></span>
        </button>
      </div>
      <div class="nav-menu" id="nav-menu">
        <a href="/" class="nav-link active" aria-current="page" aria-label="Homepage">Home</a>
        <a href="/reviews" class="nav-link" aria-label="Customer Reviews">Reviews</a>
        <a href="/join" class="nav-link" aria-label="Join as LIC Agent">Join as Agent</a>
        <a href="/services" class="nav-link" aria-label="Insurance Services">Services</a>
        <a href="/about" class="nav-link" aria-label="About LIC Neemuch">About</a>
        <a href="/faqs" class="nav-link" aria-label="LIC FAQs">LIC FAQs</a>
        <a href="/bimasakhi" class="nav-link" aria-label="Bima Sakhi Yojana">Bima Sakhi Yojana</a>
      </div>
    </nav>
    <div class="hero-section" aria-labelledby="hero-title" itemscope itemtype="https://schema.org/WebPageElement">
      <div class="hero-content">
        <h1 id="hero-title" class="hero-title" lang="en">Trusted Life Insurance Solutions at LIC Neemuch (Madhya Pradesh)</h1>
        <p class="hero-subtitle" lang="en">Under the expert guidance of <span class="highlight">Jitendra Patidar</span>, LIC Neemuch provides life insurance and financial planning to over <strong>50,000 policyholders</strong>. Located at <span class="highlight">Vikas Nagar, Neemuch (Madhya Pradesh)</span>, we offer personalized plans for families in <span class="highlight">Neemuch, Manasa, and Mandsaur</span>.</p>
        <p class="hero-subtitle" lang="hi"><span class="highlight">जितेंद्र पाटीदार</span> के विशेषज्ञ मार्गदर्शन में, एलआईसी नीमच <strong>50,000+ पॉलिसीधारकों</strong> को जीवन बीमा और वित्तीय योजना प्रदान करता है। <span class="highlight">विकास नगर, नीमच</span> में स्थित, हम <span class="highlight">नीमच, मनासा और मंदसौर</span> के परिवारों के लिए अनुकूलित योजनाएं प्रदान करते हैं।</p>
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
          <a href="tel:+917987235207" class="cta-button" aria-label="Call LIC Neemuch Customer Care" itemprop="telephone">Call Now</a>
          <a href="/services" class="cta-button secondary" aria-label="Explore LIC Insurance Plans">Explore Plans</a>
          <a href="https://wa.me/917987235207" target="_blank" rel="noopener noreferrer" class="cta-button secondary" aria-label="Chat with LIC Neemuch on WhatsApp">WhatsApp Chat</a>
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
      <span class="sidebar-toggle-icon">☰</span>
    </button>
    <nav class="sidebar-nav" aria-label="Section links">
      <a href="#welcome" class="sidebar-link" aria-label="Welcome Section">Welcome</a>
      <a href="#why-choose" class="sidebar-link" aria-label="Why Choose LIC Neemuch">Why Choose Us</a>
      <a href="#about" class="sidebar-link" aria-label="About LIC Neemuch">About</a>
      <a href="#jitendra" class="sidebar-link" aria-label="Jitendra Patidar">Jitendra</a>
      <a href="#services" class="sidebar-link" aria-label="Insurance Services">Services</a>
      <a href="#architecture" class="sidebar-link" aria-label="Operational Architecture">Architecture</a>
      <a href="#team" class="sidebar-link" aria-label="Our Team">Team</a>
      <a href="#market" class="sidebar-link" aria-label="Market Presence">Market</a>
      <a href="#social" class="sidebar-link" aria-label="Social Initiatives">Social</a>
      <a href="#testimonials" class="sidebar-link" aria-label="Client Testimonials">Testimonials</a>
      <a href="#calculator" class="sidebar-link" aria-label="Premium Calculator">Calculator</a>
      <a href="#resources" class="sidebar-link" aria-label="LIC Resources">Resources</a>
      <a href="#contact" class="sidebar-link" aria-label="Contact LIC Neemuch">Contact</a>
      <a href="#faq" class="sidebar-link" aria-label="FAQs">FAQs</a>
    </nav>
  </aside>
  <main role="main" itemscope itemtype="https://schema.org/LocalBusiness">
    <meta itemprop="name" content="LIC Neemuch">
    <meta itemprop="url" content="https://licneemuch.space">
    <meta itemprop="telephone" content="+917987235207">
    <meta itemprop="email" content="licneemuch343@licindia.com">
    <meta itemprop="address" content="Vikas Nagar, Neemuch, MP 458441">
    <meta itemprop="openingHours" content="Mo-Sa 10:00-17:00">
    <article aria-labelledby="welcome-heading">
      <section class="section welcome-section" id="welcome" aria-labelledby="welcome-heading">
        <h2 id="welcome-heading">Welcome to LIC Neemuch – Your Partner in Financial Security</h2>
        <p lang="en">
          At LIC Neemuch, we are committed to safeguarding the financial future of families in <span class="highlight">Neemuch, Madhya Pradesh</span>. Led by <span class="highlight">Jitendra Patidar</span>, our branch serves over <strong>50,000 policyholders</strong> across <span class="highlight">Neemuch, Manasa, Singoli, and Mandsaur</span>. For <strong>life insurance, pension plans, or child plans</strong>, visit us at <span class="highlight">Vikas Nagar, Neemuch (Madhya Pradesh)</span>. Contact us at <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.
        </p>
        <p lang="hi">
          एलआईसी नीमच में, हम <span class="highlight">नीमच, मध्य प्रदेश</span> के परिवारों के वित्तीय भविष्य की रक्षा के लिए प्रतिबद्ध हैं। <span class="highlight">जितेंद्र पाटीदार</span> के नेतृत्व में, हमारी शाखा <span class="highlight">नीमच, मनासा, सिंगोली, और मंदसौर</span> में <strong>50,000+ पॉलिसीधारकों</strong> की सेवा करती है। <strong>जीवन बीमा, पेंशन योजनाएं, या चाइल्ड प्लान</strong> के लिए, <span class="highlight">विकास नगर, नीमच</span> पर आएं। <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें।
        </p>
        <p lang="en">Choose LIC Neemuch for your insurance needs due to our high claim settlement ratio of <strong>98.62%</strong> (FY 2020-21), over <strong>150 trained agents</strong>, complimentary consultations, and extensive rural outreach in areas like <span class="highlight">Sarwaniya Maharaj</span> and <span class="highlight">Ratangarh</span>.</p>
        <p lang="hi"><strong>98.62%</strong> (वित्त वर्ष 2020-21) के उच्च दावा निपटान अनुपात, <strong>150+ प्रशिक्षित एजेंट</strong>, मुफ्त परामर्श, और <span class="highlight">सरवानिया महाराज</span> और <span class="highlight">रतनगढ़</span> जैसे क्षेत्रों में व्यापक ग्रामीण पहुंच के कारण एलआईसी नीमच चुनें।</p>
        <a href="/services" class="cta-button secondary" aria-label="Discover LIC Plans in Neemuch">Discover Plans</a>
      </section>
    </article>
    <article aria-labelledby="why-choose-heading">
      <section class="section why-choose-section" id="why-choose" aria-labelledby="why-choose-heading">
        <h2 id="why-choose-heading">Why LIC Neemuch Stands Out</h2>
        <p lang="en">
          LIC Neemuch combines local expertise with the trust of <strong>Life Insurance Corporation of India</strong>. As a leading insurance provider in <span class="highlight">Madhya Pradesh</span>, we prioritize financial security for residents of <span class="highlight">Neemuch Chawni, Manasa, and beyond</span>.
        </p>
        <p lang="hi">
          एलआईसी नीमच स्थानीय विशेषज्ञता को <strong>भारतीय जीवन बीमा निगम</strong> के विश्वास के साथ जोड़ता है। <span class="highlight">मध्य प्रदेश</span> में अग्रणी बीमा प्रदाता के रूप में, हम <span class="highlight">नीमच चावनी, मनासा और उससे आगे</span> के निवासियों के लिए वित्तीय सुरक्षा को प्राथमिकता देते हैं।
        </p>
        <div class="card-grid">
          <div class="card">
            <h3>Experienced Leadership</h3>
            <p lang="en">Guided by <span class="highlight">Jitendra Patidar</span>, a Chairman’s Club member with over <strong>10 years of expertise</strong>.</p>
            <p lang="hi"><span class="highlight">जितेंद्र पाटीदार</span> के मार्गदर्शन में, जो <strong>10+ वर्षों की विशेषज्ञता</strong> के साथ चेयरमैन क्लब सदस्य हैं।</p>
          </div>
          <div class="card">
            <h3>Strong Local Presence</h3>
            <p lang="en">Located at <span class="highlight">Vikas Nagar, Neemuch (Madhya Pradesh)</span>, serving <span class="highlight">Manasa, Singoli, and Mandsaur</span>.</p>
            <p lang="hi"><span class="highlight">विकास नगर, नीमच</span> में स्थित, <span class="highlight">मनासा, सिंगोली और मंदसौर</span> की सेवा।</p>
          </div>
          <div class="card">
            <h3>Exceptional Support</h3>
            <p lang="en">Contact our customer care at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> or LIC’s <strong>24x7 toll-free line</strong> at <a href="tel:+911125750500" class="content-link">+91 1125750500</a>.</p>
            <p lang="hi">हमारी ग्राहक सेवा से <a href="tel:+917987235207" class="content-link">+91 7987235207</a> या एलआईसी की <strong>24x7 टोल-फ्री लाइन</strong> <a href="tel:+911125750500" class="content-link">+91 1125750500</a> पर संपर्क करें।</p>
          </div>
        </div>
        <a href="/about" class="cta-button secondary" aria-label="Learn More About LIC Neemuch">About Us</a>
      </section>
    </article>
    <article aria-labelledby="about-heading">
      <section class="section about-section" id="about" aria-labelledby="about-heading">
        <h2 id="about-heading">About LIC Neemuch – A Legacy of Trust</h2>
        <p lang="en">
          Part of <strong>Life Insurance Corporation of India</strong> (est. 1956), LIC Neemuch is a pillar of financial stability in <span class="highlight">Madhya Pradesh</span>. With assets worth <strong>₹54.52 trillion</strong> (FY25), our branch (code 343) at <span class="highlight">Vikas Nagar, Neemuch, MP 458441</span> serves over <strong>50,000 policyholders</strong>. Reach us at <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a> or <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.
        </p>
        <p lang="hi">
          <strong>भारतीय जीवन बीमा निगम</strong> (स्थापना 1956) का हिस्सा, एलआईसी नीमच <span class="highlight">मध्य प्रदेश</span> में वित्तीय स्थिरता का एक स्तंभ है। <strong>₹54.52 लाख करोड़</strong> (FY25) की संपत्ति के साथ, हमारी शाखा (कोड 343) <span class="highlight">विकास नगर, नीमच, एमपी 458441</span> में <strong>50,000+ पॉलिसीधारकों</strong> की सेवा करती है। <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a> या <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें।
        </p>
        <p lang="en">For decades, we’ve fostered trust through insurance camps during <span class="highlight">Navratri</span> and <span class="highlight">Diwali</span>, extending outreach to rural areas like <span class="highlight">Sarwaniya Maharaj</span> and <span class="highlight">Ratangarh</span> near <span class="highlight">Kileshwar Temple</span>.</p>
        <p lang="hi">दशकों से, हमने <span class="highlight">नवरात्रि</span> और <span class="highlight">दिवाली</span> के दौरान बीमा शिविरों के माध्यम से विश्वास को बढ़ावा दिया है, जो <span class="highlight">किलेश्वर मंदिर</span> के पास <span class="highlight">सरवानिया महाराज</span> और <span class="highlight">रतनगढ़</span> जैसे ग्रामीण क्षेत्रों तक फैली है।</p>
        <table class="data-table table-responsive">
          <caption>LIC Neemuch Branch Overview</caption>
          <thead>
            <tr>
              <th>Detail</th>
              <th>Information</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Branch Code</td>
              <td>343</td>
            </tr>
            <tr>
              <td>Address</td>
              <td>Vikas Nagar, Neemuch (Madhya Pradesh) 458441</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>+91 7987235207</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>licneemuch343@licindia.com</td>
            </tr>
            <tr>
              <td>Divisional Office</td>
              <td>Indore, +91 731 252 3511, bo_31c@licindia.com</td>
            </tr>
          </tbody>
        </table>
        <a href="/faqs" class="cta-button secondary" aria-label="Find Answers in Our FAQs">Find Answers</a>
      </section>
    </article>
    <article aria-labelledby="jitendra-heading">
      <section class="section jitendra-section" id="jitendra" aria-labelledby="jitendra-heading">
        <h2 id="jitendra-heading">Meet Jitendra Patidar – Expert Advisor</h2>
        <p lang="en">
          <span class="highlight">Jitendra Patidar</span>, Development Officer at LIC Neemuch, offers over <strong>10 years of experience</strong> in insurance planning. A <strong>Chairman’s Club member</strong> (2020), he specializes in <strong>term insurance, pension plans, and child plans</strong>. Schedule a consultation at <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.
        </p>
        <p lang="hi">
          <span class="highlight">जितेंद्र पाटीदार</span>, एलआईसी नीमच के डेवलपमेंट ऑफिसर, बीमा योजना में <strong>10 वर्षों से अधिक का अनुभव</strong> प्रदान करते हैं। <strong>चेयरमैन क्लब सदस्य</strong> (2020) के रूप में, वे <strong>टर्म बीमा, पेंशन योजनाएं, और चाइल्ड प्लान</strong> में विशेषज्ञ हैं। <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर परामर्श बुक करें।
        </p>
        <div class="card-grid">
          <div class="card">
            <p><strong>Notable Achievements:</strong> Top Development Officer Award (2022), Rural Outreach Excellence (2023).</p>
          </div>
          <div class="card">
            <p><strong>Specialized Expertise:</strong> Term Plans (New Jeevan Amar), Pension Plans (Jeevan Shanti).</p>
          </div>
        </div>
        <div class="timeline">
          <p><strong>Career Milestones:</strong></p>
          <ol>
            <li><span>2015:</span> Joined LIC as Development Officer</li>
            <li><span>2020:</span> Earned Chairman’s Club Membership</li>
            <li><span>2023:</span> Led 50+ rural insurance campaigns</li>
          </ol>
        </div>
        <a href="/about#jitendra" class="cta-button secondary" aria-label="Learn More About Jitendra">More About Jitendra</a>
      </section>
    </article>
    <article aria-labelledby="services-heading">
      <section class="section services-section" id="services" aria-labelledby="services-heading">
        <h2 id="services-heading">Comprehensive Insurance Plans</h2>
        <p lang="en">
          LIC Neemuch branch offers a range of <strong>insurance plans</strong> for residents of <span class="highlight">Neemuch Chawni, Manasa, and Mandsaur</span>. From <strong>term insurance</strong> to <strong>ULIPs</strong>, our plans meet diverse financial goals. Contact us at <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.
        </p>
        <p lang="hi">
          एलआईसी नीमच शाखा <span class="highlight">नीमच चावनी, मनासा और मंदसौर</span> के निवासियों के लिए <strong>बीमा योजनाओं</strong> की श्रृंखला प्रदान करती है। <strong>टर्म बीमा</strong> से लेकर <strong>यूलिप</strong> तक, हमारी योजनाएं विभिन्न वित्तीय लक्ष्यों को पूरा करती हैं। <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें।
        </p>
        <table class="data-table table-responsive">
          <caption>Popular LIC Plans at Neemuch Branch</caption>
          <thead>
            <tr>
              <th>Plan Type</th>
              <th>Key Plans</th>
              <th>Benefits</th>
              <th>Premium Range</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Term Insurance</td>
              <td>New Jeevan Amar, Saral Jeevan</td>
              <td>High coverage, affordable premiums</td>
              <td>₹5,000–₹50,000</td>
            </tr>
            <tr>
              <td>Pension Plans</td>
              <td>Jeevan Shanti, Saral Pension</td>
              <td>Guaranteed lifelong income</td>
              <td>₹20,000–₹2 lakh</td>
            </tr>
            <tr>
              <td>Child Plans</td>
              <td>Jeevan Tarun, Money Back</td>
              <td>Funds for education and future</td>
              <td>₹15,000–₹1 lakh</td>
            </tr>
            <tr>
              <td>ULIPs</td>
              <td>SIIP, Pension Plus</td>
              <td>Market-linked returns</td>
              <td>₹25,000–₹5 lakh</td>
            </tr>
            <tr>
              <td>Micro-Insurance</td>
              <td>Jeevan Dhara</td>
              <td>Low-cost coverage for all</td>
              <td>₹1,000–₹10,000</td>
            </tr>
          </tbody>
        </table>
        <a href="/services" class="cta-button secondary" aria-label="Explore All LIC Plans">Explore All Plans</a>
      </section>
    </article>
    <article aria-labelledby="architecture-heading">
      <section class="section architecture-section" id="architecture" aria-labelledby="architecture-heading">
        <h2 id="architecture-heading">Our Service Model</h2>
        <p lang="en">
          LIC Neemuch delivers seamless insurance services through a <strong>client-centric approach</strong>, using <strong>digital tools</strong>, a robust agent network, and rural outreach programs across <span class="highlight">Neemuch and Mandsaur</span>.
        </p>
        <p lang="hi">
          एलआईसी नीमच <strong>ग्राहक-केंद्रित दृष्टिकोण</strong> के माध्यम से निर्बाध बीमा सेवाएं प्रदान करता है, जो <strong>डिजिटल उपकरणों</strong>, मजबूत एजेंट नेटवर्क, और <span class="highlight">नीमच और मंदसौर</span> में ग्रामीण आउटरीच कार्यक्रमों का लाभ उठाता है।
        </p>
        <p><strong>Client Onboarding Process:</strong></p>
        <pre class="diagram">
+--------------------+
| Client Inquiry     |
+---------+----------+
          |
          v
+--------------------+
| Consultation       |
| (Jitendra/Agents)  |
+---------+----------+
          |
          v
+--------------------+
| Plan Selection     |
| (Term, Pension)    |
+---------+----------+
          |
          v
+--------------------+
| Policy Issuance    |
| (Digital Portal)   |
+--------------------+
        </pre>
        <p><strong>Efficient Claims Processing:</strong></p>
        <pre class="diagram">
+--------------------+
| Claim Submission   |
+---------+----------+
          |
          v
+--------------------+
| Verification       |
| (Documents)        |
+---------+----------+
          |
          v
+--------------------+
| Approval           |
| (98.62% Success)   |
+---------+----------+
          |
          v
+--------------------+
| Payout             |
| (Bank Transfer)    |
+--------------------+
        </pre>
        <p><strong>Rural Outreach Initiatives:</strong></p>
        <pre class="diagram">
+--------------------+
| Awareness Camps    |
| (Sarwaniya, Ratangarh) |
+---------+----------+
          |
          v
+--------------------+
| Micro-Insurance    |
| (Jeevan Dhara)     |
+---------+----------+
          |
          v
+--------------------+
| Enrollments        |
| (PMJBY, PMSBY)     |
+--------------------+
        </pre>
      </section>
    </article>
    <article aria-labelledby="team-heading">
      <section class="section team-section" id="team" aria-labelledby="team-heading">
        <h2 id="team-heading">Our Dedicated Team</h2>
        <p lang="en">
          With over <strong>150 agents</strong>, <strong>10 supervisors</strong>, and <strong>5 support staff</strong>, LIC Neemuch ensures exceptional service under <span class="highlight">Jitendra Patidar’s</span> leadership.
        </p>
        <p lang="hi">
          <strong>150+ एजेंट</strong>, <strong>10 सुपरवाइज़र</strong>, और <strong>5 सहायक कर्मचारी</strong> के साथ, एलआईसी नीमच <span class="highlight">जितेंद्र पाटीदार</span> के नेतृत्व में उत्कृष्ट सेवा सुनिश्चित करता है।
        </p>
        <div class="card-grid">
          <div class="card">
            <p><strong>Agents:</strong> 150+ trained professionals</p>
          </div>
          <div class="card">
            <p><strong>Supervisors:</strong> 10 senior experts</p>
          </div>
          <div class="card">
            <p><strong>Support:</strong> 5 dedicated staff</p>
          </div>
        </div>
      </section>
    </article>
    <article aria-labelledby="market-heading">
      <section class="section market-section" id="market" aria-labelledby="market-heading">
        <h2 id="market-heading">LIC’s Market Dominance</h2>
        <p lang="en">
          <strong>LIC of India</strong> leads with a <strong>61.2% premium share</strong> and <strong>₹54.52 trillion</strong> in assets (FY25). LIC Neemuch strengthens this legacy with local expertise.
        </p>
        <p lang="hi">
          <strong>भारतीय जीवन बीमा निगम</strong> <strong>61.2% प्रीमियम हिस्सेदारी</strong> और <strong>₹54.52 लाख करोड़</strong> की संपत्ति (FY25) के साथ अग्रणी है। एलआईसी नीमच स्थानीय विशेषज्ञता के साथ इस विरासत को मजबूत करता है।
        </p>
        <table class="data-table table-responsive">
          <caption>LIC Market Statistics (FY25)</caption>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Premium Share</td>
              <td>61.2%</td>
            </tr>
            <tr>
              <td>Assets</td>
              <td>₹54.52 trillion</td>
            </tr>
            <tr>
              <td>Agents</td>
              <td>13.8 lakh</td>
            </tr>
            <tr>
              <td>Branches</td>
              <td>2,048</td>
            </tr>
          </tbody>
        </table>
      </section>
    </article>
    <article aria-labelledby="social-heading">
      <section class="section social-section" id="social" aria-labelledby="social-heading">
        <h2 id="social-heading">Community Engagement</h2>
        <p lang="en">
          LIC Neemuch champions <strong>education, healthcare, and financial inclusion</strong> in rural areas like <span class="highlight">Sarwaniya Maharaj</span> near <span class="highlight">Gandhi Sagar Dam</span>.
        </p>
        <p lang="hi">
          एलआईसी नीमच <span class="highlight">गांधी सागर बांध</span> के पास <span class="highlight">सरवानिया महाराज</span> जैसे ग्रामीण क्षेत्रों में <strong>शिक्षा, स्वास्थ्य, और वित्तीय समावेशन</strong> को बढ़ावा देता है।
        </p>
        <ul class="benefits-list">
          <li><strong>75+ Insurance Literacy Camps</strong> in 2023 for rural communities.</li>
          <li><strong>10,000+ Enrollments</strong> in PMJBY and PMSBY.</li>
          <li><strong>₹5 Lakh Donated</strong> to healthcare initiatives in 2022.</li>
        </ul>
      </section>
    </article>
    <article aria-labelledby="testimonials-heading">
      <section class="section testimonials-section" id="testimonials" aria-labelledby="testimonials-heading">
        <h2 id="testimonials-heading">Client Testimonials</h2>
        <p lang="en">
          Discover why residents trust LIC Neemuch. Share your experience at <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.
        </p>
        <p lang="hi">
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
                    } >
                    <div class="review-stars" aria-hidden="true">${renderStars(review.rating)}</div>
                    <blockquote class="review-body" itemprop="reviewBody">${review.comment}</blockquote>
                    <cite class="review-author">
                      <span itemprop="name">${review.username}</span>
                    </cite>
                    <meta itemprop="datePublished" content="${
                      new Date(review.datePublished).toISOString().split('T')[0]
                    }">
                    <meta itemprop="reviewRating" content="${review.rating}">
                  </div>
                `
                  )
                  .join('')}
              </div>
              <a href="/reviews" class="cta-button secondary" aria-label="View All Testimonials">View All Testimonials</a>
            `
            : '<p lang="en">No testimonials yet. Be the first to share your experience!</p><p lang="hi">अभी तक कोई समीक्षा नहीं। अपनी अनुभव साझा करने वाले पहले व्यक्ति बनें!</p>'
        }
      </section>
    </article>
    <article aria-labelledby="calculator-heading">
      <section class="section calculator-section" id="calculator" aria-labelledby="calculator-heading">
        <h2 id="calculator-heading">Calculate Your Premium</h2>
        <p lang="en">
          Use our <strong>premium calculator</strong> to estimate insurance costs. For accurate quotes, contact us at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> or visit <span class="highlight">Vikas Nagar</span>.
        </p>
        <p lang="hi">
          हमारा <strong>प्रीमियम कैलकुलेटर</strong> बीमा लागत का अनुमान लगाने के लिए उपयोग करें। सटीक उद्धरणों के लिए, <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें या <span class="highlight">विकास नगर</span> पर आएं।
        </p>
        <div class="calculator-form">
          <label for="age">Age:</label>
          <input type="number" id="age" min="18" max="80" placeholder="Enter age" required>
          <label for="plan-type">Plan Type:</label>
          <select id="plan-type" required>
            <option value="term">Term Insurance</option>
            <option value="pension">Pension Plan</option>
            <option value="child">Child Plan</option>
            <option value="ulips">ULIP</option>
            <option value="micro">Micro-Insurance</option>
          </select>
          <label for="sum-assured">Sum Assured (₹):</label>
          <input type="number" id="sum-assured" min="100000" placeholder="Enter sum assured" required>
          <button type="button" class="cta-button" onclick="calculatePremium()" aria-label="Calculate Premium">Calculate</button>
          <p id="calc-result" aria-live="polite"></p>
        </div>
      </section>
    </article>
    <article aria-labelledby="resources-heading">
      <section class="section resources-section" id="resources" aria-labelledby="resources-heading">
        <h2 id="resources-heading">LIC Resources</h2>
        <p lang="en">
          Access LIC’s online services through LIC Neemuch to pay premiums or check policy status. For assistance, call <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.
        </p>
        <p lang="hi">
          एलआईसी नीमच के माध्यम से एलआईसी की ऑनलाइन सेवाओं तक पहुंचें, प्रीमियम भुगतान करें या पॉलिसी स्थिति जांचें। सहायता के लिए, <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर कॉल करें।
        </p>
        <ul class="benefits-list">
          <li><a href="https://licindia.in/Online-Payment" target="_blank" rel="noopener noreferrer" class="content-link">Pay Premium Online</a></li>
          <li><a href="https://licindia.in/Customer-Services" target="_blank" rel="noopener noreferrer" class="content-link">Check Policy Status</a></li>
          <li><a href="/services" class="content-link">Explore Local Plans</a></li>
          <li>Contact our branch at <a href="tel:+917987235207" class="content-link">+91 7987235207</a></li>
        </ul>
        <a href="/faqs" class="cta-button secondary" aria-label="Explore More Resources">More Resources</a>
      </section>
    </article>
    <article aria-labelledby="contact-heading">
      <section class="section contact-section" id="contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading">Get in Touch</h2>
        <p lang="en">
          Connect with LIC Neemuch for personalized insurance solutions. Our team is available via phone, WhatsApp, email, or at <span class="highlight">Vikas Nagar, Neemuch</span>. Search <span class="highlight">LIC Neemuch near me</span> to locate us.
        </p>
        <p lang="hi">
          एलआईसी नीमच से विशेष बीमा समाधानों के लिए संपर्क करें। हमारी टीम फोन, व्हाट्सएप, ईमेल, या <span class="highlight">विकास नगर, नीमच</span> पर उपलब्ध है। हमें ढूंढने के लिए <span class="highlight">एलआईसी नीमच मेरे पास</span> खोजें।
        </p>
        <div class="contact-info" itemscope itemtype="https://schema.org/ContactPoint">
          <div class="contact-details">
            <p>
              📍 <strong>Address:</strong> <span itemprop="address">Vikas Nagar, Neemuch, MP 458441</span>
            </p>
            <p>
              📞 <strong>Phone:</strong> <a href="tel:+917987235207" class="content-link" aria-label="Call LIC Neemuch" itemprop="telephone">+91 7987235207</a>
            </p>
            <p>
              📧 <strong>Email:</strong> <a href="mailto:licneemuch343@licindia.com" class="content-link" aria-label="Email LIC Neemuch" itemprop="email">licneemuch343@licindia.com</a>
            </p>
            <p>
              📱 <strong>WhatsApp:</strong> <a href="https://wa.me/917987235207" class="content-link" target="_blank" rel="noopener noreferrer" aria-label="Chat with LIC Neemuch">+91 7987235207</a>
            </p>
            <p>
              🏢 <strong>Branch Code:</strong> 343
            </p>
            <p>
              ⏰ <strong>Office Hours:</strong> Monday to Saturday, 10 AM to 5 PM
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
        <p lang="en">
          For urgent assistance, reach LIC’s <strong>24x7 toll-free support</strong> at <a href="tel:+911125750500" class="content-link">+91 1125750500</a>. For local support, visit us near <span class="highlight">Neemuch Railway Station</span>.
        </p>
        <p lang="hi">
          तत्काल सहायता के लिए, एलआईसी के <strong>24x7 टोल-फ्री समर्थन</strong> <a href="tel:+911125750500" class="content-link">+91 1125750500</a> पर संपर्क करें। स्थानीय सहायता के लिए, <span class="highlight">नीमच रेलवे स्टेशन</span> के पास हमसे मिलें।
        </p>
        <p lang="en">
          For advanced queries, contact the <strong>LIC Indore Divisional Office</strong> at <a href="tel:+917312523511" class="content-link">+91 731 252 3511</a> or <a href="mailto:bo_31c@licindia.com" class="content-link">bo_31c@licindia.com</a>.
        </p>
        <p lang="hi">
          उन्नत प्रश्नों के लिए, <strong>एलआईसी इंदौर डिवीजनल कार्यालय</strong> से <a href="tel:+917312523511" class="content-link">+91 731 252 3511</a> या <a href="mailto:bo_31c@licindia.com" class="content-link">bo_31c@licindia.com</a> पर संपर्क करें।
        </p>
        <p lang="en">
          Find us by searching <span class="highlight">LIC Neemuch near me</span>. Our branch is near <span class="highlight">Kileshwar Temple</span>, accessible by auto-rickshaw or taxi.
        </p>
        <p lang="hi">
          <span class="highlight">एलआईसी नीमच मेरे पास</span> खोजकर हमें ढूंढें। हमारी शाखा <span class="highlight">किलेश्वर मंदिर</span> के पास है, ऑटो-रिक्शा या टैक्सी से पहुंचें।
        </p>
        <p lang="en">
          Book a <strong>free consultation</strong> to explore insurance options at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> or <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a>.
        </p>
        <p lang="hi">
          बीमा विकल्पों का पता लगाने के लिए <strong>मुफ्त परामर्श</strong> बुक करें: <a href="tel:+917987235207" class="content-link">+91 7987235207</a> या <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a>।
        </p>
        <div class="social-share" aria-label="Share LIC Neemuch Page">
          <a href="https://x.com/intent/post?url=${encodeURIComponent(pageUrl)}&text=${metaTitle}" target="_blank" rel="noopener noreferrer" aria-label="Post on X">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.1 9.1 0 0 1-2.89 1.1A4.52 4.52 0 0 0 16.5 0c-2.53 0-4.5 2.17-4.5 4.84 0 .38.04.75.12 1.1A12.9 12.9 0 0 1 3 1.67a5.06 5.06 0 0 0-.61 2.44c0 1.69.84 3.18 2.13 4.06a4.47 4.47 0 0 1-2.05-.6v.06c0 2.36 1.64 4.33 3.82 4.78a4.4 4.4 0 0 1-2.04.08 4.49 4.49 0 0 0 4.2 3.13A9.05 9.05 0 0 1 1 20.08 12.73 12.73 0 0 0 8 22c7.55 0 11.68-6.49 11.68-12.11 0-.19 0-.39-.01-.58A8.3 8.3 0 0 0 23 3z"/>
            </svg>
          </a>
          <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.41c0-2.5 1.5-3.89 3.8-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.89h-2.33V22C18.34 21.13 22 16.99 22 12z"/>
            </svg>
          </a>
          <a href="https://wa.me/?text=${metaTitle}%20${encodeURIComponent(pageUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.82.807 5.46 2.192 7.704L2 30l6.5-2.155A13.29 13.29 0 0 0 16.003 29.333C23.36 29.333 29.333 23.36 29.333 16 29.333 8.64 23.36 2.667 16.003 2.667zM16 26.667c-2.219 0-4.287-.654-6.004-1.77l-.43-.27-3.857 1.278 1.275-3.746-.28-.434A10.653 10.653 0 0 1 5.333 16c0-5.899 4.77-10.667 10.667-10.667S26.667 10.101 26.667 16c0 5.899-4.77 10.667-10.667 10.667zm5.61-8.518c-.307-.154-1.815-.895-2.097-.997-.281-.103-.487-.154-.692.154-.206.308-.793.996-.972 1.202-.18.206-.36.231-.667.077a8.73 8.73 0 0 1-2.564-1.64 9.66 9.66 0 0 1-1.79-2.255c-.187-.308-.02-.475.14-.63.14-.138.308-.359.46-.539.153-.179.205-.308.308-.513.103-.205.051-.385-.026-.539-.077-.154-.692-1.666-.948-2.29-.246-.591-.497-.511-.692-.52-.179-.009-.385-.011-.59-.011-.204 0-.538.077-.82.385s-1.077 1.053-1.077 2.562c0 1.508 1.103 2.964 1.257 3.169.154.205 2.16 3.287 5.24 4.62.733.317 1.305.505 1.75.648.735.233 1.405.200 1.934.122.59-.088 1.815-.741 2.072-1.457.256-.717.256-1.33.179-1.456-.077-.127-.28-.205-.589-.359z"/>
            </svg>
          </a>
          <a href="https://t.me/share/?url=${encodeURIComponent(pageUrl)}&text=${metaTitle}" target="_blank" rel="noopener noreferrer" aria-label="Share on Telegram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9.041 16.23L8.7 20.176c.508 0 .728-.215.996-.473l2.4-2.29 4.973 3.627c.911.5 1.562.24 1.795-.84l3.252-15.26c.29-1.37-.516-1.91-1.392-1.58L2.24 9.31c-1.34.53-1.32 1.3-.23 1.63l5.47 1.71 12.68-7.91c.6-.39 1.14-.18.7.21L9.04 16.23z"/>
            </svg>
          </a>
        </div>
        <a href="/faqs#contact" class="cta-button" aria-label="Book a Free Consultation with LIC Neemuch">Book Consultation</a>
      </section>
    </article>
    <article aria-labelledby="faq-heading">
      <section class="section faq-section" id="faq" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Frequently Asked Questions</h2>
        <p class="faq-intro" lang="en">
          Find answers about LIC Neemuch, insurance plans, and support. Contact us at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> for more help.
        </p>
        <p class="faq-intro" lang="hi">
          एलआईसी नीमच, बीमा योजनाओं, और सहायता के बारे में उत्तर ढूंढें। अधिक मदद के लिए <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर कॉल करें।
        </p>
        <div class="faq-list">
          <div class="faq-item">
            <h3 class="faq-question" id="faq-1" aria-controls="answer-1" aria-expanded="false">
              <span lang="en" class="lang-hidden">What insurance plans are available?</span>
              <span lang="hi" class="lang-visible">कौन सी बीमा योजनाएं उपलब्ध हैं?</span>
            </h3>
            <div class="faq-answer" id="answer-1">
              <div lang="en" class="lang-hidden">
                <p>We offer <strong>term insurance</strong>, <strong>pension plans</strong>, <strong>child plans</strong>, <strong>ULIPs</strong>, and <strong>micro-insurance</strong> like Jeevan Dhara. See our <a href="/services" class="content-link">Services page</a>.</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p>हम <strong>टर्म बीमा</strong>, <strong>पेंशन योजनाएं</strong>, <strong>चाइल्ड प्लान</strong>, <strong>यूलिप</strong>, और <strong>सूक्ष्म बीमा</strong> जैसे जीवन धारा प्रदान करते हैं। हमारी <a href="/services" class="content-link">सेवाएं पेज</a> देखें।</p>
              </div>
            </div>
          </div>
          <div class="faq-item">
            <h3 class="faq-question" id="faq-2" aria-controls="answer-2" aria-expanded="false">
              <span lang="en" class="lang-hidden">How can I contact customer care?</span>
              <span lang="hi" class="lang-visible">ग्राहक सेवा से कैसे संपर्क करें?</span>
            </h3>
            <div class="faq-answer" id="answer-2">
              <div lang="en" class="lang-hidden">
                <p>Reach us at <a href="tel:+917987235207" class="content-link">+91 7987235207</a>, WhatsApp, or <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a>. For 24x7 support, call <a href="tel:+911125750500" class="content-link">+91 1125750500</a>.</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p><a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर कॉल करें, व्हाट्सएप करें, या <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a> पर ईमेल करें। 24x7 सहायता के लिए <a href="tel:+911125750500" class="content-link">+91 1125750500</a> पर कॉल करें।</p>
              </div>
            </div>
          </div>
          <div class="faq-item">
            <h3 class="faq-question" id="faq-3" aria-controls="answer-3" aria-expanded="false">
              <span lang="en" class="lang-hidden">What is the branch address?</span>
              <span lang="hi" class="lang-visible">शाखा का पता क्या है?</span>
            </h3>
            <div class="faq-answer" id="answer-3">
              <div lang="en" class="lang-hidden">
                <p>Our branch is at <span class="highlight">Vikas Nagar, Neemuch, MP 458441</span>. Call <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p>हमारी शाखा <span class="highlight">विकास नगर, नीमच, एमपी 458441</span> में है। <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर कॉल करें।</p>
              </div>
            </div>
          </div>
          <div class="faq-item">
            <h3 class="faq-question" id="faq-4" aria-controls="answer-4" aria-expanded="false">
              <span lang="en" class="lang-hidden">What is the branch code?</span>
              <span lang="hi" class="lang-visible">शाखा कोड क्या है?</span>
            </h3>
            <div class="faq-answer" id="answer-4">
              <div lang="en" class="lang-hidden">
                <p>The branch code is <strong>343</strong>. Use it for policy queries.</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p>शाखा कोड <strong>343</strong> है। पॉलिसी प्रश्नों के लिए इसका उपयोग करें।</p>
              </div>
            </div>
          </div>
          <div class="faq-item">
            <h3 class="faq-question" id="faq-5" aria-controls="answer-5" aria-expanded="false">
              <span lang="en" class="lang-hidden">How do I contact the divisional office?</span>
              <span lang="hi" class="lang-visible">डिवीजनल कार्यालय से कैसे संपर्क करें?</span>
            </h3>
            <div class="faq-answer" id="answer-5">
              <div lang="en" class="lang-hidden">
                <p>Contact <strong>LIC Indore</strong> at <a href="tel:+917312523511" class="content-link">+91 731 252 3511</a> or <a href="mailto:bo_31c@licindia.com" class="content-link">bo_31c@licindia.com</a>.</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p><strong>एलआईसी इंदौर</strong> से <a href="tel:+917312523511" class="content-link">+91 731 252 3511</a> या <a href="mailto:bo_31c@licindia.com" class="content-link">bo_31c@licindia.com</a> पर संपर्क करें।</p>
              </div>
            </div>
          </div>
          <div class="faq-item">
            <h3 class="faq-question" id="faq-6" aria-controls="answer-6" aria-expanded="false">
              <span lang="en" class="lang-hidden">What is LIC’s toll-free number?</span>
              <span lang="hi" class="lang-visible">एलआईसी का टोल-फ्री नंबर क्या है?</span>
            </h3>
            <div class="faq-answer" id="answer-6">
              <div lang="en" class="lang-hidden">
                <p>LIC’s <strong>24x7 toll-free number</strong> is <a href="tel:+911125750500" class="content-link">+91 1125750500</a>. For local support, use <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p>एलआईसी का <strong>24x7 टोल-फ्री नंबर</strong> <a href="tel:+911125750500" class="content-link">+91 1125750500</a> है। स्थानीय सहायता के लिए <a href="tel:+917987235207" class="content-link">+91 7987235207</a> का उपयोग करें।</p>
              </div>
            </div>
          </div>
          <div class="faq-item">
            <h3 class="faq-question" id="faq-7" aria-controls="answer-7" aria-expanded="false">
              <span lang="en" class="lang-hidden">How do I find LIC Neemuch?</span>
              <span lang="hi" class="lang-visible">एलआईसी नीमच कैसे ढूंढें?</span>
            </h3>
            <div class="faq-answer" id="answer-7">
              <div lang="en" class="lang-hidden">
                <p>Search <span class="highlight">LIC Neemuch near me</span> to find our branch at <span class="highlight">Vikas Nagar</span>, near <span class="highlight">Kileshwar Temple</span>.</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p><span class="highlight">एलआईसी नीमच मेरे पास</span> खोजें और <span class="highlight">विकास नगर</span> में हमारी शाखा, <span class="highlight">किलेश्वर मंदिर</span> के पास ढूंढें।</p>
              </div>
            </div>
          </div>
          <div class="faq-item">
            <h3 class="faq-question" id="faq-8" aria-controls="answer-8" aria-expanded="false">
              <span lang="en" class="lang-hidden">What is the claim settlement ratio?</span>
              <span lang="hi" class="lang-visible">दावा निपटान अनुपात क्या है?</span>
            </h3>
            <div class="faq-answer" id="answer-8">
              <div lang="en" class="lang-hidden">
                <p>Our <strong>claim settlement ratio</strong> is <strong>98.62%</strong> (FY 2020-21).</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p>हमारा <strong>दावा निपटान अनुपात</strong> <strong>98.62%</strong> (वित्त वर्ष 2020-21) है।</p>
              </div>
            </div>
          </div>
          <div class="faq-item">
            <h3 class="faq-question" id="faq-9" aria-controls="answer-9" aria-expanded="false">
              <span lang="en" class="lang-hidden">How do I pay premiums?</span>
              <span lang="hi" class="lang-visible">प्रीमियम कैसे भुगतान करें?</span>
            </h3>
            <div class="faq-answer" id="answer-9">
              <div lang="en" class="lang-hidden">
                <p>Pay online at <a href="https://licindia.in/Online-Payment" target="_blank" rel="noopener noreferrer" class="content-link">licindia.in</a> or visit <span class="highlight">Vikas Nagar</span>. Call <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p><a href="https://licindia.in/Online-Payment" target="_blank" rel="noopener noreferrer" class="content-link">licindia.in</a> पर ऑनलाइन भुगतान करें या <span class="highlight">विकास नगर</span> पर आएं। <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर कॉल करें।</p>
              </div>
            </div>
          </div>
          <div class="faq-item">
            <h3 class="faq-question" id="faq-10" aria-controls="answer-10" aria-expanded="false">
              <span lang="en" class="lang-hidden">Who is the branch manager?</span>
              <span lang="hi" class="lang-visible">शाखा प्रबंधक कौन है?</span>
            </h3>
            <div class="faq-answer" id="answer-10">
              <div lang="en" class="lang-hidden">
                <p>Contact <span class="highlight">Jitendra Patidar</span>, Development Officer, at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> or <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a>.</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p>हमारे डेवलपमेंट ऑफिसर <span class="highlight">जितेंद्र पाटीदार</span> से <a href="tel:+917987235207" class="content-link">+91 7987235207</a> या <a href="mailto:licneemuch343@licindia.com" class="content-link">licneemuch343@licindia.com</a> पर संपर्क करें।</p>
              </div>
            </div>
          </div>
          <div class="faq-item">
            <h3 class="faq-question" id="faq-11" aria-controls="answer-11" aria-expanded="false">
              <span lang="en" class="lang-hidden">Can I join as an agent?</span>
              <span lang="hi" class="lang-visible">क्या मैं एजेंट के रूप में शामिल हो सकता हूँ?</span>
            </h3>
            <div class="faq-answer" id="answer-11">
              <div lang="en" class="lang-hidden">
                <p>Become an LIC agent with us. Contact <span class="highlight">Jitendra Patidar</span> at <a href="tel:+917987235207" class="content-link">+91 7987235207</a> or visit our <a href="/join" class="content-link">Join as Agent</a> page.</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p>हमारे साथ एलआईसी एजेंट बनें। <span class="highlight">जितेंद्र पाटीदार</span> से <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर संपर्क करें या <a href="/join" class="content-link">एजेंट के रूप में शामिल हों</a> पेज पर जाएं।</p>
              </div>
            </div>
          </div>
          <div class="faq-item">
            <h3 class="faq-question" id="faq-12" aria-controls="answer-12" aria-expanded="false">
              <span lang="en" class="lang-hidden">What is Bima Sakhi Yojana?</span>
              <span lang="hi" class="lang-visible">बीमा सखी योजना क्या है?</span>
            </h3>
            <div class="faq-answer" id="answer-12">
              <div lang="en" class="lang-hidden">
                <p><strong>Bima Sakhi Yojana</strong> empowers women to become LIC agents. Learn more at our <a href="/bimasakhi" class="content-link">Bima Sakhi page</a> or call <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p><strong>बीमा सखी योजना</strong> महिलाओं को एलआईसी एजेंट बनने के लिए सशक्त बनाती है। <a href="/bimasakhi" class="content-link">बीमा सखी पेज</a> पर अधिक जानकारी प्राप्त करें या <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर कॉल करें।</p>
              </div>
            </div>
          </div>
          <div class="faq-item">
            <h3 class="faq-question" id="faq-13" aria-controls="answer-13" aria-expanded="false">
              <span lang="en" class="lang-hidden">How do I file a claim?</span>
              <span lang="hi" class="lang-visible">दावा कैसे दर्ज करें?</span>
            </h3>
            <div class="faq-answer" id="answer-13">
              <div lang="en" class="lang-hidden">
                <p>Submit claims at <span class="highlight">Vikas Nagar</span> or online via <a href="https://licindia.in/Customer-Services" target="_blank" rel="noopener noreferrer" class="content-link">licindia.in</a>. Call <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p><span class="highlight">विकास नगर</span> पर या <a href="https://licindia.in/Customer-Services" target="_blank" rel="noopener noreferrer" class="content-link">licindia.in</a> के माध्यम से दावे जमा करें। <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर कॉल करें।</p>
              </div>
            </div>
          </div>
          <div class="faq-item">
            <h3 class="faq-question" id="faq-14" aria-controls="answer-14" aria-expanded="false">
              <span lang="en" class="lang-hidden">What are the office hours?</span>
              <span lang="hi" class="lang-visible">कार्यालय समय क्या हैं?</span>
            </h3>
            <div class="faq-answer" id="answer-14">
              <div lang="en" class="lang-hidden">
                <p>Our office at <span class="highlight">Vikas Nagar</span> is open <strong>Monday to Saturday, 10 AM to 5 PM</strong>. Call <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p><span class="highlight">विकास नगर</span> में हमारा कार्यालय <strong>सोमवार से शनिवार, सुबह 10 बजे से शाम 5 बजे</strong> तक खुला है। <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर कॉल करें।</p>
              </div>
            </div>
          </div>
          <div class="faq-item">
            <h3 class="faq-question" id="faq-15" aria-controls="answer-15" aria-expanded="false">
              <span lang="en" class="lang-hidden">Does LIC Neemuch offer online premium payment?</span>
              <span lang="hi" class="lang-visible">क्या एलआईसी नीमच ऑनलाइन प्रीमियम भुगतान प्रदान करता है?</span>
            </h3>
            <div class="faq-answer" id="answer-15">
              <div lang="en" class="lang-hidden">
                <p>Pay premiums online at <a href="https://licindia.in/Online-Payment" target="_blank" rel="noopener noreferrer" class="content-link">licindia.in</a>. For help, visit <span class="highlight">Vikas Nagar</span> or call <a href="tel:+917987235207" class="content-link">+91 7987235207</a>.</p>
              </div>
              <div lang="hi" class="lang-visible">
                <p><a href="https://licindia.in/Online-Payment" target="_blank" rel="noopener noreferrer" class="content-link">licindia.in</a> पर प्रीमियम ऑनलाइन भुगतान करें। सहायता के लिए <span class="highlight">विकास नगर</span> पर आएं या <a href="tel:+917987235207" class="content-link">+91 7987235207</a> पर कॉल करें।</p>
              </div>
            </div>
          </div>
        </div>
        <a href="/faqs" class="cta-button secondary" aria-label="Explore More FAQs">More FAQs</a>
      </section>
    </article>
  </main>
</div>

      <button class="scroll-to-top" aria-label="Scroll to top" title="Back to top">↑</button>

<footer class="footer" role="contentinfo" itemscope itemtype="https://schema.org/WPFooter">
  <div class="footer-content">
    <div class="footer-section">
      <h3 class="footer-heading">About LIC Neemuch</h3>
      <p lang="en">
        LIC Neemuch, led by <span class="highlight">Jitendra Patidar</span>, serves over <strong>50,000 policyholders</strong> in <span class="highlight">Neemuch, Manasa, and Mandsaur</span> with trusted <strong>life insurance solutions</strong>.
      </p>
      <p lang="hi">
        एलआईसी नीमच, <span class="highlight">जितेंद्र पाटीदार</span> के नेतृत्व में, <span class="highlight">नीमच, मनासा, और मंदसौर</span> में <strong>50,000+ पॉलिसीधारकों</strong> को विश्वसनीय <strong>जीवन बीमा समाधान</strong> प्रदान करता है।
      </p>
    </div>
    <div class="footer-section">
      <h3 class="footer-heading">Quick Links</h3>
      <ul class="footer-links">
        <li><a href="/services" class="footer-link" aria-label="Explore Insurance Services">Services</a></li>
        <li><a href="/join" class="footer-link" aria-label="Join as LIC Agent">Join as Agent</a></li>
        <li><a href="/bimasakhi" class="footer-link" aria-label="Bima Sakhi Yojana">Bima Sakhi</a></li>
        <li><a href="/faqs" class="footer-link" aria-label="Frequently Asked Questions">FAQs</a></li>
        <li><a href="/reviews" class="footer-link" aria-label="Customer Reviews">Reviews</a></li>
      </ul>
    </div>
    <div class="footer-section">
      <h3 class="footer-heading">Contact Us</h3>
      <p>
        📍 <span class="highlight">Vikas Nagar, Neemuch, MP 458441</span><br>
        📞 <a href="tel:+917987235207" class="footer-link" aria-label="Call LIC Neemuch" itemprop="telephone">+91 7987235207</a><br>
        📧 <a href="mailto:licneemuch343@licindia.com" class="footer-link" aria-label="Email LIC Neemuch" itemprop="email">licneemuch343@licindia.com</a><br>
        📱 <a href="https://wa.me/917987235207" class="footer-link" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp LIC Neemuch">WhatsApp</a>
      </p>
      <p lang="en">Open: Monday–Saturday, 10 AM–5 PM</p>
      <p lang="hi">खुला: सोमवार–शनिवार, सुबह 10 बजे–शाम 5 बजे</p>
    </div>
    <div class="footer-section">
      <h3 class="footer-heading">Follow Us</h3>
      <div class="social-share" aria-label="Social media links">
        <a href="https://x.com/licneemuch" target="_blank" rel="noopener noreferrer" class="social-share" aria-label="Follow LIC Neemuch on X">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.1 9.1 0 0 1-2.89 1.1A4.52 4.52 0 0 0 16.5 0c-2.53 0-4.5 2.17-4.5 4.84 0 .38.04.75.12 1.1A12.9 12.9 0 0 1 3 1.67a5.06 5.06 0 0 0-.61 2.44c0 1.69.84 3.18 2.13 4.06a4.47 4.47 0 0 1-2.05-.6v.06c0 2.36 1.64 4.33 3.82 4.78a4.4 4.4 0 0 1-2.04.08 4.49 4.49 0 0 0 4.2 3.13A9.05 9.05 0 0 1 1 20.08 12.73 12.73 0 0 0 8 22c7.55 0 11.68-6.49 11.68-12.11 0-.19 0-.39-.01-.58A8.3 8.3 0 0 0 23 3z"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/licneemuch" target="_blank" rel="noopener noreferrer" class="social-share" aria-label="Follow LIC Neemuch on Facebook">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.41c0-2.5 1.5-3.89 3.8-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.77l-.44 2.89h-2.33V22C18.34 21.13 22 16.99 22 12z"/>
          </svg>
        </a>
        <a href="https://wa.me/917987235207" target="_blank" rel="noopener noreferrer" class="social-share" aria-label="Chat with LIC Neemuch on WhatsApp">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.82.807 5.46 2.192 7.704L2 30l6.5-2.155A13.29 13.29 0 0 0 16.003 29.333C23.36 29.333 29.333 23.36 29.333 16 29.333 8.64 23.36 2.667 16.003 2.667zM16 26.667c-2.219 0-4.287-.654-6.004-1.77l-.43-.27-3.857 1.278 1.275-3.746-.28-.434A10.653 10.653 0 0 1 5.333 16c0-5.899 4.77-10.667 10.667-10.667S26.667 10.101 26.667 16c0 5.899-4.77 10.667-10.667 10.667zm5.61-8.518c-.307-.154-1.815-.895-2.097-.997-.281-.103-.487-.154-.692.154-.206.308-.793.996-.972 1.202-.18.206-.36.231-.667.077a8.73 8.73 0 0 1-2.564-1.64 9.66 9.66 0 0 1-1.79-2.255c-.187-.308-.02-.475.14-.63.14-.138.308-.359.46-.539.153-.179.205-.308.308-.513.103-.205.051-.385-.026-.539-.077-.154-.692-1.666-.948-2.29-.246-.591-.497-.511-.692-.52-.179-.009-.385-.011-.59-.011-.204 0-.538.077-.82.385s-1.077 1.053-1.077 2.562c0 1.508 1.103 2.964 1.257 3.169.154.205 2.16 3.287 5.24 4.62.733.317 1.305.505 1.75.648.735.233 1.405.200 1.934.122.59-.088 1.815-.741 2.072-1.457.256-.717.256-1.33.179-1.456-.077-.127-.28-.205-.589-.359z"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p lang="en">&copy; 2025 LIC Neemuch. All rights reserved.</p>
    <p lang="hi">&copy; 2025 एलआईसी नीमच। सभी अधिकार सुरक्षित।</p>
    <p>
      <a href="/privacy" class="footer-link" aria-label="Privacy Policy">Privacy Policy</a> |
      <a href="/terms" class="footer-link" aria-label="Terms of Service">Terms of Service</a>
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
          // Navigation and sidebar toggle
          document.addEventListener('DOMContentLoaded', () => {
            const navToggle = document.querySelector('.nav-toggle');
            const navMenu = document.querySelector('.nav-menu');
            const sidebarToggle = document.querySelector('.sidebar-toggle');
            const sidebarNav = document.querySelector('.sidebar-nav');
            const links = document.querySelectorAll('a[href^="#"]');
    
            navToggle.addEventListener('click', () => {
              const expanded = navToggle.getAttribute('aria-expanded') === 'true';
              navToggle.setAttribute('aria-expanded', !expanded);
              navMenu.classList.toggle('active');
            });
    
            sidebarToggle.addEventListener('click', () => {
              const expanded = sidebarToggle.getAttribute('aria-expanded') === 'true';
              sidebarToggle.setAttribute('aria-expanded', !expanded);
              sidebarNav.classList.toggle('active');
              sidebarToggle.querySelector('.sidebar-toggle-icon').textContent = expanded ? '☰' : '✕';
            });
    
            // Smooth scrolling
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
                  if (sidebarNav.classList.contains('active')) {
                    sidebarToggle.click();
                  }
                }
              });
            });
            // Scroll-to-top button
            const scrollToTop = document.querySelector('.scroll-to-top');
            window.addEventListener('scroll', () => {
              scrollToTop.classList.toggle('visible', window.scrollY > 300);
            });
            scrollToTop?.addEventListener('click', () => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            });

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
            if (cards.length > 0) {
              let current = 0;
              setInterval(() => {
                cards[current].style.display = 'none';
                current = (current + 1) % cards.length;
                cards[current].style.display = 'block';
              }, 5000);
            }
    
            // Navbar scroll effect
            window.addEventListener('scroll', () => {
              const navbar = document.querySelector('.navbar');
              navbar.classList.toggle('scrolled', window.scrollY > 0);
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
