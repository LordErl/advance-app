'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { useAuthStore } from '@/app/stores/authStore';
import {
  HomeIcon,
  CurrencyDollarIcon,
  DocumentDuplicateIcon,
  Cog6ToothIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Adiantamentos', href: '/advances', icon: CurrencyDollarIcon },
  { name: 'Despesas', href: '/expenses', icon: DocumentDuplicateIcon },
  { name: 'Configurações', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Perfil', href: '/profile', icon: UserIcon },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [pageTitle, setPageTitle] = useState('Dashboard');

  // Define o título da página com base na rota atual
  useEffect(() => {
    const currentRoute = navigation.find((item) => pathname.startsWith(item.href));
    if (currentRoute) {
      setPageTitle(currentRoute.name);
    } else if (pathname.includes('/advances/')) {
      setPageTitle('Detalhes do Adiantamento');
    } else if (pathname.includes('/expenses/')) {
      setPageTitle('Detalhes da Despesa');
    }
  }, [pathname]);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar para mobile */}
        <div
          className={`fixed inset-0 z-40 lg:hidden ${
            sidebarOpen ? 'block' : 'hidden'
          } bg-gray-600 bg-opacity-75 transition-opacity`}
          onClick={() => setSidebarOpen(false)}
        />

        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              AdvanceApp
            </Link>
            <button
              type="button"
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <nav className="mt-5 flex flex-1 flex-col px-2">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-600'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Conteúdo principal */}
        <div className="flex flex-1 flex-col lg:pl-64">
          {/* Cabeçalho */}
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
            <button
              type="button"
              className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex flex-1 items-center justify-between px-4">
              <h1 className="text-xl font-semibold text-gray-900">{pageTitle}</h1>
              <div className="flex items-center">
                {/* Perfil do usuário */}
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium text-gray-700">
                      {user?.email || 'Usuário'}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo da página */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}