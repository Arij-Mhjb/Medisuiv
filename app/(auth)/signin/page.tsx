"use client"

import Link from "next/link"
import { useState } from "react"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    window.location.href = "/dashboard"
  }

  return (
    <main className="min-h-[80dvh] flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 ring-1 ring-border">
        <h1 className="text-2xl font-semibold text-foreground mb-2 text-balance">Connexion</h1>
        <p className="text-sm text-muted-foreground mb-6">Bienvenue sur MediSuiv.</p>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-md bg-background ring-1 ring-border px-3 text-sm outline-none" />
          <input required type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 rounded-md bg-background ring-1 ring-border px-3 text-sm outline-none" />
          <button type="submit" className="w-full h-10 rounded-md bg-brand text-background font-medium">Se connecter</button>
        </form>
        <p className="mt-4 mb-3 text-sm text-muted-foreground">Pas encore de compte ? <Link href="/signup" className="text-brand">Inscription</Link></p>
        <Link href="/dashboard" className="text-brand text-sm">Retour au Dashboard</Link>
      </div>
    </main>
  )
}
