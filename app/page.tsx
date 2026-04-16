'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function WelcomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If already logged in, redirect to the appropriate section
  useEffect(() => {
    if (!loading && user) {
      router.replace(user.role === 'DOCTOR' ? '/doctor' : '/patient');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user) return null; // Will redirect

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden px-4 py-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950" />
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-100/20 dark:bg-cyan-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 ring-1 ring-blue-200 dark:ring-blue-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            Plateforme de Suivi Médical
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
            Bienvenue sur{' '}
            <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
              MediSuiv
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Connectez patients et médecins pour un suivi médical moderne, sécurisé et efficace.
            Questionnaires de santé, suivi des signes vitaux et approbations en temps réel.
          </p>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            {/* Patient Card */}
            <Link href="/signup?role=patient" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/80 p-8 ring-1 ring-gray-200 dark:ring-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:ring-blue-400 dark:hover:ring-blue-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Je suis Patient
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    Créez votre compte, remplissez votre questionnaire de santé
                    et partagez vos signes vitaux avec votre médecin.
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm group-hover:gap-3 transition-all">
                    S&apos;inscrire comme Patient
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Doctor Card */}
            <Link href="/signup?role=doctor" className="group">
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800/80 p-8 ring-1 ring-gray-200 dark:ring-gray-700 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:ring-emerald-400 dark:hover:ring-emerald-500">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Je suis Médecin
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    Inscrivez-vous avec votre spécialité, gérez les demandes de patients
                    et suivez leurs signes vitaux.
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm group-hover:gap-3 transition-all">
                    S&apos;inscrire comme Médecin
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Sign In link */}
          <p className="text-gray-500 dark:text-gray-400">
            Déjà un compte ?{' '}
            <Link href="/signin" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline underline-offset-4">
              Se connecter
            </Link>
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Comment ça fonctionne
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Inscription',
                desc: 'Créez votre compte en tant que patient ou médecin avec vos informations.',
                color: 'from-blue-500 to-blue-600',
              },
              {
                step: '02',
                title: 'Questionnaire',
                desc: 'Les patients remplissent un questionnaire de santé détaillé pour être orientés.',
                color: 'from-indigo-500 to-indigo-600',
              },
              {
                step: '03',
                title: 'Suivi Médical',
                desc: 'Les médecins approuvent et suivent les signes vitaux de leurs patients.',
                color: 'from-emerald-500 to-emerald-600',
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white font-bold text-lg flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
