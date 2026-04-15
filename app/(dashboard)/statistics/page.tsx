"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Info } from "lucide-react"

const API = "/api/notifications"

type Notification = {
  id: number
  contenu: string
  destinataire: string
  statut: string
  dateCreation: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    setLoading(true)
    setError("")
    try {
      const { data } = await axios.get<Notification[]>(API)
      setNotifications(data)
    } catch {
      setError("Impossible de charger les notifications.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleMarkAsRead(id: number) {
    try {
      await axios.put(`${API}/${id}`, { statut: "lue" })
      load()
    } catch {
      setError("Erreur lors de la mise à jour.")
    }
  }

  async function handleDelete(id: number) {
    try {
      await axios.delete(`${API}/${id}`)
      load()
    } catch {
      setError("Erreur lors de la suppression.")
    }
  }

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
        <p className="mt-1 text-muted-foreground">Gestion des notifications médicales.</p>
      </div>

      <div className="mb-5 flex items-center gap-2 rounded-xl bg-blue-50 p-3 ring-1 ring-blue-200">
        <Info className="size-4 text-blue-600 shrink-0" />
        <p className="text-sm text-blue-700">Les notifications sont créées automatiquement lors de la création d&apos;une alerte.</p>
      </div>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Contenu</th>
                <th className="pb-3 pr-4">Destinataire</th>
                <th className="pb-3 pr-4">Statut</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr key={n.id} className="border-b border-border">
                  <td className="py-3 pr-4 text-foreground">{n.id}</td>
                  <td className="py-3 pr-4 text-foreground">{n.contenu}</td>
                  <td className="py-3 pr-4 text-foreground">{n.destinataire}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      n.statut === "lue" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>{n.statut}</span>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{n.dateCreation ? new Date(n.dateCreation).toLocaleString("fr-FR") : "—"}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      {n.statut !== "lue" && (
                        <button
                          onClick={() => handleMarkAsRead(n.id)}
                          className="rounded-md bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 hover:bg-green-500/20 transition"
                        >
                          Marquer comme lue
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="rounded-md bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-500/20 transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {notifications.length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Aucune notification trouvée.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
