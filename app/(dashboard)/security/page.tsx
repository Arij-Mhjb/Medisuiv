"use client"

import { Lock, Camera, Bell } from "lucide-react"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"

export default function SecurityPage() {
  const [doorLocked, setDoorLocked] = useState(true)
  const [camerasOn, setCamerasOn] = useState(true)
  const [alarmArmed, setAlarmArmed] = useState(false)

  const events = [
    { id: 1, time: "08:32", text: "Accès principal verrouillé" },
    { id: 2, time: "07:15", text: "Caméra arrière - mouvement détecté" },
    { id: 3, time: "Hier", text: "Alarme désactivée par Admin" },
  ]

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      <h1 className="text-balance text-2xl font-semibold text-foreground">Sécurité</h1>
      <p className="mt-2 text-muted-foreground">Gestion de la sécurité et des accès.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="size-5 text-primary" />
              <h3 className="font-medium text-foreground">Verrouillage</h3>
            </div>
            <Switch checked={doorLocked} onCheckedChange={setDoorLocked} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {doorLocked ? "Accès verrouillé." : "Accès déverrouillé."}
          </p>
        </div>

        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="size-5 text-primary" />
              <h3 className="font-medium text-foreground">Caméras</h3>
            </div>
            <Switch checked={camerasOn} onCheckedChange={setCamerasOn} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {camerasOn ? "Surveillance active." : "Surveillance en pause."}
          </p>
        </div>

        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="size-5 text-primary" />
              <h3 className="font-medium text-foreground">Alarme</h3>
            </div>
            <Switch checked={alarmArmed} onCheckedChange={setAlarmArmed} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{alarmArmed ? "Système armé." : "Système désarmé."}</p>
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-background p-4 ring-1 ring-border">
        <h3 className="mb-3 font-medium text-foreground">Activité récente</h3>
        <ul className="space-y-2">
          {events.map((e) => (
            <li key={e.id} className="flex items-center justify-between text-sm">
              <span className="text-foreground">{e.text}</span>
              <span className="text-muted-foreground">{e.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
