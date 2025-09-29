# AI-Powered Content Management System

A modern, full-stack content management system built with Next.js, Firebase, and OpenAI. Create, manage, and optimize content with the power of artificial intelligence.

## 🚀 Features

### ✨ Core Features
- **AI Content Generation** - Generate blog posts, articles, and content using OpenAI
- **SEO Optimization** - AI-powered SEO suggestions and optimization
- **Content Management** - Full CRUD operations for blog posts
- **User Authentication** - Secure login/signup with Firebase Auth
- **Responsive Design** - Beautiful, mobile-first UI with Tailwind CSS

### 🤖 AI Features
- **Content Generation** - Create engaging content with customizable tone and length
- **SEO Optimization** - Get AI suggestions for titles, descriptions, and keywords
- **Content Ideas** - Generate creative blog post ideas
- **Content Improvement** - Enhance existing content with AI

### 📱 User Interface
- **Admin Dashboard** - Comprehensive content management interface
- **Public Blog** - Beautiful, responsive blog frontend
- **Real-time Updates** - Live content updates with Firebase
- **Search & Filter** - Advanced content discovery

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

### Backend & Database
- **Firebase Firestore** - NoSQL database
- **Firebase Authentication** - User authentication
- **Next.js API Routes** - Server-side API endpoints

### AI & External Services
- **OpenAI GPT-3.5-turbo** - AI content generation
- **OpenAI API** - AI service integration

### Development Tools
- **Node.js** - JavaScript runtime
- **npm** - Package manager
- **Git** - Version control
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking

### UI/UX Features
- **Responsive Design** - Mobile-first approach
- **Glass Morphism** - Modern UI effects
- **Dark Theme** - Professional dark interface
- **Floating Labels** - Enhanced form UX
- **Loading States** - User feedback
- **Error Boundaries** - Graceful error handling

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Firebase account
- An OpenAI API account
- Git installed

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd content-management-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the environment template and configure your credentials:
```bash
cp env.template .env.local
```

Configure your Firebase and OpenAI credentials in the `.env.local` file.

### 4. Database Setup

#### Create Firebase Collections
The app will automatically create the necessary Firestore collections when you start using it. The main collections are:
- `posts` - Blog posts and content
- `profiles` - User profiles

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Usage Guide

### 1. Getting Started
1. Sign up for an account at `/auth/signup`
2. Access the dashboard at `/dashboard`
3. Create your first post with AI assistance

### 2. Creating Content
1. Go to **Dashboard > Create Post**
2. Enter a title and use **"Generate with AI"** for content
3. Customize the generated content
4. Add SEO metadata and publish

### 3. AI Features
- **Content Generation**: Specify topic, tone, and length
- **SEO Optimization**: Get AI suggestions for better rankings
- **Content Ideas**: Generate creative post ideas
- **Content Improvement**: Enhance existing content

### 4. Managing Content
- View all posts in **Dashboard > Posts**
- Filter by status (draft, published, archived)
- Edit, delete, or publish posts
- View live blog at `/blog`

## 🎨 Customization

### Styling
- Modify Tailwind classes in components
- Update color scheme in `tailwind.config.js`
- Customize components in `src/components/`



**Built with ❤️ using AI-powered technology**