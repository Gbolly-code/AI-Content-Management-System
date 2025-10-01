'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Get current page title for breadcrumb
  const getPageTitle = () => {
    const path = pathname.split('/').pop()
    switch (path) {
      case 'dashboard':
        return 'Dashboard'
      case 'posts':
        return 'All Posts'
      case 'create':
        return 'Create Post'
      case 'ai':
        return 'AI Assistant'
      case 'analytics':
        return 'Analytics'
      case 'settings':
        return 'Settings'
      default:
        return 'Dashboard'
    }
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'All Posts', href: '/dashboard/posts', icon: '📝' },
    { name: 'Create Post', href: '/dashboard/posts/create', icon: '✍️' },
    { name: 'AI Assistant', href: '/dashboard/ai', icon: '🤖' },
    { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
    { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-black flex">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:items-center lg:justify-center lg:h-screen lg:px-8 lg:sticky lg:top-0 lg:py-8">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-[calc(100vh-4rem)] rounded-lg bg-gray-800/70 backdrop-blur-md border border-gray-700 shadow-2xl overflow-hidden">
            <div className="flex-1 flex flex-col bg-gray-800/60">
              <div className="flex items-center flex-shrink-0 px-4 py-6 bg-gray-700/80">
                <h1 className="text-xl font-bold text-white">AI CMS</h1>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1 bg-gray-800/40">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center px-4 py-4 text-sm font-medium rounded-xl text-gray-200 hover:bg-gray-700/60 hover:text-white transition-all duration-200 bg-gray-800/30"
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex p-4 bg-gray-700/60">
              <div className="flex items-center w-full">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.email}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Account</span>
                    <button
                      onClick={signOut}
                      className="flex items-center text-red-400 hover:text-red-300 transition-colors duration-200 px-2 py-1 rounded hover:bg-red-500/20"
                      title="Sign out"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-xs">Sign out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-gray-800/70 backdrop-blur-md border border-gray-700 shadow-2xl rounded-r-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
            <h1 className="text-xl font-bold text-white">Content Management System</h1>
            <button
              type="button"
              className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-700/60 text-gray-300 hover:bg-gray-600/80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 h-0 pt-4 pb-4 overflow-y-auto">
            <nav className="px-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-4 py-3 text-base font-medium rounded-lg text-gray-300 hover:bg-gray-700/60 hover:text-white transition-colors duration-200"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
              {/* Sign Out Button */}
              <button
                onClick={() => {
                  signOut()
                  setSidebarOpen(false)
                }}
                className="w-full flex items-center px-4 py-3 text-base font-medium rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign out
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 bg-black rounded-lg m-4">
        {/* Desktop header */}
        <div className="hidden lg:block sticky top-0 z-30 bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="px-6 py-4">
            <div className="flex items-center justify-center">
              <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Content Management System
              </h1>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="sticky top-0 z-20 flex-shrink-0 lg:hidden m-4 mb-0">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 shadow-xl rounded-lg p-4">
            <div className="flex items-center">
              <button
                type="button"
                className="px-4 py-2 bg-gray-700/60 text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 hover:bg-gray-600/80 transition-colors duration-200 rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
              <div className="flex-1 flex justify-center">
                <h1 className="text-lg font-semibold text-white">Content Management System</h1>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 bg-black overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
