'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Alerts' },
    { href: '/patient', label: 'Patient' },
    { href: '/doctor', label: 'Doctor' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-blue-600 text-white shadow-lg">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-90">
          <div className="bg-white text-blue-600 rounded px-2 py-1 font-bold">MS</div>
          <span>MediSuiv</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-md transition-all font-medium',
                  isActive
                    ? 'bg-white text-blue-600'
                    : 'text-white hover:bg-blue-500'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Sign In Button */}
        <Button className="bg-white text-blue-600 hover:bg-gray-100">
          Sign In
        </Button>
      </div>
    </nav>
  );
}
  