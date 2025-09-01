'use client';

import { NotificationProvider } from '@/app/components/NotificationSystem';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {children}
      </div>
    </NotificationProvider>
  );
}
