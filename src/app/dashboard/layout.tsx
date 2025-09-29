'use client'

import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
          <div className="flex flex-col h-[calc(100vh-4rem)] rounded-lg bg-gray-900/90 backdrop-blur-sm shadow-2xl overflow-hidden">
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
                      className="flex items-center text-gray-400 hover:text-white transition-colors duration-200 px-2 py-1 rounded hover:bg-gray-800/50"
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
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-900">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-xl font-bold text-white">AI CMS</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 bg-black rounded-lg m-4 overflow-hidden">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-black lg:hidden">
          <button
            type="button"
            className="px-4 bg-gray-600/60 text-gray-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden hover:bg-gray-600/80 transition-colors duration-200"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </button>
          <div className="flex-1 flex justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex-1 flex">
              <h1 className="text-lg font-semibold text-white self-center">AI CMS</h1>
            </div>
          </div>
        </div>

        <main className="flex-1 bg-black">
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
