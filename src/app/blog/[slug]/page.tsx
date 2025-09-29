'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getPostBySlug, getPosts } from '@/lib/firestore'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  tags: string[]
  category?: string
  author_id: string
  seo_title?: string
  seo_description?: string
  published_at?: Date
  created_at: Date
  updated_at: Date
}

interface Author {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
}

export default function BlogPostPage() {
  const params = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [author, setAuthor] = useState<Author | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.slug) {
      fetchPost(params.slug as string)
    }
  }, [params.slug])

  const fetchPost = async (slug: string) => {
    try {
      const postData = await getPostBySlug(slug)

      if (!postData || postData.status !== 'published') {
        setError('Post not found')
        return
      }

      setPost(postData)

      // For now, we'll create a mock author since we don't have user profiles set up
      setAuthor({
        id: postData.author_id,
        full_name: 'Author',
        email: 'author@example.com',
        avatar_url: null
      })

      // Fetch related posts
      const allPosts = await getPosts('published', 10)
      const relatedData = allPosts
        .filter(p => p.id !== postData.id && p.category === postData.category)
        .slice(0, 3)

      setRelatedPosts(relatedData)

    } catch (error) {
      console.error('Error fetching post:', error)
      setError('Failed to load post')
    } finally {
      setLoading(false)
    }
  }

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

  if (error || !post) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Post Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-4">
          <li>
            <Link href="/" className="text-gray-400 hover:text-gray-500">
              Home
            </Link>
          </li>
          <li>
            <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li>
            <Link href="/blog" className="text-gray-400 hover:text-gray-500">
              Blog
            </Link>
          </li>
          <li>
            <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li>
            <span className="text-gray-500 truncate">{post.title}</span>
          </li>
        </ol>
      </nav>

      <article className="prose prose-lg max-w-none">
        {/* Header */}
        <header className="mb-8">
          {post.category && (
            <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-4">
              {post.category}
            </span>
          )}
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-xl text-gray-600 mb-6">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-4">
              {author && (
                <>
                  <div className="flex-shrink-0">
                    {author.avatar_url ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={author.avatar_url}
                        alt={author.full_name || author.email}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {(author.full_name || author.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {author.full_name || 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {post.published_at ? formatDate(post.published_at) : 'Not published'}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-gray-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-500">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <div className="mb-8">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
        />

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <article key={relatedPost.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {relatedPost.featured_image && (
                  <img
                    src={relatedPost.featured_image}
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    <Link href={`/blog/${relatedPost.slug}`} className="hover:text-blue-600 transition-colors">
                      {relatedPost.title}
                    </Link>
                  </h4>
                  {relatedPost.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {relatedPost.excerpt}
                    </p>
                  )}
                  <time className="text-sm text-gray-500">
                    {relatedPost.published_at ? formatDate(relatedPost.published_at) : 'Not published'}
                  </time>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Enjoyed this post?
        </h3>
        <p className="text-gray-600 mb-6">
          Subscribe to get more AI-generated content and insights.
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
