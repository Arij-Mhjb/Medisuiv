"use client"

import { Server, Activity, Wifi, Database } from "lucide-react"

type Service = {
  name: string
  port: number
  status: "UP" | "DOWN"
  description: string
  icon: React.ComponentType<{ className?: string }>
}

const services: Service[] = [
  { name: "Config Server", port: 8888, status: "UP", description: "Serveur de configuration centralisée", icon: Database },
  { name: "Eureka Server", port: 8761, status: "UP", description: "Service de découverte (Service Registry)", icon: Wifi },
  { name: "API Gateway", port: 8080, status: "UP", description: "Passerelle API principale", icon: Server },
  { name: "Alertes Service", port: 8084, status: "UP", description: "Microservice de gestion des alertes", icon: Activity },
]

export default function MicroservicesPage() {
  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      <h1 className="text-2xl font-semibold text-foreground">Microservices</h1>
      <p className="mt-2 text-muted-foreground">État des services en cours d&apos;exécution.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {services.map((s) => (
          <div key={s.name} className="rounded-xl bg-background p-5 ring-1 ring-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-brand/10 p-2.5">
                  <s.icon className="size-5 text-brand" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">Port: {s.port}</p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                s.status === "UP"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {s.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{s.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className={`size-2 rounded-full ${s.status === "UP" ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-xs text-muted-foreground">
                {s.status === "UP" ? "Service opérationnel" : "Service hors ligne"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
