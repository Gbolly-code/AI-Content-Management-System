'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPublishedPosts } from '@/lib/firestore'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  featured_image?: string
  tags: string[]
  category?: string
  author_id: string
  published_at?: Date
  created_at: Date
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const data = await getPublishedPosts(50)
      setPosts(data || [])
      // Extract unique categories
      const uniqueCategories = [...new Set(data?.map((post: BlogPost) => post.category).filter(Boolean))]
      setCategories(uniqueCategories as string[])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date)
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI-Powered Content Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover insights, tutorials, and stories created with the power of artificial intelligence. 
          Quality content, optimized for both humans and search engines.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                !selectedCategory
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No posts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedCategory 
              ? 'Try adjusting your search or filter criteria.'
              : 'No posts have been published yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {post.featured_image && (
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                {post.category && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-3">
                    {post.category}
                  </span>
                )}
                <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        #{tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                  <time className="text-sm text-gray-500">
                    {post.published_at ? formatDate(post.published_at) : 'Not published'}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Stay Updated
        </h3>
        <p className="text-gray-600 mb-6">
          Get the latest AI-generated content and insights delivered to your inbox.
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  )
}
