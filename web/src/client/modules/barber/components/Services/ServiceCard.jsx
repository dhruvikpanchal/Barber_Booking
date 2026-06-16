import { Clock, DollarSign, Pencil, Trash2 } from "lucide-react";

import { formatMoney } from "@/client/lib/format/formatMoney.js";

export function ServiceCard({ service, onEdit, onDeleteRequest }) {
  return (
    <article
      className={`bg-surface-container-low rounded-xl border transition-opacity ${
        service.active ? "border-outline-variant" : "border-outline-variant/60 opacity-70"
      }`}
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-on-surface font-serif text-lg font-bold">{service.name}</h3>
            {!service.active ? (
              <span className="font-label-caps border-outline-variant text-on-surface-variant rounded-full border px-2 py-0.5 text-[10px]">
                Hidden
              </span>
            ) : null}
          </div>
          <p className="text-on-surface-variant mt-2 text-sm leading-relaxed">
            {service.description || "No description."}
          </p>
          <dl className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <dt className="sr-only">Price</dt>
              <dd className="text-primary inline-flex items-center gap-1.5 font-semibold">
                <DollarSign className="h-4 w-4" aria-hidden />
                {formatMoney(service.price)}
              </dd>
            </div>
            <div className="text-on-surface-variant flex items-center gap-2">
              <dt className="sr-only">Duration</dt>
              <dd className="inline-flex items-center gap-1.5">
                <Clock className="text-primary h-4 w-4" aria-hidden />
                {service.duration} min
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 gap-2 sm:flex-col">
          <button
            type="button"
            onClick={() => onEdit(service)}
            className="border-outline-variant text-on-surface hover:border-primary hover:text-primary inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border px-3 text-sm transition-colors sm:flex-none"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDeleteRequest(service)}
            className="border-outline-variant text-on-surface-variant hover:border-error hover:text-error inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border px-3 text-sm transition-colors sm:flex-none"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
