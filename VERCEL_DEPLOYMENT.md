# Vercel Deployment Guide

## Pre-Deployment Checklist

### ✅ Security Check
- [x] `.gitignore` includes `.env*` files
- [x] API keys use environment variables
- [x] Firebase config uses `NEXT_PUBLIC_` prefix for client-side
- [x] OpenAI API key is server-side only (no `NEXT_PUBLIC_` prefix)

## Step 1: Prepare Your Repository

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Ensure `.env.local` is NOT committed** (it should be in `.gitignore`)

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Configure your project:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** .next
   - **Install Command:** `npm install`

### Option B: Deploy via Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

## Step 3: Configure Environment Variables in Vercel

Go to your project settings in Vercel Dashboard → Environment Variables

Add the following variables:

### Firebase Configuration (Client-side - safe to expose)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_actual_app_id
```

### OpenAI Configuration (Server-side - KEEP SECRET)
```
OPENAI_API_KEY=sk-your_actual_openai_api_key
```

### App Configuration
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Important:** 
- Set environment variables for **Production**, **Preview**, and **Development** environments
- Never commit `.env.local` or `.env` files to Git
- OpenAI API key should NOT have `NEXT_PUBLIC_` prefix (keeps it server-side only)

## Step 4: Redeploy

After adding environment variables:
1. Go to Deployments tab
2. Click "Redeploy" on the latest deployment
3. Or push a new commit to trigger automatic deployment

## Step 5: Verify Deployment

1. **Check the deployment URL** provided by Vercel
2. **Test authentication** - Try logging in
3. **Test AI features** - Generate content to verify OpenAI integration
4. **Check console** for any errors

## Troubleshooting

### Build Errors

If you get TypeScript errors during build:
```bash
npm run type-check
```

Fix any type errors before deploying.

### Environment Variables Not Working

1. Make sure variables are added to the correct environment (Production/Preview/Development)
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

### Firebase Connection Issues

1. Verify all Firebase environment variables are correct
2. Check Firebase Console → Project Settings → General
3. Ensure your Vercel domain is added to Firebase authorized domains:
   - Firebase Console → Authentication → Settings → Authorized domains
   - Add: `your-app.vercel.app`

### OpenAI API Errors

1. Verify your OpenAI API key is valid
2. Check you have credits in your OpenAI account
3. Ensure the key has proper permissions

## Security Best Practices

✅ **DO:**
- Use environment variables for all sensitive data
- Keep `.env.local` in `.gitignore`
- Use `NEXT_PUBLIC_` only for client-side variables
- Regularly rotate API keys
- Monitor API usage

❌ **DON'T:**
- Commit API keys to Git
- Use `NEXT_PUBLIC_` for sensitive keys (like OpenAI)
- Share environment variables publicly
- Use the same keys for development and production

## Post-Deployment

1. **Update Firebase Authorized Domains:**
   - Add your Vercel domain to Firebase Console

2. **Set up Custom Domain** (optional):
   - Vercel Dashboard → Settings → Domains

3. **Monitor Performance:**
   - Vercel Analytics
   - Firebase Console

4. **Set up Continuous Deployment:**
   - Already configured if you imported from Git
   - Every push to main branch will trigger a new deployment

## Environment Variables Reference

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client | Yes | Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Client | Yes | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Client | Yes | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Client | Yes | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Client | Yes | Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Client | Yes | Firebase App ID |
| `OPENAI_API_KEY` | Server | Yes | OpenAI API Key (Server-side only) |
| `NEXT_PUBLIC_APP_URL` | Client | Yes | Your app's URL |

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Setup](https://firebase.google.com/docs)
