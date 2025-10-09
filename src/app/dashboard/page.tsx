'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, useInView, Variants } from 'framer-motion'
import { FaFileLines, FaCircleCheck, FaFilePen } from 'react-icons/fa6'
import { getPosts, BlogPost } from '@/lib/firestore'

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
}

const sectionVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1
  }
}

const headerVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -30,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1
  }
}

const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1
  }
}

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)

  // Refs for scroll animations
  const headerRef = useRef(null)
  const statsRef = useRef(null)
  const quickActionsRef = useRef(null)
  
  // In view hooks - only after mounted
  const headerInView = useInView(headerRef, { once: true, margin: "-100px" })
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" })
  const quickActionsInView = useInView(quickActionsRef, { once: true, margin: "-100px" })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const userPosts = await getPosts()
        setPosts(userPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setPostsLoading(false)
      }
    }

    if (user) {
      fetchPosts()
    }
  }, [user])

  console.log('Dashboard render:', { loading, user: !!user, mounted })

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to login...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-2 text-gray-300">
            Welcome back, {user?.email}! Here's what's happening with your content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            href="/dashboard/posts"
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6 hover:bg-gray-800 hover:border-blue-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors duration-300">
                  <FaFileLines className="text-blue-400 text-lg group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300 group-hover:text-blue-400 transition-colors duration-300">Total Posts</p>
                <p className="text-2xl font-bold text-white">{postsLoading ? '-' : posts.length}</p>
              </div>
            </div>
          </Link>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6 hover:bg-gray-800 hover:border-green-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors duration-300">
                  <FaCircleCheck className="text-green-400 text-lg group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300 group-hover:text-green-400 transition-colors duration-300">Published</p>
                <p className="text-2xl font-bold text-white">{postsLoading ? '-' : posts.filter(p => p.status === 'published').length}</p>
              </div>
            </div>
          </div>

          <Link 
            href="/dashboard/posts"
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6 hover:bg-gray-800 hover:border-yellow-500/50 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors duration-300">
                  <FaFilePen className="text-yellow-400 text-lg group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-300 group-hover:text-yellow-400 transition-colors duration-300">Drafts</p>
                <p className="text-2xl font-bold text-white">{postsLoading ? '-' : posts.filter(p => p.status === 'draft').length}</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a 
              href="/dashboard/posts/create" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-center block"
            >
              Create New Post
            </a>
            <a 
              href="/dashboard/posts" 
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-center block"
            >
              Manage Posts
            </a>
            <a 
              href="/dashboard/analytics" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-center block"
            >
              View Analytics
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}