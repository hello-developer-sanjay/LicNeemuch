# LIC Neemuch Website

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=22&pause=700&color=0E75B6&center=true&vCenter=true&width=800&lines=LIC+Neemuch:+Empowering+Local+Insurance+and+Agent+Recruitment;Server-Side+Rendered+React+Platform+for+Neemuch;Driving+80%25+Inquiry+Conversions+with+AWS+Lambda;Top+10+Google+Rankings+for+Local+Insurance+Queries" alt="LIC Neemuch Typing SVG" />
</p>

<p align="center">
  <a href="https://lic-neemuch-jitendra-patidar.vercel.app/"><img src="https://img.shields.io/badge/Website-Live-brightgreen" alt="Website Live"></a>
  <a href="https://github.com/yourusername/lic-neemuch"><img src="https://img.shields.io/github/stars/yourusername/lic-neemuch?style=social" alt="GitHub Stars"></a>
  <a href="https://www.linkedin.com/in/yourprofile"><img src="https://img.shields.io/badge/LinkedIn-Connect-blue" alt="LinkedIn Connect"></a>
  <a href="https://img.shields.io/badge/License-MIT-yellow"><img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT License"></a>
</p>

## 📋 Project Overview

The **LIC Neemuch Website** is a serverless, SEO-optimized React platform designed to promote Jitendra Patidar's Life Insurance Corporation (LIC) services in Neemuch district, Madhya Pradesh, and nearby areas (Manasa, Singoli, Javad, Mandsaur). Built as a freelance Full Stack project (2024–2025), it offers insurance plans (child, retirement, health, money-back) and agent recruitment opportunities, achieving **~700 monthly visitors**, **80% inquiry conversion rates**, and an **8th Google ranking** for "LIC Neemuch" queries.

Key features include server-side rendering (SSR) for fast, SEO-friendly pages, bilingual content (English/Hindi), and interactive inquiry forms. The site leverages **AWS Lambda**, **CloudFront**, **MongoDB**, and **Node.js/Express** to deliver scalable performance, with **100/100 PageSpeed scores** and optimized Cumulative Layout Shift (CLS).

---

## ✨ Features

| Feature | Description | Tech Used |
|---------|-------------|-----------|
| **Insurance Services** | Promotes LIC plans (child, retirement, health, money-back) with detailed pages. | React, MongoDB, SSR |
| **Agent Recruitment** | Drives agent sign-ups via Join page CTA (+91 7987235207). | React Router, Node.js |
| **SSR Pages** | Renders Home, Join, Services, Reviews, About, FAQs, Contact for SEO and speed. | ReactDOMServer, AWS Lambda |
| **SEO Optimization** | Achieves 8th Google ranking with meta tags and 20 structured FAQs. | react-helmet, Structured Data |
| **Bilingual Content** | Supports English/Hindi (e.g., "अभी अधिकारी को कॉल करें") for local users. | React, CSS |
| **Inquiry Forms** | Handles submissions via Contact page (`/api/lic/submit-query`). | Express, MongoDB |
| **Performance** | 100/100 PageSpeed scores and CLS 0.707 fixed for smooth UX. | Vite, CSS, Caching |

---

## 🛠️ Tech Stack

### Frontend
- **React**: Component-based UI for all pages.
- **Vite**: Fast build tool for development and production.
- **react-helmet**: SEO meta tags, Open Graph, Twitter Card, and FAQs.
- **styled-components**: CSS-in-JS for styled UI components.
- **Framer Motion**: Animations for engaging transitions.
- **FontAwesome**: Icons for visual elements.
- **react-toastify**: User feedback notifications.
- **React Router**: Client-side routing for navigation.
- **JavaScript**: Core logic for interactivity.
- **CSS**: CLS optimization (contain-intrinsic-size).

### Backend
- **Node.js**: Runtime for server-side logic (`server.js`).
- **Express**: Framework for SSR routing and APIs (`/api/lic/reviews`).
- **MongoDB**: NoSQL database for dynamic content (inquiries, reviews).
- **ReactDOMServer**: SSR rendering (`renderToString`).
- **Caching**: Eliminates infinite fetch loops in APIs.

### Infrastructure
- **AWS Lambda**: Serverless compute for SSR and APIs.
- **AWS CloudFront**: CDN for S3 assets (e.g., `jitendraprofilephoto.jpg`).
- **AWS S3**: Static asset storage.
- **Vercel**: Deployment platform for hosting.
- **IAM**: Secure S3/CloudFront access (Origin Access Identity).
- **CORS**: Configured for API/asset access.

### Other
- **SEO**: Structured data for 8th Google ranking.
- **PageSpeed Optimization**: 100/100 scores for posts.
- **Hydration**: Fixed mismatches for interactive forms.

---

## 🚀 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/lic-neemuch.git
   cd lic-neemuch
