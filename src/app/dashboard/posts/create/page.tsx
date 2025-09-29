'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { createPost } from '@/lib/firestore'

export default function CreatePostPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-white mb-4">Authentication Required</h1>
          <p className="text-white/80 mb-6">Please log in to create a new post.</p>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category: '',
    tags: '',
    seo_title: '',
    seo_description: '',
    status: 'draft' as 'draft' | 'published' | 'archived'
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-generate slug from title
    if (name === 'title' && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value)
      }))
    }
  }

  const handleAIGenerate = async () => {
    if (!formData.title.trim()) {
      setError('Please enter a topic/title first')
      return
    }

    setAiLoading(true)
    setError('')

    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t)
      
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: formData.title,
          tone: 'professional',
          length: 'medium',
          keywords: tags
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate content')
      }

      const generatedContent = await response.json()

      setFormData(prev => ({
        ...prev,
        content: generatedContent.content,
        excerpt: generatedContent.excerpt,
        seo_title: generatedContent.seoTitle,
        seo_description: generatedContent.seoDescription,
        tags: generatedContent.tags.join(', ')
      }))
    } catch (err) {
      console.error('AI Generation Error:', err)
      if (err instanceof Error) {
        if (err.message.includes('API key')) {
          setError('AI features are not available. Please set up your OpenAI API key in the environment variables.')
        } else if (err.message.includes('Invalid JSON')) {
          setError('AI returned invalid response. Please try again.')
        } else if (err.message.includes('Failed to generate content')) {
          setError(`AI generation failed: ${err.message}`)
        } else {
          setError(`AI generation error: ${err.message}`)
        }
      } else {
        setError('Failed to generate content with AI. Please try again.')
      }
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t)
      const slug = formData.slug || generateSlug(formData.title)

      const postData: any = {
        title: formData.title,
        slug,
        content: formData.content,
        tags,
        status: formData.status,
        author_id: user?.uid || '',
        created_at: new Date(),
        updated_at: new Date()
      }

      // Only add optional fields if they have values
      if (formData.excerpt) postData.excerpt = formData.excerpt
      if (formData.featured_image) postData.featured_image = formData.featured_image
      if (formData.category) postData.category = formData.category
      if (formData.seo_title) postData.seo_title = formData.seo_title
      if (formData.seo_description) postData.seo_description = formData.seo_description
      if (formData.status === 'published') postData.published_at = new Date()

      const postId = await createPost(postData)

      router.push('/dashboard/posts')
    } catch (err: any) {
      setError(err.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
        <h1 className="text-3xl font-light text-white">Create New Post</h1>
        <p className="mt-2 text-white/80 font-light">
          Create a new blog post with AI assistance.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-md bg-red-500/20 border border-red-500/30 p-4">
            <div className="text-sm text-red-400">{error}</div>
          </div>
        )}

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Title Field */}
              <div className="relative">
                <label 
                  htmlFor="title" 
                  className="block text-sm font-light text-white/90 mb-2"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your post title"
                  required
                />
              </div>

              {/* Slug Field */}
              <div className="relative">
                <label 
                  htmlFor="slug" 
                  className="block text-sm font-light text-white/90 mb-2"
                >
                  Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="url-friendly-slug"
                  required
                />
              </div>

              {/* Category Field */}
              <div className="relative">
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Technology, Business, Lifestyle"
                />
                <label 
                  htmlFor="category" 
                  className="block text-sm font-light text-white/90 mb-2"
                >
                  Category
                </label>
              </div>

              {/* Tags Field */}
              <div className="relative">
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="tag1, tag2, tag3"
                />
                <label 
                  htmlFor="tags" 
                  className="block text-sm font-light text-white/90 mb-2"
                >
                  Tags (comma-separated)
                </label>
              </div>

              {/* Featured Image Field */}
              <div className="relative">
                <label 
                  htmlFor="featured_image" 
                  className="block text-sm font-light text-white/90 mb-2"
                >
                  Featured Image URL
                </label>
                <input
                  type="url"
                  id="featured_image"
                  name="featured_image"
                  value={formData.featured_image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Status Field */}
              <div className="relative">
                <label 
                  htmlFor="status" 
                  className="block text-sm font-light text-white/90 mb-2"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="draft" className="bg-gray-800 text-white">Draft</option>
                  <option value="published" className="bg-gray-800 text-white">Published</option>
                  <option value="archived" className="bg-gray-800 text-white">Archived</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {/* Excerpt Field */}
              <div className="relative">
                <label 
                  htmlFor="excerpt" 
                  className="block text-sm font-light text-white/90 mb-2"
                >
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows={4}
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Brief summary of your post"
                />
              </div>

              {/* SEO Title Field */}
              <div className="relative">
                <label 
                  htmlFor="seo_title" 
                  className="block text-sm font-light text-white/90 mb-2"
                >
                  SEO Title
                </label>
                <input
                  type="text"
                  id="seo_title"
                  name="seo_title"
                  value={formData.seo_title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="SEO optimized title (50-60 characters)"
                  maxLength={60}
                />
                <p className="mt-1 text-sm text-white/60">
                  {formData.seo_title.length}/60 characters
                </p>
              </div>

              {/* SEO Description Field */}
              <div className="relative">
                <label 
                  htmlFor="seo_description" 
                  className="block text-sm font-light text-white/90 mb-2"
                >
                  SEO Description
                </label>
                <textarea
                  id="seo_description"
                  name="seo_description"
                  rows={3}
                  value={formData.seo_description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="SEO meta description (150-160 characters)"
                  maxLength={160}
                />
                <p className="mt-1 text-sm text-white/60">
                  {formData.seo_description.length}/160 characters
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <label htmlFor="content" className="block text-sm font-light text-white/90">
              Content *
            </label>
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={aiLoading || !formData.title}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-light rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {aiLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Generate with AI
                </>
              )}
            </button>
          </div>
          <div className="relative mb-6">
            <textarea
              id="content"
              name="content"
              rows={20}
              value={formData.content}
              onChange={handleInputChange}
              className="w-full px-3 py-3 border border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Write your post content here... or use AI to generate it!"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard/posts')}
              className="px-6 py-3 border border-gray-600 rounded-lg shadow-sm text-sm font-light text-white bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-light text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Post'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
