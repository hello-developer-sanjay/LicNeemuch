const express = require('express');
const compression = require('compression');

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

router.get('/', async (req, res) => {
  console.log('SSR route hit for /services at', new Date().toISOString());

  try {
    const pageUrl = 'https://www.licneemuch.space/services';
    const metaTitle = 'LIC Neemuch Services: Premium Life Insurance Plans';
    const metaDescription =
      'Discover life insurance plans at LIC Neemuch with Jitendra Patidar. Term, endowment, ULIPs, pension & more tailored for families in Neemuch, Madhya Pradesh.';
      const logoImage = 'https://d12uvtgcxr5qif.cloudfront.net/images/html_2025-06-12_5bc78c6a-1a4b-4908-a854-356cce5ac68f.webp';
      const metaImage = 'https://d12uvtgcxr5qif.cloudfront.net/images/react_2025-06-12_4bd13d82-4fba-4a8e-8b2f-3c4d66b9f463.webp';
        const metaKeywords =
      'LIC Neemuch Services, Jitendra Patidar, term insurance, endowment plans, ULIPs, pension plans, Neemuch insurance, financial planning';

    // Structured Data (FAQPage)
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
            name: 'What types of insurance plans does LIC Neemuch offer?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'LIC Neemuch offers term insurance, endowment plans, ULIPs, pension plans, child plans, and health insurance tailored to your needs.',
            },
          },
          {
            '@type': 'Question',
            name: 'How can Jitendra Patidar help with financial planning?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Jitendra Patidar provides personalized advice to select the best LIC plans for your financial goals in Neemuch.',
            },
          },
        ],
      },
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
            <a href="/services" class="nav-link active" aria-current="page" aria-label="Insurance Services">Services</a>
            <a href="/about" class="nav-link" aria-label="About Us">About</a>
            <a href="/faqs" class="nav-link" aria-label="LIC FAQs">LIC FAQs</a>

          </div>
        </nav>
        <div class="hero-section" aria-labelledby="hero-title">
          <div class="hero-content">
            <h1 class="hero-title" id="hero-title" aria-label="Premium Life Insurance Services in Neemuch">
              <span lang="en">Premium Life Insurance Services</span>
              <span lang="hi" class="hidden">प्रीमियम जीवन बीमा सेवाएँ</span>
            </h1>
            <p class="hero-subtitle" lang="en">
              Discover tailored insurance plans with Jitendra Patidar at LIC Neemuch, Madhya Pradesh.
            </p>
            <p class="hero-subtitle" lang="hi" class="hidden">
              नीमच, मध्य प्रदेश में जीतेंद्र पाटीदार के साथ अनुकूलित बीमा योजनाएँ खोजें।
            </p>
            <div class="hero-cta">
              <a href="tel:+917987235207" class="cta-button" aria-label="Contact Jitendra Patidar">
                Contact Now <span class="fa-icon">📞</span>
              </a>
              <a href="#overview" class="cta-button secondary" aria-label="Explore Insurance Plans">
                Explore Plans <span class="fa-icon">➡️</span>
              </a>
            </div>
          </div>
          <div class="hero-image">
            <img src="${metaImage}" alt="LIC Neemuch Services" loading="eager" width="500" height="333" onerror="this.src='https://via.placeholder.com/500x333?text=Image+Not+Found';">
          </div>
        </div>
      </header>
      <div class="container">
        <aside class="sidebar" aria-label="Section navigation">
          <button class="sidebar-toggle" aria-label="Toggle sidebar" aria-expanded="true">
            <span class="sidebar-toggle-icon">☰</span>
          </button>
          <nav class="sidebar-nav" aria-label="Section links">
            <a href="#overview" class="sidebar-link" aria-label="Services Overview">Overview</a>
            <a href="#term" class="sidebar-link" aria-label="Term Insurance">Term Insurance</a>
            <a href="#endowment" class="sidebar-link" aria-label="Endowment Plans">Endowment Plans</a>
            <a href="#ulip" class="sidebar-link" aria-label="ULIPs">ULIPs</a>
            <a href="#pension" class="sidebar-link" aria-label="Pension Plans">Pension Plans</a>
            <a href="#child" class="sidebar-link" aria-label="Child Plans">Child Plans</a>
            <a href="#health" class="sidebar-link" aria-label="Health Insurance">Health Insurance</a>
            <a href="#faq" class="sidebar-link" aria-label="Frequently Asked Questions">FAQs</a>
          </nav>
        </aside>
        <main class="main-content" role="main">
          <article aria-labelledby="overview-heading">
            <section class="section" id="overview" aria-labelledby="overview-heading">
              <h2 id="overview-heading">Our Premium Insurance Services</h2>
              <p lang="en">
                At LIC Neemuch, led by Jitendra Patidar, we offer a wide range of life insurance and financial planning solutions tailored to your needs in Neemuch, Madhya Pradesh. From protection to wealth creation, our plans ensure your financial security.
              </p>
              <p lang="hi">
                एलआईसी नीमच में, जीतेंद्र पाटीदार के नेतृत्व में, हम नीमच, मध्य प्रदेश में आपकी आवश्यकताओं के अनुरूप जीवन बीमा और वित्तीय योजना समाधानों की विस्तृत श्रृंखला प्रदान करते हैं। सुरक्षा से लेकर धन सृजन तक, हमारी योजनाएँ आपकी वित्तीय सुरक्षा सुनिश्चित करती हैं।
              </p>
              <ul class="benefits-list">
                <li>Personalized financial advice</li>
                <li>Trusted LIC products</li>
                <li>Transparent claim process</li>
                <li>Expert support in Neemuch</li>
              </ul>
              <p lang="en">
                Learn more about Jitendra Patidar’s expertise in our <a href="https://zedemy.vercel.app/post/lic-neemuch-why-jitendra-patidar-is-the-trusted-insurance-expert" target="_blank" rel="noopener noreferrer" class="content-link">Hindi blog</a>.
              </p>
              <p lang="hi">
                जीतेंद्र पाटीदार की विशेषज्ञता के बारे में और जानें हमारे <a href="https://zedemy.vercel.app/post/lic-neemuch-why-jitendra-patidar-is-the-trusted-insurance-expert" target="_blank" rel="noopener noreferrer" class="content-link">हिंदी ब्लॉग</a> में।
              </p>
            </section>
          </article>

          <article aria-labelledby="term-heading">
            <section class="section" id="term" aria-labelledby="term-heading">
              <h2 id="term-heading">Term Insurance</h2>
              <p lang="en">
                Term insurance provides high coverage at affordable premiums, ensuring your family’s financial security in case of unforeseen events.
              </p>
              <p lang="hi">
                टर्म इंश्योरेंस किफायती प्रीमियम पर उच्च कवरेज प्रदान करता है, जो अप्रत्याशित घटनाओं में आपके परिवार की वित्तीय सुरक्षा सुनिश्चित करता है।
              </p>
              <h3>Features</h3>
              <ul class="benefits-list">
                <li>High sum assured at low cost</li>
                <li>Flexible policy terms</li>
                <li>Tax benefits under Section 80C</li>
                <li>Riders for additional coverage</li>
              </ul>
              <h3>Popular Plans</h3>
              <div class="card-grid">
                <div class="card">
                  <h3>LIC e-Term</h3>
                  <p>Online term plan with high coverage.</p>
                </div>
                <div class="card">
                  <h3>LIC Amulya Jeevan</h3>
                  <p>Pure protection plan for your family.</p>
                </div>
              </div>
            </section>
          </article>

          <article aria-labelledby="endowment-heading">
            <section class="section" id="endowment" aria-labelledby="endowment-heading">
              <h2 id="endowment-heading">Endowment Plans</h2>
              <p lang="en">
                Endowment plans combine savings and insurance, offering maturity benefits along with life coverage.
              </p>
              <p lang="hi">
                एंडोमेंट प्लान बचत और बीमा को जोड़ते हैं, जो परिपक्वता लाभ के साथ-साथ जीवन कवरेज प्रदान करते हैं।
              </p>
              <h3>Features</h3>
              <ul class="benefits-list">
                <li>Guaranteed maturity benefits</li>
                <li>Life coverage during policy term</li>
                <li>Bonuses enhance returns</li>
                <li>Tax benefits under Section 80C and 10(10D)</li>
              </ul>
              <h3>Popular Plans</h3>
              <div class="card-grid">
                <div class="card">
                  <h3>LIC Jeevan Anand</h3>
                  <p>Lifetime coverage with savings.</p>
                </div>
                <div class="card">
                  <h3>LIC New Endowment</h3>
                  <p>Simple plan with guaranteed returns.</p>
                </div>
              </div>
            </section>
          </article>

          <article aria-labelledby="ulip-heading">
            <section class="section" id="ulip" aria-labelledby="ulip-heading">
              <h2 id="ulip-heading">Unit Linked Insurance Plans (ULIPs)</h2>
              <p lang="en">
                ULIPs offer market-linked returns combined with insurance coverage, ideal for wealth creation and protection.
              </p>
              <p lang="hi">
                यूलिप्स बाजार से जुड़े रिटर्न के साथ बीमा कवरेज प्रदान करते हैं, जो धन सृजन और सुरक्षा के लिए आदर्श हैं।
              </p>
              <h3>Features</h3>
              <ul class="benefits-list">
                <li>Investment in equity/debt funds</li>
                <li>Flexibility to switch funds</li>
                <li>Life coverage</li>
                <li>Tax benefits under Section 80C</li>
              </ul>
              <h3>Popular Plans</h3>
              <div class="card-grid">
                <div class="card">
                  <h3>LIC Wealth Plus</h3>
                  <p>Market-linked growth with protection.</p>
                </div>
                <div class="card">
                  <h3>LIC New Endowment Plus</h3>
                  <p>Flexible ULIP with multiple fund options.</p>
                </div>
              </div>
            </section>
          </article>

          <article aria-labelledby="pension-heading">
            <section class="section" id="pension" aria-labelledby="pension-heading">
              <h2 id="pension-heading">Pension Plans</h2>
              <p lang="en">
                Pension plans ensure a secure retirement with regular income, allowing you to live comfortably post-retirement.
              </p>
              <p lang="hi">
                पेंशन योजनाएँ नियमित आय के साथ एक सुरक्षित सेवानिवृत्ति सुनिश्चित करती हैं, जिससे आप सेवानिवृत्ति के बाद आराम से जी सकते हैं।
              </p>
              <h3>Features</h3>
              <ul class="benefits-list">
                <li>Regular pension payments</li>
                <li>Flexible premium payment terms</li>
                <li>Option for annuity types</li>
                <li>Tax benefits under Section 80CCC</li>
              </ul>
              <h3>Popular Plans</h3>
              <div class="card-grid">
                <div class="card">
                  <h3>LIC Jeevan Shanti</h3>
                  <p>Immediate or deferred annuity options.</p>
                </div>
                <div class="card">
                  <h3>LIC Jeevan Akshay</h3>
                  <p>Single premium pension plan.</p>
                </div>
              </div>
            </section>
          </article>

          <article aria-labelledby="child-heading">
            <section class="section" id="child" aria-labelledby="child-heading">
              <h2 id="child-heading">Child Plans</h2>
              <p lang="en">
                Child plans secure your child’s future by funding education and other milestones, even in your absence.
              </p>
              <p lang="hi">
                चाइल्ड प्लान आपके बच्चे के भविष्य को सुरक्षित करते हैं, उनकी शिक्षा और अन्य मील के पत्थरों को आपकी अनुपस्थिति में भी वित्तपोषित करते हैं।
              </p>
              <h3>Features</h3>
              <ul class="benefits-list">
                <li>Maturity benefits for child’s goals</li>
                <li>Life coverage for parent</li>
                <li>Waiver of premium rider</li>
                <li>Tax benefits under Section 80C</li>
              </ul>
              <h3>Popular Plans</h3>
              <div class="card-grid">
                <div class="card">
                  <h3>LIC Jeevan Tarun</h3>
                  <p>Education and growth funding for children.</p>
                </div>
                <div class="card">
                  <h3>LIC New Children’s Money Back</h3>
                  <p>Periodic payouts for child’s needs.</p>
                </div>
              </div>
            </section>
          </article>

          <article aria-labelledby="health-heading">
            <section class="section" id="health" aria-labelledby="health-heading">
              <h2 id="health-heading">Health Insurance</h2>
              <p lang="en">
                LIC’s health insurance plans cover medical expenses, ensuring financial support during health emergencies.
              </p>
              <p lang="hi">
                एलआईसी की स्वास्थ्य बीमा योजनाएँ चिकित्सा व्यय को कवर करती हैं, जो स्वास्थ्य आपात स्थिति के दौरान वित्तीय सहायता सुनिश्चित करती हैं।
              </p>
              <h3>Features</h3>
              <ul class="benefits-list">
                <li>Hospitalization coverage</li>
                <li>Critical illness benefits</li>
                <li>Cashless treatment options</li>
                <li>Tax benefits under Section 80D</li>
              </ul>
              <h3>Popular Plans</h3>
              <div class="card-grid">
                <div class="card">
                  <h3>LIC Cancer Cover</h3>
                  <p>Financial support for cancer treatment.</p>
                </div>
                <div class="card">
                  <h3>LIC Arogya Rakshak</h3>
                  <p>Comprehensive health coverage.</p>
                </div>
              </div>
            </section>
          </article>

          <article aria-labelledby="faq-heading">
            <section class="section" id="faq" aria-labelledby="faq-heading">
              <h2 id="faq-heading">Frequently Asked Questions</h2>
              <div class="faq-list">
                <div class="card">
                  <h3>Which LIC plan is best for retirement planning?</h3>
                  <p lang="en">LIC Jeevan Shanti and Jeevan Akshay are ideal for secure retirement with regular income.</p>
                  <p lang="hi">एलआईसी जीवन शांति और जीवन अक्षय नियमित आय के साथ सुरक्षित सेवानिवृत्ति के लिए आदर्श हैं।</p>
                </div>
                <div class="card">
                  <h3>Can I buy LIC plans online through LIC Neemuch?</h3>
                  <p lang="en">Yes, Jitendra Patidar can guide you through online and offline plan purchases.</p>
                  <p lang="hi">हां, जीतेंद्र पाटीदार आपको ऑनलाइन और ऑफलाइन योजना खरीद में मार्गदर्शन कर सकते हैं।</p>
                </div>
                <div class="card">
                  <h3>What are the tax benefits of LIC plans?</h3>
                  <p lang="en">Premiums qualify for deductions under Sections 80C, 80CCC, and 80D, and maturity benefits are tax-free under Section 10(10D).</p>
                  <p lang="hi">प्रीमियम धारा 80C, 80CCC, और 80D के तहत कटौती के लिए योग्य हैं, और परिपक्वता लाभ धारा 10(10D) के तहत कर-मुक्त हैं।</p>
                </div>
              </div>
            </section>
          </article>

          <section class="section cta-section" aria-labelledby="cta-heading">
            <h2 id="cta-heading">Secure Your Future Today</h2>
            <p lang="en">
              Choose the perfect LIC plan with Jitendra Patidar at LIC Neemuch. Contact us to start your financial journey!
            </p>
            <p lang="hi">
              एलआईसी नीमच में जीतेंद्र पाटीदार के साथ सही एलआईसी योजना चुनें। अपनी वित्तीय यात्रा शुरू करने के लिए हमसे संपर्क करें!
            </p>
            <a href="tel:+917987235207" class="cta-button" aria-label="Get Started with LIC Plans">
              Get Started <span class="fa-icon">⭐</span>
            </a>
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
        <meta name="twitter:site" content="@jay7268patidar">
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
            --primary-color: #FF2E63; /* Neon Crimson */
            --secondary-color: #00FFF5; /* Electric Cyan */
            --accent-color: #FFAA00; /* Fiery Amber */
            --bg-start: #0B0D17; /* Abyss Black */
            --bg-end: #05070F; /* Starless Night */
            --text-color: #DDE6ED; /* Lunar White */
            --card-border: rgba(255, 46, 99, 0.4); /* Crimson Haze */
            --shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
            --glow: 0 0 10px var(--accent-color), 0 0 20px rgba(255, 170, 0, 0.5);
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
            background: rgba(5, 7, 15, 0.97);
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
            background: rgba(5, 7, 15, 1);
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
            background: linear-gradient(90deg, rgba(255, 46, 99, 0.08), transparent);
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
            contain: content;
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
            background: rgba(5, 7, 15, 0.9);
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
            background: rgba(255, 46, 99, 0.1);
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
            position: relative;
            z-index: 1;
            background: transparent;
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

          .faq-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .cta-section {
            text-align: center;
            padding: 1.5rem;
            background: rgba(255, 46, 99, 0.05);
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
              background: rgba(5, 7, 15, 0.95);
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
                  if (sidebarNav.classList.contains('active') && window.innerWidth <= 1024) {
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
    
            // Navbar scroll effect
            window.addEventListener('scroll', () => {
              const navbar = document.querySelector('.navbar');
              navbar.classList.toggle('scrolled', window.scrollY > 50);
            });
          });
        </script>
      </head>
      <body>
        <div id="root">${htmlContent}</div>
      </body>
    </html>
    `;

    console.log('SSR HTML generated for /services, length:', html.length);
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).send(html);
    console.log('SSR response sent for /services at', new Date().toISOString());
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
            background: linear-gradient(180deg, #0B0D17, #05070F);
            color: #DDE6ED;
            text-align: center;
            padding: 2rem;
            margin: 0;
          }
          .content-error {
            color: #FF2E63;
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
          a {
            color: #FF2E63;
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
  res.redirect(301, '/services');
});

module.exports = router;