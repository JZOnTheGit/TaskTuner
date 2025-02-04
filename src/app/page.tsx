'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Hero Section */}
      <div className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center">
              <Image
                src="/images/logo-no-background.png"
                alt="TaskTuner Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/login"
                className="text-white/80 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Organize Your Time with AI-Powered Intelligence
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-8">
              TaskTuner helps you manage your schedule effortlessly with smart suggestions and intuitive calendar management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg transition-colors"
              >
                Start Free
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg text-lg transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-[#1a1d21] py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            Why Choose TaskTuner?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-black/30 p-6 rounded-xl">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Scheduling</h3>
              <p className="text-gray-400">
                Let our AI assistant help you create and manage events intelligently.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-black/30 p-6 rounded-xl">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Calendar</h3>
              <p className="text-gray-400">
                Intuitive interface for managing your schedule with ease.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-black/30 p-6 rounded-xl">
              <div className="w-12 h-12 bg-pink-600/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Secure & Private</h3>
              <p className="text-gray-400">
                Your data is encrypted and protected with industry-standard security.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} TaskTuner. Created by{' '}
              <a 
                href="https://j-singh.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 transition-colors"
              >
                Jainesh Singh
              </a>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
