import { CONTACT_MESSAGE_CARDS } from "@/modules/admin/constants/admin.js";

export default function MessageStats({ stats }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {CONTACT_MESSAGE_CARDS.map(({ key, label, icon: Icon, accent, bg }) => (
        <div
          key={key}
          className="border-outline-variant bg-surface-container-low flex items-center gap-4 rounded-xl border px-5 py-4"
        >
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${bg} ${accent}`}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="font-label-caps text-on-surface-variant">{label}</p>
            <p className="text-on-surface font-serif text-2xl font-bold">{stats[key] ?? 0}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
