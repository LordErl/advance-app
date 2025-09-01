'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserNav } from './UserNav';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Meu Adiantamento', href: '/dashboard' },
  { name: 'Histórico', href: '/dashboard/history' },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-primary-600">
                AdvanceApp
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    pathname === item.href
                      ? 'border-primary-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center
          ">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  );
}
