'use client'

import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface UserSettings {
  displayName: string
  email: string
  bio: string
  theme: 'dark' | 'light' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    aiUpdates: boolean
  }
  ai: {
    model: 'gpt-3.5-turbo' | 'gpt-4'
    temperature: number
    maxTokens: number
  }
  editor: {
    autoSave: boolean
    wordWrap: boolean
    fontSize: number
  }
}

export default function SettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [settings, setSettings] = useState<UserSettings>({
    displayName: '',
    email: '',
    bio: '',
    theme: 'dark',
    notifications: {
      email: true,
      push: true,
      aiUpdates: true
    },
    ai: {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      maxTokens: 1000
    },
    editor: {
      autoSave: true,
      wordWrap: true,
      fontSize: 14
    }
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
    if (user) {
      setSettings(prev => ({
        ...prev,
        displayName: user.displayName || '',
        email: user.email || ''
      }))
    }
  }, [user, loading, router])

  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === 'notifications' || section === 'ai' || section === 'editor') {
      setSettings(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof UserSettings],
          [field]: value
        }
      }))
    } else {
      setSettings(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you'd save to your backend here
      localStorage.setItem('userSettings', JSON.stringify(settings))
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSettings({
      displayName: user?.displayName || '',
      email: user?.email || '',
      bio: '',
      theme: 'dark',
      notifications: {
        email: true,
        push: true,
        aiUpdates: true
      },
      ai: {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        maxTokens: 1000
      },
      editor: {
        autoSave: true,
        wordWrap: true,
        fontSize: 14
      }
    })
    setMessage(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
          <h1 className="text-3xl font-light text-white">Settings</h1>
          <p className="mt-2 text-white/80 font-light">
            Manage your account preferences and application settings.
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
              : 'bg-red-500/20 border border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Settings */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Profile Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-light text-white/90 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={settings.displayName}
                  onChange={(e) => handleInputChange('', 'displayName', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your display name"
                />
              </div>

              <div>
                <label className="block text-sm font-light text-white/90 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  disabled
                  className="w-full px-3 py-3 border border-gray-600 bg-gray-700/50 backdrop-blur-sm text-gray-400 rounded-lg cursor-not-allowed"
                  placeholder="Email address"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-light text-white/90 mb-2">
                  Bio
                </label>
                <textarea
                  value={settings.bio}
                  onChange={(e) => handleInputChange('', 'bio', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-3 border border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
              </div>
              Appearance
            </h2>
            
            <div>
              <label className="block text-sm font-light text-white/90 mb-2">
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleInputChange('', 'theme', e.target.value)}
                className="w-full px-3 py-3 border border-gray-700 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              >
                <option value="dark" className="bg-gray-800/90 text-white">Dark</option>
                <option value="light" className="bg-gray-800/90 text-white">Light</option>
                <option value="auto" className="bg-gray-800/90 text-white">Auto (System)</option>
              </select>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12.828 7H4.828zM4.828 17l2.586-2.586a2 2 0 012.828 0L12.828 17H4.828z" />
                </svg>
              </div>
              Notifications
            </h2>
            
            <div className="space-y-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-white">
                      {key === 'email' ? 'Email Notifications' : 
                       key === 'push' ? 'Push Notifications' : 
                       'AI Updates'}
                    </label>
                    <p className="text-xs text-gray-400">
                      {key === 'email' ? 'Receive updates via email' : 
                       key === 'push' ? 'Get browser notifications' : 
                       'Notifications about AI features and updates'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleInputChange('notifications', key, !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      value ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* AI Settings */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">🤖</span>
              AI Configuration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-light text-white/90 mb-2">
                  AI Model
                </label>
                <select
                  value={settings.ai.model}
                  onChange={(e) => handleInputChange('ai', 'model', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-700 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                >
                  <option value="gpt-3.5-turbo" className="bg-gray-800/90 text-white">GPT-3.5 Turbo</option>
                  <option value="gpt-4" className="bg-gray-800/90 text-white">GPT-4</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-light text-white/90 mb-2">
                  Temperature: {settings.ai.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={settings.ai.temperature}
                  onChange={(e) => handleInputChange('ai', 'temperature', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Conservative</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-white/90 mb-2">
                  Max Tokens
                </label>
                <input
                  type="number"
                  min="100"
                  max="4000"
                  step="100"
                  value={settings.ai.maxTokens}
                  onChange={(e) => handleInputChange('ai', 'maxTokens', parseInt(e.target.value))}
                  className="w-full px-3 py-3 border border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Editor Settings */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">✏️</span>
              Editor Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">Auto Save</label>
                  <p className="text-xs text-gray-400">Automatically save your work</p>
                </div>
                <button
                  onClick={() => handleInputChange('editor', 'autoSave', !settings.editor.autoSave)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.editor.autoSave ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.editor.autoSave ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-white">Word Wrap</label>
                  <p className="text-xs text-gray-400">Wrap long lines in the editor</p>
                </div>
                <button
                  onClick={() => handleInputChange('editor', 'wordWrap', !settings.editor.wordWrap)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.editor.wordWrap ? 'bg-blue-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.editor.wordWrap ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-light text-white/90 mb-2">
                  Font Size: {settings.editor.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  step="1"
                  value={settings.editor.fontSize}
                  onChange={(e) => handleInputChange('editor', 'fontSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <span className="mr-2">🔒</span>
              Account Management
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-white">Change Password</h3>
                  <p className="text-xs text-gray-400">Update your account password</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors duration-200">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-white">Export Data</h3>
                  <p className="text-xs text-gray-400">Download your posts and data</p>
                </div>
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors duration-200">
                  Export
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-red-400">Delete Account</h3>
                  <p className="text-xs text-red-300">Permanently delete your account and all data</p>
                </div>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200">
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pb-8">
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-gray-600 rounded-lg shadow-sm text-sm font-light text-white bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-light text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  Saving...
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
