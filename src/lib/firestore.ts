import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from './firebase'

// Types
export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  status: 'draft' | 'published' | 'archived'
  author_id: string
  seo_title?: string
  seo_description?: string
  tags: string[]
  category?: string
  published_at?: Date
  created_at: Date
  updated_at: Date
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: Date
  updated_at: Date
}

// Blog Posts Collection
const POSTS_COLLECTION = 'posts'
const PROFILES_COLLECTION = 'profiles'

// Blog Posts CRUD
export const createPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
  const docRef = await addDoc(collection(db, POSTS_COLLECTION), {
    ...postData,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })
  return docRef.id
}

export const updatePost = async (postId: string, postData: Partial<BlogPost>) => {
  const postRef = doc(db, POSTS_COLLECTION, postId)
  await updateDoc(postRef, {
    ...postData,
    updated_at: serverTimestamp(),
  })
}

export const deletePost = async (postId: string) => {
  const postRef = doc(db, POSTS_COLLECTION, postId)
  await deleteDoc(postRef)
}

export const getPost = async (postId: string): Promise<BlogPost | null> => {
  const postRef = doc(db, POSTS_COLLECTION, postId)
  const postSnap = await getDoc(postRef)
  
  if (postSnap.exists()) {
    const data = postSnap.data()
    return { 
      id: postSnap.id, 
      ...data,
      created_at: data.created_at?.toDate() || new Date(),
      updated_at: data.updated_at?.toDate() || new Date(),
      published_at: data.published_at?.toDate()
    } as BlogPost
  }
  return null
}

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const q = query(collection(db, POSTS_COLLECTION), where('slug', '==', slug))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      const data = doc.data()
      return { 
        id: doc.id, 
        ...data,
        created_at: data.created_at?.toDate() || new Date(),
        updated_at: data.updated_at?.toDate() || new Date(),
        published_at: data.published_at?.toDate()
      } as BlogPost
    }
    return null
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }
}

export const getPosts = async (status?: string, limitCount?: number): Promise<BlogPost[]> => {
  try {
    let q = query(collection(db, POSTS_COLLECTION))
    
    if (status) {
      q = query(q, where('status', '==', status))
    }
    
    q = query(q, orderBy('updated_at', 'desc'))
    
    if (limitCount) {
      q = query(q, limit(limitCount))
    }
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        created_at: data.created_at?.toDate() || new Date(),
        updated_at: data.updated_at?.toDate() || new Date(),
        published_at: data.published_at?.toDate()
      }
    }) as BlogPost[]
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export const getPublishedPosts = async (limitCount?: number): Promise<BlogPost[]> => {
  return getPosts('published', limitCount)
}

export const getUserPosts = async (userId: string): Promise<BlogPost[]> => {
  const q = query(
    collection(db, POSTS_COLLECTION), 
    where('author_id', '==', userId),
    orderBy('updated_at', 'desc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      created_at: data.created_at?.toDate() || new Date(),
      updated_at: data.updated_at?.toDate() || new Date(),
      published_at: data.published_at?.toDate()
    }
  }) as BlogPost[]
}

// User Profiles
export const createUserProfile = async (profileData: Omit<UserProfile, 'created_at' | 'updated_at'>) => {
  const docRef = await addDoc(collection(db, PROFILES_COLLECTION), {
    ...profileData,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  })
  return docRef.id
}

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const q = query(collection(db, PROFILES_COLLECTION), where('id', '==', userId))
  const querySnapshot = await getDocs(q)
  
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0]
    return { id: doc.id, ...doc.data() } as UserProfile
  }
  return null
}

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  const q = query(collection(db, PROFILES_COLLECTION), where('id', '==', userId))
  const querySnapshot = await getDocs(q)
  
  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref
    await updateDoc(docRef, {
      ...profileData,
      updated_at: serverTimestamp(),
    })
  }
}
