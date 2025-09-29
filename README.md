# AI-Powered Content Management System

A modern, full-stack content management system built with Next.js, Supabase, and OpenAI. Create, manage, and optimize content with the power of artificial intelligence.

## 🚀 Features

### ✨ Core Features
- **AI Content Generation** - Generate blog posts, articles, and content using OpenAI
- **SEO Optimization** - AI-powered SEO suggestions and optimization
- **Content Management** - Full CRUD operations for blog posts
- **User Authentication** - Secure login/signup with Supabase Auth
- **Responsive Design** - Beautiful, mobile-first UI with Tailwind CSS

### 🤖 AI Features
- **Content Generation** - Create engaging content with customizable tone and length
- **SEO Optimization** - Get AI suggestions for titles, descriptions, and keywords
- **Content Ideas** - Generate creative blog post ideas
- **Content Improvement** - Enhance existing content with AI

### 📱 User Interface
- **Admin Dashboard** - Comprehensive content management interface
- **Public Blog** - Beautiful, responsive blog frontend
- **Real-time Updates** - Live content updates with Supabase
- **Search & Filter** - Advanced content discovery

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-3.5-turbo
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account
- An OpenAI API account
- Git installed

## 🚀 Quick Start

### 1. Clone the Repository
\`\`\`bash
git clone <your-repo-url>
cd content-management-system
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Environment Setup
Copy the environment template and fill in your credentials:
\`\`\`bash
cp env.template .env.local
\`\`\`

Fill in your `.env.local` file:
\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 4. Database Setup

#### Create Supabase Tables
Run these SQL commands in your Supabase SQL editor:

\`\`\`sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_posts table
CREATE TABLE content_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view published posts" ON content_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Users can view own posts" ON content_posts FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Users can create posts" ON content_posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update own posts" ON content_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own posts" ON content_posts FOR DELETE USING (auth.uid() = author_id);

-- Create indexes
CREATE INDEX idx_content_posts_status ON content_posts(status);
CREATE INDEX idx_content_posts_author ON content_posts(author_id);
CREATE INDEX idx_content_posts_published ON content_posts(published_at);
\`\`\`

### 5. Run the Development Server
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy!

3. **Environment Variables in Vercel**
   Add these in your Vercel project settings:
   - \`NEXT_PUBLIC_SUPABASE_URL\`
   - \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
   - \`OPENAI_API_KEY\`
   - \`NEXT_PUBLIC_APP_URL\` (your production URL)

### Alternative Deployment Options

- **Netlify**: Use the Netlify CLI or GitHub integration
- **Railway**: Connect your GitHub repo for automatic deployments
- **Docker**: Use the included Dockerfile for containerized deployment

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
- Update color scheme in \`tailwind.config.js\`
- Customize components in \`src/components/\`

### AI Configuration
- Adjust AI prompts in \`src/lib/openai.ts\`
- Modify content generation parameters
- Add new AI features

### Database Schema
- Extend tables in Supabase
- Update TypeScript types in \`src/lib/supabase.ts\`
- Add new fields to forms

## 🔧 Configuration

### OpenAI Settings
- Model: GPT-3.5-turbo (configurable)
- Temperature: 0.7 for content generation
- Max tokens: 2000 per request

### Supabase Settings
- Row Level Security enabled
- Real-time subscriptions available
- Authentication providers configurable

## 📊 Features Overview

| Feature | Status | Description |
|---------|--------|-------------|
| ✅ User Authentication | Complete | Login, signup, Google OAuth |
| ✅ AI Content Generation | Complete | GPT-powered content creation |
| ✅ SEO Optimization | Complete | AI SEO suggestions |
| ✅ Content Management | Complete | Full CRUD operations |
| ✅ Public Blog | Complete | Responsive blog frontend |
| ✅ Admin Dashboard | Complete | Content management interface |
| ✅ Search & Filter | Complete | Advanced content discovery |
| ✅ Responsive Design | Complete | Mobile-first UI |

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables**
   - Ensure all required env vars are set
   - Check Supabase and OpenAI API keys

2. **Database Connection**
   - Verify Supabase URL and anon key
   - Check if tables are created properly

3. **AI Generation Failing**
   - Verify OpenAI API key
   - Check API usage limits

4. **Authentication Issues**
   - Ensure Supabase Auth is configured
   - Check redirect URLs

### Getting Help
- Check the [Issues](https://github.com/your-repo/issues) page
- Review Supabase and OpenAI documentation
- Join our community discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the backend infrastructure
- [OpenAI](https://openai.com/) for the AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful styling
- [Vercel](https://vercel.com/) for seamless deployment

---

**Built with ❤️ using AI-powered technology**
