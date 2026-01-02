# Muhammad Saad's Portfolio

A modern, fully responsive portfolio website showcasing projects, experience, and technical expertise. Built with Next.js 16, TypeScript, and cutting-edge web technologies.

## Overview

This portfolio is a professional web application designed to showcase full-stack development capabilities, AI/ML expertise, and creative problem-solving. The site features interactive animations, smooth scrolling, and a seamless contact form integrated with email delivery.

## Features

- **Responsive Design**: Optimized for mobile, tablet, and desktop devices with professional scaling across all breakpoints
- **Interactive Hero Section**: Dynamic text animations and rotating taglines
- **Project Showcase**: Filterable project gallery with live demos and GitHub links
- **Carousel Component**: Responsive carousel with auto-play, drag support, and adaptive sizing
- **Skills Section**: Comprehensive skills breakdown by category (Web, Mobile, AI/ML, SaaS)
- **Experience Timeline**: Interactive stepper component displaying work experience and achievements
- **Contact Form**: Server-side email integration using Resend for reliable message delivery
- **Smooth Scrolling**: Lenis integration for physics-based smooth scroll behavior
- **Visual Effects**: Aurora background, dithering effects, ASCII art, and electric borders
- **Performance Optimized**: Next.js 16 with Turbopack compilation and static generation

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with PostCSS
- **Animations**: Framer Motion, GSAP
- **3D Graphics**: Three.js, React Three Fiber, OGL
- **Smooth Scroll**: Lenis
- **Icons**: React Icons, Simpleicons

### Backend & Services
- **API Routes**: Next.js API Routes
- **Email Service**: Resend
- **Deployment**: Vercel

### Development
- **Linting**: ESLint 9
- **Type Checking**: TypeScript strict mode
- **Build Tool**: Turbopack (Next.js default)

## Project Structure

```
saad-portfolio/
 app/
    api/
       contact/
           route.ts          # Server-side contact form handler
    layout.tsx                 # Root layout with viewport config
    page.tsx                   # Main portfolio page
    globals.css                # Global styles and animations
 components/                    # Reusable React components
    Aurora.tsx                 # Animated aurora background
    Carousel.tsx               # Responsive carousel component
    CardNav.tsx                # Navigation with card menu
    ElectricBorder.tsx         # Animated electric border effect
    TextPressure.tsx           # Interactive pressure-sensitive text
    Dither.tsx                 # Canvas-based dithering effect
    PixelCard.tsx              # Pixel-based interactive card
    MagicBento.tsx             # Bento-style grid layout
    ScrollStack.tsx            # Stack scrolling component
    Stepper.tsx                # Multi-step experience stepper
    [other components]         # Additional visual components
 assets/                        # Project images and assets
 types/                         # TypeScript type definitions
 public/                        # Static assets (logo, fonts)
 package.json                   # Dependencies and scripts
 tsconfig.json                  # TypeScript configuration
 next.config.ts                 # Next.js configuration
 tailwind.config.ts             # Tailwind CSS configuration
 README.md                      # This file
```

## Installation & Setup

### Prerequisites
- Node.js 18.17 or later
- npm or yarn package manager

### Local Development

1. Clone the repository:
`ash
git clone https://github.com/saadmdev/portfolio.git
cd portfolio
`

2. Install dependencies:
`ash
npm install
`

3. Create a .env.local file for local development:
`ash
RESEND_API_KEY=your_resend_api_key
CONTACT_TO_EMAIL=your.email@example.com
CONTACT_FROM_EMAIL=noreply@yourdomain.com
`

4. Start the development server:
`ash
npm run dev
`

5. Open http://localhost:3000 in your browser to see the portfolio.

## Building for Production

`ash
npm run build
npm run start
`

## Scripts

- 
pm run dev - Start development server with hot reload
- 
pm run build - Build optimized production bundle
- 
pm run start - Start production server
- 
pm run lint - Run ESLint for code quality checks

## Email Configuration

The contact form uses Resend for server-side email delivery. To enable email sending:

1. Sign up at Resend.com
2. Get your API key from the Resend dashboard
3. Add environment variables:
   - RESEND_API_KEY: Your Resend API key
   - CONTACT_TO_EMAIL: Destination email (where you receive messages)
   - CONTACT_FROM_EMAIL: Verified sender address in Resend
4. Verify your sender domain/email in Resend dashboard

For local testing, use .env.local. For Vercel deployment, add secrets in project settings.

## Deployment on Vercel

1. Push code to GitHub
2. Visit Vercel.com and sign in with GitHub
3. Click "New Project" and select this repository
4. Add environment variables in project settings:
   - RESEND_API_KEY
   - CONTACT_TO_EMAIL
   - CONTACT_FROM_EMAIL
5. Click Deploy

Vercel will automatically build and deploy the project. Your portfolio will be live at your-project.vercel.app.

## Performance & Accessibility

- Fully responsive across all device sizes (320px to 4K+)
- Optimized images using Next.js Image component
- Smooth animations with performance in mind
- Semantic HTML and ARIA labels
- Mobile-friendly touch interactions
- Keyboard navigation support

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available under the MIT License.

## Contact

For inquiries and collaboration opportunities:

- Email: devsaadm@gmail.com
- GitHub: saadmdev (https://github.com/saadmdev)
- LinkedIn: Muhammad Saad (https://www.linkedin.com/in/muhammad-saad-a4779b38a/)

## Acknowledgments

- Built with Next.js (https://nextjs.org)
- Styling with Tailwind CSS (https://tailwindcss.com)
- Animations powered by Framer Motion (https://www.framer.com/motion) and GSAP (https://gsap.com)
- 3D graphics with Three.js (https://threejs.org)
- Email service by Resend (https://resend.com)
- Deployed on Vercel (https://vercel.com)
