'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { FaPen, FaMagnifyingGlass, FaLightbulb, FaBookmark, FaFloppyDisk, FaXmark, FaTrash } from 'react-icons/fa6'

export default function AIPage() {
  const { user } = useAuth()
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

  // Saved Items State
  const [savedItems, setSavedItems] = useState<any[]>([])
  const [showSavedItems, setShowSavedItems] = useState(false)
  const [selectedSavedItem, setSelectedSavedItem] = useState<any>(null)
  const [isLoadingSavedItems, setIsLoadingSavedItems] = useState(true)

  // Load saved items from Firestore on component mount
  useEffect(() => {
    const loadSavedItems = async () => {
      if (!user || !db) {
        setIsLoadingSavedItems(false)
        return
      }

      try {
        const savedItemsRef = collection(db, 'ai-saved-items')
        const q = query(
          savedItemsRef,
          where('userId', '==', user.uid)
        )
        const querySnapshot = await getDocs(q)
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any[]
        
        // Sort by createdAt in JavaScript instead of Firestore
        items.sort((a: any, b: any) => {
          const aTime = a.createdAt?.toDate?.() || new Date(a.timestamp || 0)
          const bTime = b.createdAt?.toDate?.() || new Date(b.timestamp || 0)
          return bTime.getTime() - aTime.getTime() // Descending order (newest first)
        })
        
        setSavedItems(items)
      } catch (error) {
        console.error('Error loading saved items from Firestore:', error)
        setSavedItems([])
      } finally {
        setIsLoadingSavedItems(false)
      }
    }

    loadSavedItems()
  }, [user])

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k)
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          tone,
          length,
          keywords: keywordsArray,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate content')
      }

      const generatedContent = await response.json()
      setResult(generatedContent)
    } catch (err) {
      console.error('Error generating content:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate content. Please try again.')
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
      const response = await fetch('/api/ai/optimize-seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          targetKeywords: keywordsArray,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to optimize SEO')
      }

      const optimizedContent = await response.json()
      setResult(optimizedContent)
    } catch (err) {
      console.error('Error optimizing SEO:', err)
      setError(err instanceof Error ? err.message : 'Failed to optimize SEO. Please try again.')
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
      console.log('Generating ideas for topic:', ideaTopic, 'count:', ideaCount)
      const response = await fetch('/api/ai/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: ideaTopic,
          count: ideaCount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate ideas')
      }

      const data = await response.json()
      console.log('Generated ideas:', data.ideas)
      setResult({ ideas: data.ideas })
    } catch (err) {
      console.error('Error in handleGenerateIdeas:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate ideas. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveResult = async () => {
    if (!result || !user || !db) return

    try {
      const savedItem = {
        userId: user.uid,
        type: activeTab,
        title: result.title || result.optimizedTitle || `${ideaTopic} Ideas`,
        content: result,
        topic: topic || ideaTopic || content.substring(0, 50) + '...',
        createdAt: new Date()
      }

      const docRef = await addDoc(collection(db, 'ai-saved-items'), savedItem)
      
      // Add the new item to local state with the Firestore ID
      const newItem = {
        id: docRef.id,
        ...savedItem,
        timestamp: savedItem.createdAt.toISOString()
      }
      
      setSavedItems(prev => [newItem, ...prev])
      setShowSavedItems(true)
      
      // Clear results screen for ideas after saving
      if (activeTab === 'ideas') {
        setResult(null)
        setIdeaTopic('')
      }
    } catch (error) {
      console.error('Error saving item to Firestore:', error)
      setError('Failed to save item. Please try again.')
    }
  }

  const handleDeleteSavedItem = async (id: string) => {
    if (!db) return

    try {
      await deleteDoc(doc(db, 'ai-saved-items', id))
      setSavedItems(prev => prev.filter(item => item.id !== id))
      if (selectedSavedItem && selectedSavedItem.id === id) {
        setSelectedSavedItem(null)
      }
    } catch (error) {
      console.error('Error deleting item from Firestore:', error)
      setError('Failed to delete item. Please try again.')
    }
  }

  const handleViewSavedItem = (item: any) => {
    setSelectedSavedItem(item)
  }

  const handleCloseSavedItem = () => {
    setSelectedSavedItem(null)
  }

  const handleClearAllSavedItems = async () => {
    if (!user || !db) return
    
    if (window.confirm('Are you sure you want to delete all saved items? This action cannot be undone.')) {
      try {
        // Get all user's saved items
        const savedItemsRef = collection(db, 'ai-saved-items')
        const q = query(savedItemsRef, where('userId', '==', user.uid))
        const querySnapshot = await getDocs(q)
        
        // Delete each item
        const deletePromises = querySnapshot.docs.map(docSnapshot => 
          deleteDoc(doc(savedItemsRef, docSnapshot.id))
        )
        
        await Promise.all(deletePromises)
        setSavedItems([])
        setSelectedSavedItem(null)
      } catch (error) {
        console.error('Error clearing all saved items:', error)
        setError('Failed to clear all items. Please try again.')
      }
    }
  }

  const tabs = [
    { id: 'generate', name: 'Generate Content', icon: FaPen },
    { id: 'optimize', name: 'SEO Optimization', icon: FaMagnifyingGlass },
    { id: 'ideas', name: 'Content Ideas', icon: FaLightbulb },
  ]

  return (
    <div className="min-h-screen bg-black">
      <style jsx>{`
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.75rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
        
        input:focus, textarea:focus, select:focus {
          outline: none !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5) !important;
        }
        
        input, textarea, select {
          transition: all 0.2s ease-in-out;
        }
        
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">AI Assistant</h1>
          <p className="mt-2 text-white/80 font-light">
            Leverage AI to create, optimize, and improve your content.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <div className="flex justify-between items-center">
            <nav className="-mb-px flex space-x-6 sm:space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600 hover:bg-gray-700/30'
                  }`}
                >
                  <tab.icon className="inline mr-1.5 sm:mr-2 text-sm sm:text-base" />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden text-xs">{tab.name.split(' ')[0]}</span>
                </button>
              ))}
            </nav>
            <button
              onClick={() => setShowSavedItems(!showSavedItems)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                showSavedItems 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
              }`}
            >
              <FaBookmark className="text-xs" />
              <span className="hidden sm:inline">Saved Items</span>
              <span className="sm:hidden">Saved</span>
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                showSavedItems ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
              }`}>
                {isLoadingSavedItems ? '...' : savedItems.length}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">
              {activeTab === 'generate' && 'Generate New Content'}
              {activeTab === 'optimize' && 'SEO Optimization'}
              {activeTab === 'ideas' && 'Generate Content Ideas'}
            </h2>

          {activeTab === 'generate' && (
            <form onSubmit={handleGenerateContent} className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-300">
                  Topic *
                </label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-lg shadow-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 sm:text-sm placeholder:text-sm placeholder:text-gray-400"
                  placeholder="e.g., 'The Future of AI in Web Development'"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tone" className="block text-sm font-medium text-gray-300">
                    Tone
                  </label>
                  <select
                    id="tone"
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                    className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-lg shadow-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 sm:text-sm appearance-none cursor-pointer"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                    <option value="authoritative">Authoritative</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="length" className="block text-sm font-medium text-gray-300">
                    Length
                  </label>
                  <select
                    id="length"
                    value={length}
                    onChange={(e) => setLength(e.target.value as any)}
                    className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-lg shadow-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 sm:text-sm appearance-none cursor-pointer"
                  >
                    <option value="short">Short (300-500 words)</option>
                    <option value="medium">Medium (800-1200 words)</option>
                    <option value="long">Long (1500-2500 words)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="keywords" className="block text-sm font-medium text-gray-300">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-lg shadow-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 sm:text-sm placeholder:text-sm placeholder:text-gray-400"
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
                <label htmlFor="content" className="block text-sm font-medium text-gray-300">
                  Content to Optimize *
                </label>
                <textarea
                  id="content"
                  rows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-lg shadow-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 sm:text-sm placeholder:text-sm placeholder:text-gray-400 resize-none"
                  placeholder="Paste your content here..."
                  required
                />
              </div>

              <div>
                <label htmlFor="targetKeywords" className="block text-sm font-medium text-gray-300">
                  Target Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  id="targetKeywords"
                  value={targetKeywords}
                  onChange={(e) => setTargetKeywords(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-lg shadow-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 sm:text-sm placeholder:text-sm placeholder:text-gray-400"
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
                <label htmlFor="ideaTopic" className="block text-sm font-medium text-gray-300">
                  Topic for Ideas *
                </label>
                <input
                  type="text"
                  id="ideaTopic"
                  value={ideaTopic}
                  onChange={(e) => setIdeaTopic(e.target.value)}
                  className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-lg shadow-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 sm:text-sm placeholder:text-sm placeholder:text-gray-400"
                  placeholder="e.g., 'Digital Marketing Trends'"
                  required
                />
              </div>

              <div>
                <label htmlFor="ideaCount" className="block text-sm font-medium text-gray-300">
                  Number of Ideas
                </label>
                <select
                  id="ideaCount"
                  value={ideaCount}
                  onChange={(e) => setIdeaCount(Number(e.target.value))}
                  className="mt-1 block w-full bg-gray-700 border-gray-600 text-white rounded-lg shadow-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 focus:ring-2 sm:text-sm appearance-none cursor-pointer"
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
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">Results</h2>
              {result && !loading && (
                <button
                  onClick={handleSaveResult}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <FaFloppyDisk />
                  Save Result
                </button>
              )}
            </div>

          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

            {error && (
              <div className="rounded-md bg-red-900/20 border border-red-500/30 p-4">
                <div className="text-sm text-red-300">{error}</div>
              </div>
            )}

          {result && !loading && (
            <div className="space-y-4">
              {activeTab === 'generate' && result.title && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Title</h3>
                    <p className="mt-1 text-lg font-semibold text-white">{result.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">SEO Title</h3>
                    <p className="mt-1 text-sm text-gray-200">{result.seoTitle}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">SEO Description</h3>
                    <p className="mt-1 text-sm text-gray-200">{result.seoDescription}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Excerpt</h3>
                    <p className="mt-1 text-sm text-gray-200">{result.excerpt}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Content</h3>
                    <div className="mt-1 text-sm text-gray-200 whitespace-pre-wrap max-h-64 overflow-y-auto border border-gray-600 rounded p-3 bg-gray-700/50">
                      {result.content}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Tags</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {result.tags?.map((tag: string, index: number) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-600 text-blue-100">
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
                    <h3 className="text-sm font-medium text-gray-300">Optimized Title</h3>
                    <p className="mt-1 text-sm text-gray-200">{result.optimizedTitle}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Optimized Description</h3>
                    <p className="mt-1 text-sm text-gray-200">{result.optimizedDescription}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Suggestions</h3>
                    <ul className="mt-1 text-sm text-gray-200 list-disc list-inside">
                      {result.suggestions?.map((suggestion: string, index: number) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Keyword Density</h3>
                    <div className="mt-1 text-sm text-gray-200">
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
                  <h3 className="text-sm font-medium text-gray-300">Content Ideas</h3>
                  <ul className="mt-1 text-sm text-gray-200 list-disc list-inside space-y-2">
                    {result.ideas.map((idea: string, index: number) => (
                      <li key={index}>{idea}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

            {!result && !loading && !error && (
              <div className="text-center py-8 text-gray-400">
                <p>Submit a form to see AI-generated results here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Saved Items Section */}
        {showSavedItems && (
          <div className="mt-8">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Saved Items</h2>
                <div className="flex items-center gap-2">
                  {savedItems.length > 0 && (
                    <button
                      onClick={handleClearAllSavedItems}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200 text-sm font-medium"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setShowSavedItems(false)}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <FaXmark />
                  </button>
                </div>
              </div>
              
              {savedItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No saved items yet. Generate some content and save it!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 cursor-pointer hover:bg-gray-700/70 transition-colors duration-200"
                      onClick={() => handleViewSavedItem(item)}
                    >
                      <div className="mb-3">
                        <h3 className="text-white font-medium text-sm mb-1">{item.title}</h3>
                        <p className="text-gray-400 text-xs mb-2">{item.topic}</p>
                        <p className="text-gray-500 text-xs">
                          {new Date(item.timestamp).toLocaleDateString()} at{' '}
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      
                      <div className="text-xs text-gray-300">
                        {item.type === 'generate' && item.content.title && (
                          <div>
                            <p className="font-medium mb-1">Title:</p>
                            <p className="text-gray-400 mb-2">{item.content.title}</p>
                            <p className="font-medium mb-1">Excerpt:</p>
                            <p className="text-gray-400 text-xs line-clamp-2">{item.content.excerpt}</p>
                          </div>
                        )}
                        {item.type === 'optimize' && item.content.optimizedTitle && (
                          <div>
                            <p className="font-medium mb-1">Optimized Title:</p>
                            <p className="text-gray-400 text-xs line-clamp-2">{item.content.optimizedTitle}</p>
                          </div>
                        )}
                        {item.type === 'ideas' && item.content.ideas && (
                          <div>
                            <p className="font-medium mb-1">Ideas:</p>
                            <ul className="text-gray-400 text-xs space-y-1">
                              {item.content.ideas.slice(0, 2).map((idea: string, index: number) => (
                                <li key={index} className="line-clamp-1">• {idea}</li>
                              ))}
                              {item.content.ideas.length > 2 && (
                                <li className="text-gray-500">+{item.content.ideas.length - 2} more...</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Full Content Viewer Modal */}
        {selectedSavedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`bg-gray-800 border border-gray-700 rounded-lg w-full max-h-[90vh] overflow-hidden ${
              selectedSavedItem.type === 'ideas' ? 'max-w-2xl' : 'max-w-4xl'
            }`}>
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedSavedItem.title}</h2>
                  <p className="text-gray-400 text-sm mt-1">{selectedSavedItem.topic}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(selectedSavedItem.timestamp).toLocaleDateString()} at{' '}
                    {new Date(selectedSavedItem.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteSavedItem(selectedSavedItem.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                  >
                    <FaTrash />
                    Delete
                  </button>
                  <button
                    onClick={handleCloseSavedItem}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              <div className={`overflow-y-auto max-h-[calc(90vh-120px)] ${
                selectedSavedItem?.type === 'ideas' ? 'p-4' : 'p-6'
              }`}>
                {selectedSavedItem.type === 'generate' && selectedSavedItem.content.title && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Title</h3>
                      <p className="text-gray-200 text-lg">{selectedSavedItem.content.title}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">SEO Title</h3>
                      <p className="text-gray-200">{selectedSavedItem.content.seoTitle}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">SEO Description</h3>
                      <p className="text-gray-200">{selectedSavedItem.content.seoDescription}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Excerpt</h3>
                      <p className="text-gray-200">{selectedSavedItem.content.excerpt}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Content</h3>
                      <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                        <p className="text-gray-200 whitespace-pre-wrap">{selectedSavedItem.content.content}</p>
                      </div>
                    </div>
                    
                    {selectedSavedItem.content.tags && selectedSavedItem.content.tags.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedSavedItem.content.tags.map((tag: string, index: number) => (
                            <span key={index} className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-600 text-blue-100">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedSavedItem.type === 'optimize' && selectedSavedItem.content.optimizedTitle && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Optimized Title</h3>
                      <p className="text-gray-200 text-lg">{selectedSavedItem.content.optimizedTitle}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Optimized Description</h3>
                      <p className="text-gray-200">{selectedSavedItem.content.optimizedDescription}</p>
                    </div>
                    
                    {selectedSavedItem.content.suggestions && selectedSavedItem.content.suggestions.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Suggestions</h3>
                        <ul className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                          {selectedSavedItem.content.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="text-gray-200 mb-2 last:mb-0">• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedSavedItem.content.keywordDensity && Object.keys(selectedSavedItem.content.keywordDensity).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Keyword Density</h3>
                        <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                          {Object.entries(selectedSavedItem.content.keywordDensity).map(([keyword, density]) => (
                            <div key={keyword} className="flex justify-between text-gray-200 mb-1">
                              <span>{keyword}:</span>
                              <span>{((density as number) * 100).toFixed(2)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedSavedItem.type === 'ideas' && selectedSavedItem.content.ideas && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Content Ideas</h3>
                    <div className="space-y-2">
                      {selectedSavedItem.content.ideas.map((idea: string, index: number) => (
                        <div key={index} className="bg-gray-700/30 border border-gray-600 rounded-md p-3">
                          <div className="flex items-start gap-2">
                            <span className="text-blue-400 font-bold text-sm mt-0.5">{index + 1}.</span>
                            <p className="text-gray-200 text-sm leading-relaxed">{idea}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
