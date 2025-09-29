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

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: OpenAI GPT-3.5-turbo

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
Copy the environment template and fill in your credentials:
```bash
cp env.template .env.local
```

Fill in your `.env.local` file:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

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