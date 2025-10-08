# Environment Variables Setup Guide

## 🔐 Security First

**IMPORTANT:** Never commit your `.env.local` file to Git! It's already in `.gitignore`.

## Local Development Setup

1. **Create `.env.local` file** in the root directory:

```bash
# Copy the template
cp env.template .env.local
```

2. **Fill in your actual values** in `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# OpenAI Configuration (NO NEXT_PUBLIC_ prefix - keeps it server-side)
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Where to Get Your API Keys

### Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one)
3. Click the gear icon → Project Settings
4. Scroll down to "Your apps" section
5. Click on your web app (or create one)
6. Copy all the config values from `firebaseConfig` object

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Go to API Keys section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. **IMPORTANT:** Store it securely - you won't see it again!

## Vercel Deployment

When deploying to Vercel, add these environment variables in:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

Add each variable for all environments (Production, Preview, Development):

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
OPENAI_API_KEY
NEXT_PUBLIC_APP_URL
```

## Understanding Variable Prefixes

### `NEXT_PUBLIC_` prefix
- **Exposed to browser** (client-side)
- Safe for Firebase config (Firebase keys are meant to be public)
- Use for any value that needs to be accessed in React components

### No prefix (e.g., `OPENAI_API_KEY`)
- **Server-side only** (never exposed to browser)
- Use for sensitive keys like OpenAI API key
- Only accessible in API routes and server components

## Verification

After setting up, verify your configuration:

```bash
# Start development server
npm run dev

# Check console for Firebase initialization
# Should see: "Firebase initialized successfully"

# Test AI features
# Go to /dashboard/ai and try generating content
```

## Troubleshooting

### Firebase not connecting?
- Check all `NEXT_PUBLIC_FIREBASE_*` variables are set correctly
- Verify project ID matches your Firebase project
- Check Firebase Console → Authentication → Settings → Authorized domains

### OpenAI not working?
- Verify `OPENAI_API_KEY` is set (without `NEXT_PUBLIC_` prefix)
- Check you have credits in your OpenAI account
- Ensure the key starts with `sk-`

### Environment variables not loading?
- Restart your development server after changing `.env.local`
- Check for typos in variable names (case-sensitive)
- Ensure `.env.local` is in the root directory

## Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] Never commit API keys to Git
- [ ] Use `NEXT_PUBLIC_` only for non-sensitive data
- [ ] Keep `OPENAI_API_KEY` server-side (no `NEXT_PUBLIC_` prefix)
- [ ] Rotate keys regularly
- [ ] Use different keys for development and production
- [ ] Monitor API usage in Firebase and OpenAI dashboards

## Need Help?

- Check `VERCEL_DEPLOYMENT.md` for deployment instructions
- Review `env.template` for the complete list of required variables
- See Firebase docs: https://firebase.google.com/docs
- See OpenAI docs: https://platform.openai.com/docs
