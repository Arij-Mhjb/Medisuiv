import { Activity } from "lucide-react"

export function WelcomeCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-sidebar-gradient p-6 text-white">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl md:w-3/5">
          <h1 className="text-balance text-3xl font-semibold">Bienvenue sur MediSuiv</h1>
          <p className="mt-2 text-sm leading-6 text-white/90">
            Plateforme de suivi médical intelligent. Gérez vos alertes, notifications et microservices en temps réel.
          </p>
          <div className="mt-4 flex items-center gap-4 rounded-2xl bg-white/10 px-4 py-3 text-sm">
            <Activity className="size-8" />
            <div>
              <div className="font-medium">Système opérationnel</div>
              <div className="text-white/80">Tous les services sont actifs</div>
            </div>
          </div>
        </div>

        <div className="relative lg:w-2/5 flex items-center justify-center">
          <div className="text-center">
            <Activity className="size-24 mx-auto opacity-20" />
            <p className="mt-2 text-white/60 text-sm">Suivi en temps réel</p>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
    </section>
  )
}
