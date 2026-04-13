"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const API = "/api/alertes"

type Alerte = {
  id: number
  type: string
  message: string
  niveau: string
  patientId: string
  dateCreation: string
}

const EMPTY: Omit<Alerte, "id" | "dateCreation"> = { type: "", message: "", niveau: "FAIBLE", patientId: "" }

export default function AlertesPage() {
  const [alertes, setAlertes] = useState<Alerte[]>([])
  const [form, setForm] = useState(EMPTY)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    setLoading(true)
    setError("")
    try {
      const { data } = await axios.get<Alerte[]>(API)
      setAlertes(data)
    } catch {
      setError("Impossible de charger les alertes.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      if (editingId !== null) {
        await axios.put(`${API}/${editingId}`, form)
        setEditingId(null)
      } else {
        await axios.post(API, form)
      }
      setForm(EMPTY)
      setShowForm(false)
      load()
    } catch {
      setError(editingId !== null ? "Erreur lors de la modification." : "Erreur lors de la création.")
    }
  }

  function startEdit(a: Alerte) {
    setForm({ type: a.type, message: a.message, niveau: a.niveau, patientId: a.patientId })
    setEditingId(a.id)
    setShowForm(true)
  }

  function cancelForm() {
    setForm(EMPTY)
    setEditingId(null)
    setShowForm(false)
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Alertes</h1>
          <p className="mt-1 text-muted-foreground">Gestion des alertes médicales.</p>
        </div>
        <button
          onClick={() => { if (showForm) cancelForm(); else setShowForm(true); }}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
        >
          {showForm ? "Annuler" : "+ Nouvelle Alerte"}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 grid gap-3 rounded-xl bg-background p-4 ring-1 ring-border sm:grid-cols-2 lg:grid-cols-4">
          <input
            required
            placeholder="Type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="h-10 rounded-md bg-card ring-1 ring-border px-3 text-sm outline-none"
          />
          <input
            required
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="h-10 rounded-md bg-card ring-1 ring-border px-3 text-sm outline-none"
          />
          <select
            value={form.niveau}
            onChange={(e) => setForm({ ...form, niveau: e.target.value })}
            className="h-10 rounded-md bg-card ring-1 ring-border px-3 text-sm outline-none"
          >
            <option value="FAIBLE">FAIBLE</option>
            <option value="MOYEN">MOYEN</option>
            <option value="CRITIQUE">CRITIQUE</option>
          </select>
          <div className="flex gap-2">
            <input
              required
              placeholder="Patient ID"
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              className="h-10 flex-1 rounded-md bg-card ring-1 ring-border px-3 text-sm outline-none"
            />
            <button type="submit" className="h-10 rounded-md bg-brand px-4 text-sm font-medium text-white hover:opacity-90">
              {editingId !== null ? "Modifier" : "Créer"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-muted-foreground">Chargement...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-3 pr-4">ID</th>
                <th className="pb-3 pr-4">Type</th>
                <th className="pb-3 pr-4">Message</th>
                <th className="pb-3 pr-4">Niveau</th>
                <th className="pb-3 pr-4">Patient ID</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alertes.map((a) => (
                <tr key={a.id} className="border-b border-border">
                  <td className="py-3 pr-4 text-foreground">{a.id}</td>
                  <td className="py-3 pr-4 text-foreground">{a.type}</td>
                  <td className="py-3 pr-4 text-foreground">{a.message}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      a.niveau === "CRITIQUE" ? "bg-red-100 text-red-700" :
                      a.niveau === "MOYEN" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>{a.niveau}</span>
                  </td>
                  <td className="py-3 pr-4 text-foreground">{a.patientId}</td>
                  <td className="py-3 pr-4 text-muted-foreground">{a.dateCreation ? new Date(a.dateCreation).toLocaleString("fr-FR") : "—"}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(a)}
                        className="rounded-md bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-500/20 transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="rounded-md bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-500/20 transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {alertes.length === 0 && (
                <tr><td colSpan={7} className="py-6 text-center text-muted-foreground">Aucune alerte trouvée.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
