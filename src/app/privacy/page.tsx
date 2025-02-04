'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black p-4 sm:p-8">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-white/80 hover:text-white transition-colors text-sm sm:text-base"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="ml-2">Back to Home</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1a1d21] rounded-xl sm:rounded-2xl p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-400">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data Collection and Usage</h2>
              <p>TaskTuner collects and stores the following information to provide our calendar and AI scheduling services:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Account information (email and username)</li>
                <li>Calendar events and schedules</li>
                <li>Profile settings and preferences</li>
                <li>AI scheduling prompts and suggestions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data Protection</h2>
              <p>Your data is stored securely in our Supabase database with:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure authentication mechanisms</li>
                <li>Regular security updates and monitoring</li>
                <li>Row Level Security (RLS) policies ensuring data isolation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">AI Processing</h2>
              <p>Our AI features use the Anthropic Claude API to process your scheduling requests. The AI:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Only processes the specific prompts you provide</li>
                <li>Does not store your conversations or personal data</li>
                <li>Uses secure API connections for all communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Data Deletion</h2>
              <p>You can delete your account and associated data at any time through the settings page. Upon deletion:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>All personal information is permanently removed</li>
                <li>Calendar events are deleted from our database</li>
                <li>Profile data and preferences are purged</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
              <p>For privacy concerns or questions, please contact:</p>
              <p className="mt-2">
                <a 
                  href="https://j-singh.net" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-400"
                >
                  Jainesh Singh
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 