"use client"

import Link from "next/link"
import { useState } from "react"

export default function SignUpPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    window.location.href = "/dashboard"
  }

  return (
    <main className="min-h-[80dvh] flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 ring-1 ring-border">
        <h1 className="text-2xl font-semibold text-foreground mb-2 text-balance">Inscription</h1>
        <p className="text-sm text-muted-foreground mb-6">Rejoignez MediSuiv pour le suivi medical.</p>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input required type="text" placeholder="Nom complet" value={name} onChange={(e) => setName(e.target.value)} className="h-10 rounded-md bg-background ring-1 ring-border px-3 text-sm outline-none" />
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 rounded-md bg-background ring-1 ring-border px-3 text-sm outline-none" />
          <input required type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="h-10 rounded-md bg-background ring-1 ring-border px-3 text-sm outline-none" />
          <button type="submit" className="w-full h-10 rounded-md bg-brand text-background font-medium">S'inscrire</button>
        </form>
        <p className="mt-4 mb-2 text-sm text-muted-foreground">Deja un compte ? <Link href="/signin" className="text-brand">Connexion</Link></p>
        <Link href="/dashboard" className="text-brand text-sm">Retour au Dashboard</Link>
      </div>
    </main>
  )
}
