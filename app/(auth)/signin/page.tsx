'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { useAuth } from '@/components/auth-provider';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === 'true';
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        login({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          specialty: user.specialty,
        });

        // Redirect based on role
        if (user.role === 'DOCTOR') {
          router.push('/doctor');
        } else {
          router.push('/patient');
        }
      } else {
        const text = await response.text();
        setError(text || 'Email ou mot de passe incorrect.');
      }
    } catch (err) {
      setError("Impossible de contacter le serveur. Vérifiez que les services sont démarrés.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-sm">
        <div className="rounded-2xl bg-white dark:bg-gray-800/90 p-8 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Connexion
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bienvenue sur MediSuiv
            </p>
          </div>

          {/* Success message after registration */}
          {justRegistered && (
            <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm ring-1 ring-green-200 dark:ring-green-800">
              ✓ Compte créé avec succès ! Connectez-vous maintenant.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm ring-1 ring-red-200 dark:ring-red-800">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
              <input
                required
                type="email"
                placeholder="jean.dupont@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 rounded-lg bg-gray-50 dark:bg-gray-700/50 ring-1 ring-gray-200 dark:ring-gray-600 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Mot de passe</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 rounded-lg bg-gray-50 dark:bg-gray-700/50 ring-1 ring-gray-200 dark:ring-gray-600 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition text-gray-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-5 space-y-2 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pas encore de compte ?{' '}
              <Link href="/signup" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4">
                S&apos;inscrire
              </Link>
            </p>
            <Link href="/" className="block text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition">
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </main>
    }>
      <SignInForm />
    </Suspense>
  );
}
