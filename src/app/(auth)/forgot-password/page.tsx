import AuthForm from '@/components/auth/AuthForm';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthForm mode="forgot" />
    </div>
  );
} 