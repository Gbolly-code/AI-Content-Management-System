'use client'

import { useAuth } from '@/components/AuthProvider'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPosts, BlogPost } from '@/lib/firestore'

export default function Dashboard() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  })

  useEffect(() => {
    if (user) {
      fetchPosts()
    }
  }, [user])

  const fetchPosts = async () => {
    try {
      const data = await getPosts(undefined, 10)
      setPosts(data)
      
      // Calculate stats
      const totalPosts = data?.length || 0
      const publishedPosts = data?.filter(post => post.status === 'published').length || 0
      const draftPosts = data?.filter(post => post.status === 'draft').length || 0
      
      setStats({
        totalPosts,
        publishedPosts,
        draftPosts,
      })
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-400 border border-green-500/30'
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
      case 'archived':
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
    }
  }

  return (
    <div className="bg-gray-900/50 rounded-xl p-6">
      <div className="mb-8 bg-gray-800/70 rounded-lg p-6">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-gray-300">
          Welcome back, {user?.email}! Here's what's happening with your content.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
                <span className="text-blue-400 font-bold text-lg">📝</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-300 truncate">
                  Total Posts
                </dt>
                <dd className="text-xl font-bold text-white">
                  {stats.totalPosts}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-500/30 rounded-xl flex items-center justify-center">
                <span className="text-green-400 font-bold text-lg">✅</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-300 truncate">
                  Published
                </dt>
                <dd className="text-xl font-bold text-white">
                  {stats.publishedPosts}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/70 backdrop-blur-sm overflow-hidden shadow-xl rounded-xl p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-500/30 rounded-xl flex items-center justify-center">
                <span className="text-yellow-400 font-bold text-lg">📋</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-300 truncate">
                  Drafts
                </dt>
                <dd className="text-xl font-bold text-white">
                  {stats.draftPosts}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900/50 backdrop-blur-sm shadow-xl rounded-xl mb-8 p-6">
        <h3 className="text-lg leading-6 font-medium text-white mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/dashboard/posts/create"
              className="relative group bg-gray-800/70 backdrop-blur-sm p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-xl hover:bg-gray-800/90 hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-gray-400 active:border-2 active:border-gray-300 transition-all duration-150 ease-out"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-500/20 text-blue-400 ring-4 ring-gray-800/50">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium text-white">
                  Create New Post
                </h3>
                <p className="mt-2 text-sm text-gray-300">
                  Start writing a new blog post with AI assistance.
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/ai"
              className="relative group bg-gray-800/70 backdrop-blur-sm p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-500 rounded-xl hover:bg-gray-800/90 hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-gray-400 active:border-2 active:border-gray-300 transition-all duration-200"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-500/20 text-purple-400 ring-4 ring-gray-800/50">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium text-white">
                  AI Assistant
                </h3>
                <p className="mt-2 text-sm text-gray-300">
                  Get content ideas, SEO optimization, and writing help.
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard/posts"
              className="relative group bg-gray-800/70 backdrop-blur-sm p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-500 rounded-xl hover:bg-gray-800/90 hover:scale-105 hover:shadow-2xl hover:border-2 hover:border-gray-400 active:border-2 active:border-gray-300 transition-all duration-200"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-500/20 text-green-400 ring-4 ring-gray-800/50">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium text-white">
                  Manage Posts
                </h3>
                <p className="mt-2 text-sm text-gray-300">
                  View, edit, and organize all your content.
                </p>
              </div>
            </Link>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-gray-800/70 backdrop-blur-sm shadow-xl rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg leading-6 font-medium text-white">
            Recent Posts
          </h3>
          <Link
            href="/dashboard/posts"
            className="text-sm text-blue-400 hover:text-blue-300"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-white">No posts</h3>
              <p className="mt-1 text-sm text-gray-400">Get started by creating a new post.</p>
              <div className="mt-6">
                <Link
                  href="/dashboard/posts/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create your first post
                </Link>
              </div>
            </div>
          ) : (
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-600">
                {posts.map((post) => (
                  <li key={post.id} className="py-5">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {post.title}
                        </p>
                        <p className="text-sm text-gray-400">
                          Updated {new Date(post.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
                          {post.status}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  )
}
