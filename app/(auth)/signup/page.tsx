'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

const specialties = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Dermatology',
  'General Practice',
  'Pediatrics',
  'Psychiatry',
  'Surgery',
  'ENT',
  'Ophthalmology',
];

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  const [role, setRole] = useState<'PATIENT' | 'DOCTOR'>(
    roleParam === 'doctor' ? 'DOCTOR' : 'PATIENT'
  );
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (roleParam === 'doctor') setRole('DOCTOR');
    else if (roleParam === 'patient') setRole('PATIENT');
  }, [roleParam]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (role === 'DOCTOR' && !specialty) {
      setError('Veuillez sélectionner votre spécialité.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          phone,
          role,
          specialty: role === 'DOCTOR' ? specialty : null,
        }),
      });

      if (response.ok) {
        router.push('/signin?registered=true');
      } else {
        const text = await response.text();
        setError(text || "Erreur lors de l'inscription.");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur. Vérifiez que les services sont démarrés.");
    } finally {
      setIsLoading(false);
    }
  }

  const isDoctor = role === 'DOCTOR';
  const accentColor = isDoctor ? 'emerald' : 'blue';

  return (
    <main className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl bg-white dark:bg-gray-800/90 p-8 shadow-xl ring-1 ring-gray-200 dark:ring-gray-700">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Inscription
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Créez votre compte MediSuiv
            </p>
          </div>

          {/* Role Toggle */}
          <div className="flex gap-2 mb-6 p-1 rounded-xl bg-gray-100 dark:bg-gray-700/50">
            <button
              type="button"
              onClick={() => setRole('PATIENT')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                role === 'PATIENT'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              🧑 Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('DOCTOR')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                role === 'DOCTOR'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              🩺 Médecin
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm ring-1 ring-red-200 dark:ring-red-800">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Prénom</label>
                <input
                  required
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jean"
                  className="w-full h-10 rounded-lg bg-gray-50 dark:bg-gray-700/50 ring-1 ring-gray-200 dark:ring-gray-600 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Nom</label>
                <input
                  required
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dupont"
                  className="w-full h-10 rounded-lg bg-gray-50 dark:bg-gray-700/50 ring-1 ring-gray-200 dark:ring-gray-600 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean.dupont@email.com"
                className="w-full h-10 rounded-lg bg-gray-50 dark:bg-gray-700/50 ring-1 ring-gray-200 dark:ring-gray-600 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Téléphone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+213 555 123 456"
                className="w-full h-10 rounded-lg bg-gray-50 dark:bg-gray-700/50 ring-1 ring-gray-200 dark:ring-gray-600 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition text-gray-900 dark:text-white"
              />
            </div>

            {/* Doctor Specialty */}
            {isDoctor && (
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Spécialité *</label>
                <select
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full h-10 rounded-lg bg-gray-50 dark:bg-gray-700/50 ring-1 ring-gray-200 dark:ring-gray-600 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition text-gray-900 dark:text-white"
                >
                  <option value="">Sélectionnez une spécialité</option>
                  {specialties.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Mot de passe</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 rounded-lg bg-gray-50 dark:bg-gray-700/50 ring-1 ring-gray-200 dark:ring-gray-600 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Confirmer</label>
                <input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 rounded-lg bg-gray-50 dark:bg-gray-700/50 ring-1 ring-gray-200 dark:ring-gray-600 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-11 rounded-lg font-semibold text-white text-sm transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 ${
                isDoctor
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
              }`}
            >
              {isLoading ? "Inscription en cours..." : "S'inscrire"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-5 text-center text-sm text-gray-500 dark:text-gray-400">
            Déjà un compte ?{' '}
            <Link href="/signin" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </main>
    }>
      <SignUpForm />
    </Suspense>
  );
}
