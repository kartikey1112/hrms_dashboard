'use client';

import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-theme">
      <aside className="w-64 bg-card border-r border-theme p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-card">HRMS Dashboard</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          <Link 
            href="/Dashboard" 
            className="px-3 py-2 rounded-lg text-card hover:bg-accent transition-colors"
          >
            Overview
          </Link>
          <Link 
            href="/Dashboard/employee-directory" 
            className="px-3 py-2 rounded-lg text-card hover:bg-accent transition-colors"
          >
            Employee Directory
          </Link>
          <Link 
            href="/Dashboard/leave-requests" 
            className="px-3 py-2 rounded-lg text-card hover:bg-accent transition-colors"
          >
            Leave Requests
          </Link>
          <Link 
            href="/Dashboard/profile" 
            className="px-3 py-2 rounded-lg text-card hover:bg-accent transition-colors"
          >
            Profile
          </Link>
        </nav>
        <form action="/api/auth/signout" method="post" className="mt-6">
          <button className="text-sm text-destructive hover:text-destructive/80 transition-colors">
            Sign out
          </button>
        </form>
      </aside>
      <main className="flex-1 p-6 bg-theme">{children}</main>
    </div>
  );
}


