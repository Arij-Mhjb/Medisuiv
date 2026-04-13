"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { WelcomeCard } from "@/components/dashboard/welcome-card"
import { AlertTriangle, Bell, Activity, Server } from "lucide-react"
import Link from "next/link"

type Alerte = { id: number; type: string; message: string; niveau: string; patientId: string; dateCreation: string }
type Notification = { id: number; contenu: string; destinataire: string; statut: string; dateCreation: string }

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "À l'instant"
  if (mins < 60) return `Il y a ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `Il y a ${hrs}h`
  return `Il y a ${Math.floor(hrs / 24)}j`
}

export function MainDashboard() {
  const [alertes, setAlertes] = useState<Alerte[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [aRes, nRes] = await Promise.allSettled([
          axios.get<Alerte[]>("/api/alertes"),
          axios.get<Notification[]>("/api/notifications"),
        ])
        if (aRes.status === "fulfilled") setAlertes(aRes.value.data)
        if (nRes.status === "fulfilled") setNotifications(nRes.value.data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = [
    { title: "Alertes", value: String(alertes.length), icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10", href: "/messages" },
    { title: "Notifications", value: String(notifications.length), icon: Bell, color: "text-yellow-500", bg: "bg-yellow-500/10", href: "/statistics" },
    { title: "Services Actifs", value: "4", icon: Activity, color: "text-green-500", bg: "bg-green-500/10", href: "/devices" },
    { title: "Microservices", value: "4", icon: Server, color: "text-blue-500", bg: "bg-blue-500/10", href: "/devices" },
  ]

  const latestAlertes = [...alertes].sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()).slice(0, 5)
  const latestNotifications = [...notifications].sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()).slice(0, 5)

  return (
    <div className="space-y-5">
      <WelcomeCard />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.title} href={s.href}>
            <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border hover:ring-2 hover:ring-brand transition-all cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.title}</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{loading ? "…" : s.value}</p>
                </div>
                <div className={`rounded-xl ${s.bg} p-3`}>
                  <s.icon className={`size-6 ${s.color}`} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <h2 className="text-sm font-semibold text-foreground mb-4">Dernières Alertes</h2>
          {latestAlertes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune alerte.</p>
          ) : (
            <ul className="space-y-3">
              {latestAlertes.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-xl bg-background p-3 ring-1 ring-border">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    a.niveau === "CRITIQUE" ? "bg-red-100 text-red-700" :
                    a.niveau === "MOYEN" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>{a.niveau}</span>
                  <span className="flex-1 text-sm text-foreground truncate">Patient #{a.patientId} - {a.message}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{a.dateCreation ? timeAgo(a.dateCreation) : "—"}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
          <h2 className="text-sm font-semibold text-foreground mb-4">Dernières Notifications</h2>
          {latestNotifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune notification.</p>
          ) : (
            <ul className="space-y-3">
              {latestNotifications.map((n) => (
                <li key={n.id} className="flex items-center gap-3 rounded-xl bg-background p-3 ring-1 ring-border">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    n.statut === "lue" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{n.statut}</span>
                  <span className="flex-1 text-sm text-foreground truncate">{n.contenu}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{n.destinataire}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
        <h2 className="text-sm font-semibold text-foreground mb-4">État des Microservices</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { name: "Config Server", port: 8888 },
            { name: "Eureka Server", port: 8761 },
            { name: "API Gateway", port: 8080 },
            { name: "Alertes Service", port: 8084 },
          ].map((s) => (
            <div key={s.name} className="rounded-xl bg-background p-3 ring-1 ring-border">
              <p className="text-sm font-medium text-foreground">{s.name}</p>
              <p className="text-xs text-muted-foreground">Port: {s.port}</p>
              <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">UP</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
