'use client';

import Link from 'next/link';

export default function TermsPage() {
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
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">Terms of Service</h1>
          
          <div className="space-y-6 text-gray-400">
            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Service Description</h2>
              <p>TaskTuner provides AI-powered calendar management and scheduling services. By using our service, you agree to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Maintain accurate account information</li>
                <li>Use the service for personal or authorized business use only</li>
                <li>Not attempt to circumvent any security features</li>
                <li>Not use the service for any illegal or unauthorized purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">User Accounts</h2>
              <p>Users are responsible for:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Maintaining the confidentiality of their account credentials</li>
                <li>All activities that occur under their account</li>
                <li>Notifying us of any unauthorized account access</li>
                <li>Keeping their contact information up to date</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">AI Features</h2>
              <p>Our AI scheduling features:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Are provided as-is with no guarantee of accuracy</li>
                <li>Should be reviewed by users before confirming events</li>
                <li>May have occasional downtime for maintenance or updates</li>
                <li>Are subject to usage limits to ensure service quality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Limitations of Liability</h2>
              <p>TaskTuner is not liable for:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Missed events or scheduling errors</li>
                <li>Service interruptions or data loss</li>
                <li>Third-party API failures or limitations</li>
                <li>Damages arising from service use or inability to use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Changes to Terms</h2>
              <p>We reserve the right to modify these terms at any time. Users will be notified of significant changes via:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Email notifications</li>
                <li>In-app announcements</li>
                <li>Website updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
              <p>For questions about these terms, please contact:</p>
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