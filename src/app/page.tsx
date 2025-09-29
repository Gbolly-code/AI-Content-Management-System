import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-poppins font-bold text-white mb-6 leading-tight">
            AI-Powered Content Management System
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-light">
            Create, manage, and optimize your content with the power of artificial intelligence. 
            Generate engaging articles, optimize for SEO, and publish with confidence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              href="/dashboard" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Go to Dashboard
            </Link>
            <Link 
              href="/blog" 
              className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 transition-colors"
            >
              View Blog
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-xl">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">AI Content Generation</h3>
            <p className="text-gray-300">
              Generate high-quality blog posts, articles, and content using advanced AI technology.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-xl">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">SEO Optimization</h3>
            <p className="text-gray-300">
              Automatically optimize your content for search engines with AI-powered suggestions.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 shadow-xl">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Content Management</h3>
            <p className="text-gray-300">
              Organize, schedule, and publish your content with an intuitive dashboard.
            </p>
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 mb-8">
            Set up your account and start creating amazing content today.
          </p>
          <Link 
            href="/auth/login" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </main>
  )
}
