# AI Content Management System - Firebase Firestore Setup

This application uses Firebase Firestore as its database. The collections will be automatically created when you first use the application.

## Required Firestore Collections

### 1. `posts` Collection
This collection stores all blog posts and content. Documents will have the following structure:

```json
{
  "title": "string",
  "slug": "string",
  "content": "string",
  "excerpt": "string",
  "featured_image": "string",
  "status": "draft" | "published" | "archived",
  "author_id": "string",
  "seo_title": "string",
  "seo_description": "string",
  "tags": ["string"],
  "category": "string",
  "published_at": "timestamp",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 2. `profiles` Collection
This collection stores user profiles. Documents will have the following structure:

```json
{
  "id": "string",
  "email": "string",
  "full_name": "string",
  "avatar_url": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## Firebase Security Rules

Add these security rules to your Firestore database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts collection rules
    match /posts/{postId} {
      // Anyone can read published posts
      allow read: if resource.data.status == 'published';
      // Users can read, write, update, and delete their own posts
      allow read, write, update, delete: if request.auth != null && request.auth.uid == resource.data.author_id;
      // Users can create new posts
      allow create: if request.auth != null && request.auth.uid == request.resource.data.author_id;
    }
    
    // Profiles collection rules
    match /profiles/{profileId} {
      // Anyone can read profiles
      allow read: if true;
      // Users can update their own profile
      allow update: if request.auth != null && request.auth.uid == profileId;
      // Users can create their own profile
      allow create: if request.auth != null && request.auth.uid == profileId;
    }
  }
}
```

## Firebase Authentication Setup

1. Enable Email/Password authentication in Firebase Console
2. Configure authorized domains for your application
3. Set up user registration and login flows

## Environment Variables

Make sure to set up the following environment variables in your `.env.local` file:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Sample Data

The application will automatically create sample data when you first create posts through the dashboard. No manual data insertion is required.
