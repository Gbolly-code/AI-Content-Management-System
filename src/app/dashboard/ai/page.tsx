'use client'

import { useState } from 'react'
import { AIContentService } from '@/lib/openai'

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<'generate' | 'optimize' | 'ideas'>('generate')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  // Content Generation State
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState<'professional' | 'casual' | 'friendly' | 'authoritative'>('professional')
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium')
  const [keywords, setKeywords] = useState('')

  // SEO Optimization State
  const [content, setContent] = useState('')
  const [targetKeywords, setTargetKeywords] = useState('')

  // Content Ideas State
  const [ideaTopic, setIdeaTopic] = useState('')
  const [ideaCount, setIdeaCount] = useState(5)

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k)
      const generatedContent = await AIContentService.generateContent({
        topic,
        tone,
        length,
        keywords: keywordsArray,
      })
      setResult(generatedContent)
    } catch (err) {
      setError('Failed to generate content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOptimizeSEO = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const keywordsArray = targetKeywords.split(',').map(k => k.trim()).filter(k => k)
      const optimizedContent = await AIContentService.optimizeSEO({
        content,
        targetKeywords: keywordsArray,
      })
      setResult(optimizedContent)
    } catch (err) {
      setError('Failed to optimize SEO. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateIdeas = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const ideas = await AIContentService.generateIdeas(ideaTopic, ideaCount)
      setResult({ ideas })
    } catch (err) {
      setError('Failed to generate ideas. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'generate', name: 'Generate Content', icon: '✍️' },
    { id: 'optimize', name: 'SEO Optimization', icon: '🔍' },
    { id: 'ideas', name: 'Content Ideas', icon: '💡' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
        <p className="mt-2 text-gray-600">
          Leverage AI to create, optimize, and improve your content.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {activeTab === 'generate' && 'Generate New Content'}
            {activeTab === 'optimize' && 'SEO Optimization'}
            {activeTab === 'ideas' && 'Generate Content Ideas'}
          </h2>

          {activeTab === 'generate' && (
            <form onSubmit={handleGenerateContent} className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                  Topic *
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., 'The Future of AI in Web Development'"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                    Tone
                  </label>
                  <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                    <option value="authoritative">Authoritative</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                    Length
                  </label>
                  <select
                    id="length"
                    value={length}
                    onChange={(e) => setLength(e.target.value as any)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="short">Short (300-500 words)</option>
                    <option value="medium">Medium (800-1200 words)</option>
                    <option value="long">Long (1500-2500 words)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., AI, web development, programming"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !topic}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Content'}
              </button>
            </form>
          )}

          {activeTab === 'optimize' && (
            <form onSubmit={handleOptimizeSEO} className="space-y-4">
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content to Optimize *
                </label>
                <textarea
                  id="content"
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Paste your content here..."
                  required
                />
              </div>

              <div>
                <label htmlFor="targetKeywords" className="block text-sm font-medium text-gray-700">
                  Target Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  id="targetKeywords"
                  value={targetKeywords}
                  onChange={(e) => setTargetKeywords(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., SEO, optimization, content marketing"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !content}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Optimizing...' : 'Optimize SEO'}
              </button>
            </form>
          )}

          {activeTab === 'ideas' && (
            <form onSubmit={handleGenerateIdeas} className="space-y-4">
              <div>
                <label htmlFor="ideaTopic" className="block text-sm font-medium text-gray-700">
                  Topic for Ideas *
                </label>
                <input
                  type="text"
                  id="ideaTopic"
                  value={ideaTopic}
                  onChange={(e) => setIdeaTopic(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., 'Digital Marketing Trends'"
                  required
                />
              </div>

              <div>
                <label htmlFor="ideaCount" className="block text-sm font-medium text-gray-700">
                  Number of Ideas
                </label>
                <select
                  id="ideaCount"
                  value={ideaCount}
                  onChange={(e) => setIdeaCount(Number(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value={3}>3 ideas</option>
                  <option value={5}>5 ideas</option>
                  <option value={10}>10 ideas</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading || !ideaTopic}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating Ideas...' : 'Generate Ideas'}
              </button>
            </form>
          )}
        </div>

        {/* Results */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Results</h2>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {activeTab === 'generate' && result.title && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Title</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{result.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">SEO Title</h3>
                    <p className="mt-1 text-sm text-gray-900">{result.seoTitle}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">SEO Description</h3>
                    <p className="mt-1 text-sm text-gray-900">{result.seoDescription}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Excerpt</h3>
                    <p className="mt-1 text-sm text-gray-900">{result.excerpt}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Content</h3>
                    <div className="mt-1 text-sm text-gray-900 whitespace-pre-wrap max-h-64 overflow-y-auto border border-gray-200 rounded p-3">
                      {result.content}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Tags</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {result.tags?.map((tag: string, index: number) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'optimize' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Optimized Title</h3>
                    <p className="mt-1 text-sm text-gray-900">{result.optimizedTitle}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Optimized Description</h3>
                    <p className="mt-1 text-sm text-gray-900">{result.optimizedDescription}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Suggestions</h3>
                    <ul className="mt-1 text-sm text-gray-900 list-disc list-inside">
                      {result.suggestions?.map((suggestion: string, index: number) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Keyword Density</h3>
                    <div className="mt-1 text-sm text-gray-900">
                      {Object.entries(result.keywordDensity || {}).map(([keyword, density]) => (
                        <div key={keyword} className="flex justify-between">
                          <span>{keyword}:</span>
                          <span>{((density as number) * 100).toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ideas' && result.ideas && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700">Content Ideas</h3>
                  <ul className="mt-1 text-sm text-gray-900 list-disc list-inside space-y-2">
                    {result.ideas.map((idea: string, index: number) => (
                      <li key={index}>{idea}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!result && !loading && !error && (
            <div className="text-center py-8 text-gray-500">
              <p>Submit a form to see AI-generated results here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
