export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-black/30 rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold">Check your email</h2>
        <p className="text-gray-600 dark:text-gray-400">
          We've sent you a verification link to your email address. Please click on
          the link to verify your account.
        </p>
        <div className="pt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Didn't receive the email?{' '}
            <button className="text-blue-600 hover:underline">
              Click here to resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 