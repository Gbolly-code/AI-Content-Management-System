# 🚀 Deployment Guide

This guide will help you deploy your AI-powered Content Management System to various platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ All environment variables configured
- ✅ Supabase database set up with proper tables
- ✅ OpenAI API key with sufficient credits
- ✅ Git repository with your code

## 🌐 Deployment Options

### 1. Vercel (Recommended) - FREE

Vercel is the best option for Next.js applications with excellent performance and easy setup.

#### Step 1: Prepare Your Repository
\`\`\`bash
# Commit all changes
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

#### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository
5. Configure environment variables (see below)
6. Click "Deploy"

#### Step 3: Environment Variables in Vercel
Add these in your Vercel project settings → Environment Variables:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
\`\`\`

#### Step 4: Configure Supabase
Update your Supabase project settings:
1. Go to Authentication → URL Configuration
2. Add your Vercel URL to "Site URL" and "Redirect URLs"
3. Add \`https://your-app.vercel.app/auth/callback\` to redirect URLs

### 2. Netlify - FREE

Netlify is another excellent option with great CI/CD features.

#### Step 1: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: \`npm run build\`
   - Publish directory: \`.next\`
4. Add environment variables (same as Vercel)

#### Step 2: Configure Redirects
Create \`netlify.toml\` in your project root:
\`\`\`toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
\`\`\`

### 3. Railway - FREE Tier Available

Railway offers a free tier and easy deployment.

#### Step 1: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables
4. Deploy automatically

### 4. Self-Hosted (VPS/Cloud)

For more control, you can deploy to your own server.

#### Step 1: Server Setup
\`\`\`bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2
\`\`\`

#### Step 2: Deploy Application
\`\`\`bash
# Clone repository
git clone your-repo-url
cd content-management-system

# Install dependencies
npm install

# Build application
npm run build

# Start with PM2
pm2 start npm --name "ai-cms" -- start
pm2 save
pm2 startup
\`\`\`

#### Step 3: Configure Nginx (Optional)
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

## 🔧 Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| \`NEXT_PUBLIC_SUPABASE_URL\` | Your Supabase project URL | \`https://xyz.supabase.co\` |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Supabase anonymous key | \`eyJhbGciOiJIUzI1NiIs...\` |
| \`OPENAI_API_KEY\` | OpenAI API key | \`sk-...\` |
| \`NEXT_PUBLIC_APP_URL\` | Your app URL | \`https://your-app.vercel.app\` |

### Getting Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL → \`NEXT_PUBLIC_SUPABASE_URL\`
   - Project API keys → anon public → \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`

### Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up/Login
3. Go to API Keys
4. Create new secret key → \`OPENAI_API_KEY\`

## 🗄️ Database Setup

### Option 1: Use the SQL File
1. Go to your Supabase project
2. Navigate to SQL Editor
3. Copy and paste the contents of \`database-setup.sql\`
4. Run the script

### Option 2: Manual Setup
1. Create tables manually in Supabase
2. Set up Row Level Security policies
3. Configure authentication settings

## 🔐 Security Configuration

### Supabase Security
1. **Enable RLS**: Row Level Security is already configured
2. **Configure Auth**: Set up authentication providers
3. **API Keys**: Keep your service role key secret

### Domain Configuration
1. **HTTPS**: Always use HTTPS in production
2. **CORS**: Configure CORS in Supabase if needed
3. **Environment Variables**: Never commit secrets to Git

## 📊 Monitoring & Analytics

### Vercel Analytics
- Built-in analytics with Vercel
- Performance monitoring
- Usage statistics

### Custom Monitoring
- Add Google Analytics
- Set up error tracking (Sentry)
- Monitor API usage

## 🚨 Troubleshooting

### Common Deployment Issues

#### 1. Build Failures
\`\`\`bash
# Check build locally
npm run build

# Common fixes
npm install
rm -rf .next
npm run build
\`\`\`

#### 2. Environment Variables
- Ensure all required variables are set
- Check variable names (case-sensitive)
- Verify Supabase and OpenAI keys are valid

#### 3. Database Connection
- Verify Supabase URL and keys
- Check if tables exist
- Ensure RLS policies are correct

#### 4. Authentication Issues
- Update redirect URLs in Supabase
- Check domain configuration
- Verify OAuth settings

### Performance Optimization

#### 1. Image Optimization
- Use Next.js Image component
- Optimize image sizes
- Consider CDN for images

#### 2. Database Optimization
- Add proper indexes
- Use database connection pooling
- Monitor query performance

#### 3. Caching
- Enable Vercel Edge Caching
- Use Supabase caching
- Implement client-side caching

## 💰 Cost Estimation

### Free Tier Limits

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **Vercel** | 100GB bandwidth/month | $20/month for Pro |
| **Supabase** | 500MB database, 50k users | $25/month for Pro |
| **OpenAI** | Pay-per-use | ~$0.002 per 1K tokens |

### Monthly Cost Estimate
- **Small site** (1k visitors): ~$5-15/month
- **Medium site** (10k visitors): ~$25-50/month
- **Large site** (100k visitors): ~$100-200/month

## 🎯 Post-Deployment Checklist

- [ ] Test all functionality (login, content creation, AI features)
- [ ] Verify environment variables are set correctly
- [ ] Check database connection and data
- [ ] Test authentication flow
- [ ] Verify AI content generation works
- [ ] Check responsive design on mobile
- [ ] Set up monitoring and analytics
- [ ] Configure custom domain (optional)
- [ ] Set up backup strategy
- [ ] Document any custom configurations

## 🆘 Getting Help

If you encounter issues:

1. **Check Logs**: Review deployment logs for errors
2. **Test Locally**: Ensure everything works locally first
3. **Documentation**: Review platform-specific docs
4. **Community**: Check GitHub issues and discussions
5. **Support**: Contact platform support if needed

---

**Happy Deploying! 🚀**

Your AI-powered CMS is now ready to help you create amazing content!
