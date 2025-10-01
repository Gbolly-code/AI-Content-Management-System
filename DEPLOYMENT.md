# 🚀 Deployment Guide

This guide will help you deploy your AI-powered Content Management System to various platforms.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ All environment variables configured
- ✅ Firebase project set up with Firestore and Authentication
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
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
\`\`\`

#### Step 4: Configure Firebase
Update your Firebase project settings:
1. Go to Authentication → Settings → Authorized domains
2. Add your Vercel URL to authorized domains
3. Configure Firestore security rules (see FIREBASE-SETUP.md)

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
| \`NEXT_PUBLIC_FIREBASE_API_KEY\` | Firebase API key | \`AIzaSyC...\` |
| \`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN\` | Firebase auth domain | \`your-project.firebaseapp.com\` |
| \`NEXT_PUBLIC_FIREBASE_PROJECT_ID\` | Firebase project ID | \`your-project-id\` |
| \`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET\` | Firebase storage bucket | \`your-project.appspot.com\` |
| \`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID\` | Firebase messaging sender ID | \`123456789\` |
| \`NEXT_PUBLIC_FIREBASE_APP_ID\` | Firebase app ID | \`1:123456789:web:abc123\` |
| \`OPENAI_API_KEY\` | OpenAI API key | \`sk-...\` |
| \`NEXT_PUBLIC_APP_URL\` | Your app URL | \`https://your-app.vercel.app\` |

### Getting Your Firebase Credentials

1. Go to your [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings → General
4. Scroll down to "Your apps" section
5. Copy the config values from your web app

### Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign up/Login
3. Go to API Keys
4. Create new secret key → \`OPENAI_API_KEY\`

## 🗄️ Database Setup

### Firebase Firestore Setup
1. Go to your Firebase project
2. Navigate to Firestore Database
3. Create database in production mode
4. Set up security rules (see FIREBASE-SETUP.md)
5. Enable Authentication with Email/Password

### Collections Setup
The application will automatically create the required collections:
- \`posts\` - Blog posts and content
- \`profiles\` - User profiles

## 🔐 Security Configuration

### Firebase Security
1. **Firestore Rules**: Configure security rules for collections
2. **Authentication**: Set up authentication providers
3. **API Keys**: Keep your Firebase config secure

### Domain Configuration
1. **HTTPS**: Always use HTTPS in production
2. **CORS**: Configure CORS in Firebase if needed
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
- Verify Firebase and OpenAI keys are valid

#### 3. Database Connection
- Verify Firebase project ID and keys
- Check if Firestore is enabled
- Ensure security rules are correct

#### 4. Authentication Issues
- Update authorized domains in Firebase
- Check domain configuration
- Verify authentication settings

### Performance Optimization

#### 1. Image Optimization
- Use Next.js Image component
- Optimize image sizes
- Consider CDN for images

#### 2. Database Optimization
- Add proper indexes in Firestore
- Use Firebase caching
- Monitor query performance

#### 3. Caching
- Enable Vercel Edge Caching
- Use Firebase caching
- Implement client-side caching

## 💰 Cost Estimation

### Free Tier Limits

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| **Vercel** | 100GB bandwidth/month | $20/month for Pro |
| **Firebase** | 1GB storage, 50k reads/day | $25/month for Blaze |
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
