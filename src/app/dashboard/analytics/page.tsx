'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { getPosts } from '@/lib/firestore'
import { BlogPost } from '@/lib/firestore'

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

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
        setAnalyticsLoading(false)
      }
    }

    if (user) {
      fetchPosts()
    }
  }, [user])

  if (loading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
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

  // Calculate analytics data
  const totalPosts = posts.length
  const publishedPosts = posts.filter(post => post.status === 'published').length
  const draftPosts = posts.filter(post => post.status === 'draft').length
  const archivedPosts = posts.filter(post => post.status === 'archived').length

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Overview</h1>
          <p className="text-gray-400">
            Track your content performance and insights at a glance.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {/* Total Posts */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 shadow-xl rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-white mb-1">{totalPosts}</p>
                <div className="flex items-center justify-end text-xs text-blue-400">
                  <span>Total Posts</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">All content pieces</p>
          </div>

          {/* Published Posts */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 shadow-xl rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-white mb-1">{publishedPosts}</p>
                <div className="flex items-center justify-end text-xs text-green-400">
                  <span>Published</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">Live on your site</p>
          </div>

          {/* Draft Posts */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30 shadow-xl rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-white mb-1">{draftPosts}</p>
                <div className="flex items-center justify-end text-xs text-yellow-400">
                  <span>Drafts</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">Work in progress</p>
          </div>

          {/* Archived Posts */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 shadow-xl rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-white mb-1">{archivedPosts}</p>
                <div className="flex items-center justify-end text-xs text-purple-400">
                  <span>Archived</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">Stored content</p>
          </div>
        </div>

        {/* Content Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Status Distribution Chart */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Content Status Distribution</h3>
            <div className="space-y-4">
              {/* Published Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Published</span>
                  <span className="text-sm font-semibold text-green-400">{publishedPosts} ({totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${totalPosts > 0 ? (publishedPosts / totalPosts) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Draft Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Drafts</span>
                  <span className="text-sm font-semibold text-yellow-400">{draftPosts} ({totalPosts > 0 ? Math.round((draftPosts / totalPosts) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${totalPosts > 0 ? (draftPosts / totalPosts) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Archived Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Archived</span>
                  <span className="text-sm font-semibold text-purple-400">{archivedPosts} ({totalPosts > 0 ? Math.round((archivedPosts / totalPosts) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${totalPosts > 0 ? (archivedPosts / totalPosts) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Quick Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <span className="text-sm text-gray-300">Publication Rate</span>
                <span className="text-lg font-bold text-blue-400">{totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <span className="text-sm text-gray-300">Drafts Pending</span>
                <span className="text-lg font-bold text-yellow-400">{draftPosts}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <span className="text-sm text-gray-300">Content Library</span>
                <span className="text-lg font-bold text-purple-400">{totalPosts} {totalPosts === 1 ? 'post' : 'posts'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Posts */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          {posts.length > 0 ? (
            <div className="space-y-3">
              {posts
                .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
                .slice(0, 5)
                .map((post) => (
                  <div key={post.id} className="flex items-center justify-between py-3 px-4 bg-gray-900/50 border border-gray-700/50 rounded-lg hover:border-gray-600 transition-colors duration-200">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{post.title}</h4>
                      <p className="text-sm text-gray-400">
                        {post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                      </p>
                    </div>
                    <span className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      post.status === 'published' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : post.status === 'draft'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="mt-4 text-gray-400">No posts yet. Create your first post to see analytics!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}