'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/authStore';
import Image from 'next/image';
import DeleteAccountModal from '@/components/settings/DeleteAccountModal';

export default function SettingsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setGlobalUsername = useAuthStore((state) => state.setUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Form states
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url, username, email')
        .eq('id', user.id)
        .single();

      if (data) {
        if (data.avatar_url) setAvatar(data.avatar_url);
        if (data.username) setUsername(data.username);
        
        // Update profile with email if not set
        if (!data.email && user.email) {
          await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              email: user.email,
              updated_at: new Date().toISOString(),
            });
        }
      }
    };

    fetchProfile();
  }, [user?.id]);

  useEffect(() => {
    // Check for email verification message
    if (searchParams.get('message') === 'email-verified') {
      setSuccess('Email address has been successfully verified and updated!');
    }
  }, [searchParams]);

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      setError(null);
      const file = e.target.files?.[0];
      if (!file) return;

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }

      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        });

      if (updateError) throw updateError;

      setAvatar(publicUrl);
      setSuccess('Avatar updated successfully');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Error uploading avatar');
    } finally {
      setLoading(false);
    }
  };

  // Handle username change
  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Update both auth metadata and profile
      const { data: authData, error: authError } = await supabase.auth.updateUser({
        data: { username }
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          username: username,
          email: user?.email,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      setGlobalUsername(username);
      setSuccess('Username updated successfully');
      
      // Force a refresh of the nav component
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating username');
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      if (passwordForm.newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }

      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: passwordForm.currentPassword,
      });

      if (signInError) throw new Error('Current password is incorrect');

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (updateError) throw updateError;

      setSuccess(
        'Password updated successfully. ' +
        'You will receive an email confirmation of this change.'
      );
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async (password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Verify password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: password
      });

      if (signInError) {
        throw new Error('Incorrect password');
      }

      // Delete avatar from storage if it exists
      if (avatar) {
        const fileName = avatar.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('avatars')
            .remove([fileName]);
        }
      }

      // Call the delete_user_account function
      const { error: deleteError } = await supabase.rpc('delete_user_account');
      
      if (deleteError) {
        throw new Error(`Failed to delete account: ${deleteError.message}`);
      }

      // Clear local storage and session
      window.localStorage.clear();
      
      // Sign out
      await supabase.auth.signOut();
      setUser(null);

      // Redirect to home page with full page refresh
      window.location.href = '/';
    } catch (err) {
      console.error('Delete account error:', err);
      setError(err instanceof Error ? err.message : 'Error deleting account');
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  // Update profile handler
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: updateError } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (updateError) throw updateError;

      // Update the user in the store
      if (data.user) {
        setUser(data.user);
      }

      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              TaskTuner Settings
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Manage your account preferences</p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center text-white/80 hover:text-white transition-colors text-sm sm:text-base"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="ml-2">Back to Dashboard</span>
          </Link>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="bg-[#1a1d21] rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Profile</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                {success}
              </div>
            )}

            {/* Avatar Upload */}
            <div className="mb-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt="Profile"
                      fill
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-2xl text-gray-400">
                        {username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                  >
                    {loading ? 'Uploading...' : 'Change Avatar'}
                  </button>
                </div>
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2d3238] border border-gray-700 rounded-lg text-white text-sm sm:text-base"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-3 py-2 bg-[#2d3238] border border-gray-700 rounded-lg text-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleUsernameChange}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="bg-[#1a1d21] rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#2d3238] border border-gray-700 rounded-lg text-white text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#2d3238] border border-gray-700 rounded-lg text-white text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#2d3238] border border-gray-700 rounded-lg text-white text-sm sm:text-base"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#1a1d21] rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-red-500 mb-4">Danger Zone</h2>
            <p className="text-gray-400 text-sm sm:text-base mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
} 