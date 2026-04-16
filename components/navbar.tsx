'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Build nav links based on auth state
  const links = [];

  if (user) {
    // Logged-in: show only the relevant section
    if (user.role === 'PATIENT') {
      links.push({ href: '/patient', label: 'Mon Espace' });
    } else if (user.role === 'DOCTOR') {
      links.push({ href: '/doctor', label: 'Mon Espace' });
    }
    links.push({ href: '/alerts', label: 'Alertes' });
  } else {
    // Not logged-in: simple links
    links.push({ href: '/', label: 'Accueil' });
  }

  function handleLogout() {
    logout();
    router.push('/');
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg hover:opacity-90 transition">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg px-2.5 py-1.5 text-sm font-extrabold shadow-md">
            MS
          </div>
          <span className="text-gray-900 dark:text-white">MediSuiv</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg transition-all text-sm font-medium',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* User info badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  user.role === 'DOCTOR' ? 'bg-emerald-500' : 'bg-blue-500'
                )} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.firstName} {user.lastName}
                </span>
                <span className={cn(
                  'text-xs px-1.5 py-0.5 rounded font-medium',
                  user.role === 'DOCTOR'
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                    : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                )}>
                  {user.role === 'DOCTOR' ? 'Médecin' : 'Patient'}
                </span>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              href="/signin"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-semibold shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all"
            >
              Se connecter
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}