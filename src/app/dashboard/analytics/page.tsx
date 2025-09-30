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
    return null
  }

  // Calculate analytics data
  const totalPosts = posts.length
  const publishedPosts = posts.filter(post => post.status === 'published').length
  const draftPosts = posts.filter(post => post.status === 'draft').length
  const archivedPosts = posts.filter(post => post.status === 'archived').length
  
  // Calculate posts by category
  const postsByCategory = posts.reduce((acc, post) => {
    const category = post.category || 'Uncategorized'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate posts by month (last 6 months)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    return date.toISOString().slice(0, 7) // YYYY-MM format
  }).reverse()

  const postsByMonth = last6Months.map(month => {
    const count = posts.filter(post => {
      if (!post.created_at) return false
      const postDate = new Date(post.created_at)
      return postDate.toISOString().slice(0, 7) === month
    }).length
    return { month, count }
  })

  // Calculate average words per post
  const totalWords = posts.reduce((acc, post) => {
    if (post.content) {
      return acc + post.content.split(' ').length
    }
    return acc
  }, 0)
  const averageWords = totalPosts > 0 ? Math.round(totalWords / totalPosts) : 0

  // Get most popular tags
  const allTags = posts.flatMap(post => 
    post.tags || []
  )
  const tagCounts = allTags.reduce((acc, tag) => {
    if (tag) {
      acc[tag] = (acc[tag] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)
  const topTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 5)

  return (
    <div>
      {/* Header */}
      <div className="mb-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
        <h1 className="text-3xl font-light text-white">Analytics Dashboard</h1>
        <p className="mt-2 text-white/80 font-light">
          Track your content performance and insights.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Total Posts</p>
              <p className="text-2xl font-bold text-white">{totalPosts}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Published</p>
              <p className="text-2xl font-bold text-white">{publishedPosts}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Drafts</p>
              <p className="text-2xl font-bold text-white">{draftPosts}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 8h6m-6 4h6m-6 4h4" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Archived</p>
              <p className="text-2xl font-bold text-white">{archivedPosts}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Posts by Category */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Posts by Category</h3>
          {Object.keys(postsByCategory).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(postsByCategory)
                .sort(([,a], [,b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-300">{category}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(count / totalPosts) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white font-medium w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-gray-400">No categories found</p>
          )}
        </div>

        {/* Posts by Month */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Posts by Month</h3>
          <div className="space-y-3">
            {postsByMonth.map(({ month, count }) => (
              <div key={month} className="flex items-center justify-between">
                <span className="text-gray-300">{new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${Math.max((count / Math.max(...postsByMonth.map(p => p.count), 1)) * 100, 5)}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tags */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Tags</h3>
          {topTags.length > 0 ? (
            <div className="space-y-3">
              {topTags.map(([tag, count]) => (
                <div key={tag} className="flex items-center justify-between">
                  <span className="text-gray-300">#{tag}</span>
                  <span className="text-white font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No tags found</p>
          )}
        </div>

        {/* Content Statistics */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Content Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Average Words per Post</span>
              <span className="text-white font-medium">{averageWords.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Words Written</span>
              <span className="text-white font-medium">{totalWords.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Publishing Rate</span>
              <span className="text-white font-medium">
                {totalPosts > 0 ? Math.round((publishedPosts / totalPosts) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Posts</h3>
        {posts.length > 0 ? (
          <div className="space-y-3">
            {posts
              .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
              .slice(0, 5)
              .map((post) => (
                <div key={post.id} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-b-0">
                  <div>
                    <h4 className="text-white font-medium">{post.title}</h4>
                    <p className="text-sm text-gray-400">
                      {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'No date'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    post.status === 'published' 
                      ? 'bg-green-500/20 text-green-400' 
                      : post.status === 'draft'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {post.status}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-400">No posts found</p>
        )}
      </div>
    </div>
  )
}
