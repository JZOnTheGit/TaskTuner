'use client';

import { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/stores/authStore';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardNav() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const username = useAuthStore((state) => state.username);
  const setUsername = useAuthStore((state) => state.setUsername);
  const [avatar, setAvatar] = useState<string | null>(null);

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
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id, setUsername]);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold">TaskTuner</h1>
          
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center">
              <span className="sr-only">Open user menu</span>
              <div className="relative h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt="Profile"
                    fill
                    sizes="(max-width: 32px) 100vw, 32px"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm">
                    {username?.[0].toUpperCase() || user?.email?.[0].toUpperCase()}
                  </div>
                )}
              </div>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      href="/dashboard/settings"
                      className={classNames(
                        active ? 'bg-gray-100 dark:bg-gray-700' : '',
                        'block px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                      )}
                    >
                      Settings
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleSignOut}
                      className={classNames(
                        active ? 'bg-gray-100 dark:bg-gray-700' : '',
                        'block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200'
                      )}
                    >
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </nav>
  );
} 