'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import Link from 'next/link'
import Image from 'next/image'
import { 
  DocumentTextIcon,
  SparklesIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'

export default function WelcomePage() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative py-12 px-4 sm:px-6 lg:px-16">
      {/* Background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl" style={{ fontFamily: 'var(--font-outfit)' }}>
        {/* Single Container */}
        <div className="relative">
          <div className="relative rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Side - SVG Illustration */}
              <div className="flex justify-center lg:justify-start order-1">
                <div className="w-full max-w-lg relative">
                  {/* Floating "Artificial" Badge */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10 animate-float">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-30 blur group-hover:opacity-50 transition duration-300"></div>
                      <div className="relative px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg">
                        <span className="text-white text-sm font-medium tracking-wide">Artificial</span>
                      </div>
                    </div>
                  </div>
                  
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 799.913 621.194" className="w-full h-auto">
                  <g transform="translate(-336.178 -52.593)">
                    <path d="M579.319,260.562s10.372,78.186-5.585,86.966,94.944,9.574,94.944,9.574-24.733-67.817-13.564-88.563Z" transform="translate(134.436 45.816)" fill="#ed9da0"/>
                    <circle cx="55.051" cy="55.051" r="55.051" transform="translate(703.384 238.578)" fill="#ed9da0"/>
                    <path d="M724.871,376.22l-9.223,42-19.5,88.855-.584,4.866-6.73,56.335L684.355,605.7l-3,25.139c-18.252,9.38-31.48,15.856-31.48,15.856s-1.138-5.7-2.972-13c-12.809,3.84-36.511,10.211-56.6,11.484,7.314,8.153-105.647-199.226-109.982-226.956-3.489-22.317-6.109-41.175-6.663-45.187-.075-.524-.112-.794-.112-.794l84.169-37.192c5.982,13.872,33.913,18.042,33.913,18.042,23.14-1.595,41.28-13.8,41.28-13.8Z" transform="translate(159.226 27.094)" fill="#6c63ff"/>
                    <path d="M838.288,583.125c-5.607,6.079-19.5,15.235-36.346,25.147-6.266,3.683-12.936,7.479-19.741,11.252-16.238,9.006-33.239,17.93-47.269,25.139-18.252,9.38-31.48,15.856-31.48,15.856s-1.138-5.7-2.972-13c-2.456-9.77-6.154-22.4-10.009-27.991-.135-.195-.269-.374-.4-.554-1.123-1.475-2.253-2.336-3.369-2.336L742.41,582.1l24.076-14.928-17.346-41.407-21.755-51.94,13.131-41.781,13.2-42h24.735s8.19,17.877,18.664,42.807c1.565,3.728,3.182,7.614,4.829,11.626C823.487,496.882,850.351,570.058,838.288,583.125Z" transform="translate(105.647 13.269)" fill="#6c63ff"/>
                    <path d="M512.566,617.959a35.777,35.777,0,0,0-6.064.494c-17.211,2.957-22.287,18.536-23.732,28.972a53.785,53.785,0,0,0-.524,9.627l-15.2-11.694-5.54-4.26c-13.333-4.649-25.214-12.906-35.515-22.646a178.53,178.53,0,0,1-23.919-28.366,250.148,250.148,0,0,1-18.506-31.742,23.345,23.345,0,0,1-.322-19.8l18.828-41.961,27.52-61.328q.3-2.19.666-4.282c5.458-31.293,20.078-45.187,20.078-45.187H461.5l7.471,45.188,9.283,56.14-6.506,21.216-15.033,49,14.366,15.6Z" transform="translate(182.44 14.34)" fill="#6c63ff"/>
                    <path d="M745.337,761.547v4.544a9.985,9.985,0,0,1-.681,3.646,10.245,10.245,0,0,1-.726,1.5,10.06,10.06,0,0,1-8.647,4.911h-334.3a10.059,10.059,0,0,1-8.647-4.911,10.246,10.246,0,0,1-.726-1.5,9.985,9.985,0,0,1-.681-3.646v-4.544a10.051,10.051,0,0,1,10.054-10.054h19.272v-2.119a.419.419,0,0,1,.419-.419h10.054a.418.418,0,0,1,.419.419v2.119h6.281v-2.119a.419.419,0,0,1,.419-.419H447.9a.418.418,0,0,1,.419.419v2.119h6.288v-2.119a.419.419,0,0,1,.419-.419h10.054a.418.418,0,0,1,.419.419v2.119h6.281v-2.119a.419.419,0,0,1,.419-.419h10.054a.418.418,0,0,1,.419.419v2.119h6.281v-2.119a.418.418,0,0,1,.419-.419h10.054a.418.418,0,0,1,.419.419v2.119h6.289v-2.119a.418.418,0,0,1,.419-.419H516.61a.418.418,0,0,1,.419.419v2.119h6.281v-2.119a.418.418,0,0,1,.419-.419h78.756a.418.418,0,0,1,.419.419v2.119h6.289v-2.119a.419.419,0,0,1,.419-.419h10.054a.424.424,0,0,1,.419.419v2.119h6.281v-2.119a.418.418,0,0,1,.419-.419H636.84a.418.418,0,0,1,.419.419v2.119h6.281v-2.119a.418.418,0,0,1,.419-.419h10.054a.418.418,0,0,1,.419.419v2.119h6.289v-2.119a.418.418,0,0,1,.419-.419H671.2a.417.417,0,0,1,.412.419v2.119H677.9v-2.119a.418.418,0,0,1,.419-.419h10.054a.419.419,0,0,1,.419.419v2.119h6.281v-2.119a.418.418,0,0,1,.419-.419h10.054a.418.418,0,0,1,.419.419v2.119h29.324a10.051,10.051,0,0,1,10.054,10.054Z" transform="translate(179.993 -103.747)" fill="#090814"/>
                    <rect width="548.748" height="1.497" transform="translate(473.793 672.289)" fill="#ccc"/>
                    <path d="M722.731,509.283h-124.6v-2.569h-56.5v2.569H416.507a8.429,8.429,0,0,0-8.428,8.425V688.333a8.429,8.429,0,0,0,8.429,8.429H722.731a8.429,8.429,0,0,0,8.429-8.429V517.708a8.429,8.429,0,0,0-8.429-8.429Z" transform="translate(175.682 -42.855)" fill="#090814"/>
                    <circle cx="18.716" cy="18.716" r="18.716" transform="translate(726.831 507.28)" fill="none" stroke="#d0cde1" strokeMiterlimit="10" strokeWidth="2"/>
                    <circle cx="18.716" cy="18.716" r="18.716" transform="translate(720.842 514.018)" fill="#f2f2f2"/>
                    <path d="M466.07,66.443,462.183,106.1s-40.8-79.157,9.938-93.795c0,0-4.941-6.69,2.229-8.916s75.146-12.9,80.565,20.38c0,0,35.511,22.009,24.763,45.556L567.015,97.013l-11.464.637s-.323-52.7-17.832-50.949S466.07,66.443,466.07,66.443Z" transform="translate(241.781 206.175)" fill="#090814"/>
                    <g transform="translate(932.737 93.404) rotate(9)">
                      <path d="M203.178,126.873H2.71A2.713,2.713,0,0,1,0,124.163V0H205.889V124.163a2.713,2.713,0,0,1-2.71,2.71Z" transform="translate(0.088 5.218)" fill="#e6e6e6"/>
                      <path d="M191.453,107.732H2.74A2.743,2.743,0,0,1,0,104.993V2.74A2.743,2.743,0,0,1,2.74,0H191.453a2.743,2.743,0,0,1,2.74,2.74V104.993a2.743,2.743,0,0,1-2.74,2.74Z" transform="translate(5.935 16.6)" fill="#fff"/>
                      <path d="M205.889,9.052H0V2.71A2.713,2.713,0,0,1,2.71,0H203.178a2.713,2.713,0,0,1,2.71,2.71Z" transform="translate(0 0)" fill="#6c63ff"/>
                      <circle cx="1.619" cy="1.619" r="1.619" transform="translate(5.031 3.005)" fill="#fff"/>
                      <circle cx="1.619" cy="1.619" r="1.619" transform="translate(11.175 3.005)" fill="#fff"/>
                      <circle cx="1.619" cy="1.619" r="1.619" transform="translate(17.318 3.005)" fill="#fff"/>
                      <rect width="19.45" height="8.609" transform="translate(25.331 34.935)" fill="#e6e6e6"/>
                      <rect width="19.45" height="8.609" transform="translate(64.231 52.791)" fill="#e6e6e6"/>
                      <rect width="19.45" height="8.609" transform="translate(25.331 79.574)" fill="#6c63ff"/>
                      <rect width="19.45" height="8.609" transform="translate(64.231 97.43)" fill="#6c63ff"/>
                      <rect width="19.45" height="8.609" transform="translate(161.161 106.357)" fill="#6c63ff"/>
                      <rect width="19.45" height="8.609" transform="translate(141.711 70.646)" fill="#e6e6e6"/>
                      <rect width="38.9" height="8.609" transform="translate(83.681 70.646)" fill="#6c63ff"/>
                      <rect width="38.9" height="8.609" transform="translate(83.681 25.689)" fill="#6c63ff"/>
                    </g>
                    <g transform="translate(336.178 193.499)">
                      <path d="M832.56,134.472A66.879,66.879,0,0,0,786.515,113.5v67.018Z" transform="translate(-694.356 -113.5)" fill="#090814"/>
                      <path d="M832.56,201.87l-46.045,46.045h64.349A66.843,66.843,0,0,0,832.56,201.87Z" transform="translate(-694.356 -172.553)" fill="#e4e4e4"/>
                      <path d="M850.93,355.18a67.246,67.246,0,0,1-1.154,12.451c-.06.325-.123.647-.189.969a66.531,66.531,0,0,1-7.763,20.343c-.2.338-.4.677-.6,1.009v0a67.288,67.288,0,0,1-13.469,15.933c-.262.229-.524.455-.79.677A66.785,66.785,0,0,1,786.51,422.2V355.18Z" transform="translate(-694.352 -275.002)" fill="#f0f0f0"/>
                      <path d="M674.073,422.253c.891,0,1.776-.023,2.659-.057v-67.02l-48.739,48.739a66.844,66.844,0,0,0,46.081,18.338Z" transform="translate(-588.423 -274.999)" fill="#cacaca"/>
                      <path d="M632.052,138.473a67.077,67.077,0,0,0-67.077,67.078h69.806V138.533C633.875,138.5,632.967,138.473,632.052,138.473Z" transform="translate(-546.312 -130.188)" fill="#6c63ff"/>
                      <path d="M578.458,355.18l-14.1,14.1-.461.461-.01.01-12.3,12.295-.468.468L537.832,395.8l-.468.468v0l-7.647,7.644a66.884,66.884,0,0,1-21-48.738Z" transform="translate(-508.72 -275.002)" fill="#6c63ff"/>
                    </g>
                    <g transform="translate(546.6 84.243) rotate(-19)">
                      <path d="M93,128.957H4.216A4.221,4.221,0,0,1,0,124.741V4.216A4.221,4.221,0,0,1,4.216,0H93a4.221,4.221,0,0,1,4.216,4.216V124.741A4.221,4.221,0,0,1,93,128.957Z" transform="translate(0 0)" fill="#f2f2f2"/>
                      <path d="M27.11,3.975H1.987A1.987,1.987,0,1,1,1.987,0H27.11a1.987,1.987,0,0,1,0,3.975Z" transform="translate(48.7 27.328)" fill="#6c63ff"/>
                      <path d="M35.308,3.975H1.987A1.987,1.987,0,1,1,1.987,0h33.32a1.987,1.987,0,0,1,0,3.975Z" transform="translate(48.7 34.035)" fill="#6c63ff"/>
                      <path d="M2.622,0H30.814a2.622,2.622,0,0,1,2.622,2.622v17.7a2.622,2.622,0,0,1-2.622,2.622H2.622A2.622,2.622,0,0,1,0,20.324V2.622A2.622,2.622,0,0,1,2.622,0Z" transform="translate(11.05 19.905)" fill="#6c63ff"/>
                    </g>
                  </g>
                </svg>
                </div>
              </div>

              {/* Right Side - Content */}
              <div className="text-center lg:text-left order-2">
                {/* Main Content */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
                  AI-Powered <span style={{ color: '#6c63ff', fontFamily: 'var(--font-space-grotesk)' }}>Content Management</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-white mb-8 leading-relaxed font-light">
                  Create, optimize, and publish content with the power of artificial intelligence. Generate engaging articles, improve SEO, and manage your content effortlessly.
                </p>

                {/* Features */}
                <div className="space-y-4 mb-10">
                  <div className="flex items-center justify-center lg:justify-start space-x-3 text-white">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border" style={{ backgroundColor: 'rgba(108, 99, 255, 0.2)', borderColor: 'rgba(108, 99, 255, 0.3)' }}>
                      <SparklesIcon className="w-5 h-5" style={{ color: '#6c63ff' }} />
                    </div>
                    <span className="text-base sm:text-lg font-medium">AI Content Generation</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-3 text-white">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border" style={{ backgroundColor: 'rgba(108, 99, 255, 0.2)', borderColor: 'rgba(108, 99, 255, 0.3)' }}>
                      <DocumentTextIcon className="w-5 h-5" style={{ color: '#6c63ff' }} />
                    </div>
                    <span className="text-base sm:text-lg font-medium">SEO Optimization</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start space-x-3 text-white">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border" style={{ backgroundColor: 'rgba(108, 99, 255, 0.2)', borderColor: 'rgba(108, 99, 255, 0.3)' }}>
                      <CpuChipIcon className="w-5 h-5" style={{ color: '#6c63ff' }} />
                    </div>
                    <span className="text-base sm:text-lg font-medium">Smart Content Management</span>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="flex items-center justify-center lg:justify-start">
                  <Link 
                    href="/auth/login"
                    className="w-full sm:w-auto font-semibold py-4 px-10 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                    style={{ backgroundColor: '#ffffff', color: '#6c63ff' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#9ca3af'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff'
                    }}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
