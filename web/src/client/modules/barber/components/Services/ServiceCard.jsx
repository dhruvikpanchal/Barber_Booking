import { Clock, DollarSign, Pencil, Trash2 } from "lucide-react";

import { formatMoney } from "@/client/lib/format/formatMoney.js";
export { formatMoney };

export function ServiceCard({ service, onEdit, onDeleteRequest }) {
  return (
    <article
      className={`rounded-xl border bg-surface-container-low transition-opacity ${
        service.active
          ? "border-outline-variant"
          : "border-outline-variant/60 opacity-70"
      }`}
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-lg font-bold text-on-surface">
              {service.name}
            </h3>
            {!service.active ? (
              <span className="font-label-caps rounded-full border border-outline-variant px-2 py-0.5 text-[10px] text-on-surface-variant">
                Hidden
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
            {service.description || "No description."}
          </p>
          <dl className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <dt className="sr-only">Price</dt>
              <dd className="inline-flex items-center gap-1.5 font-semibold text-primary">
                <DollarSign className="h-4 w-4" aria-hidden />
                {formatMoney(service.price)}
              </dd>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <dt className="sr-only">Duration</dt>
              <dd className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" aria-hidden />
                {service.duration} min
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 gap-2 sm:flex-col">
          <button
            type="button"
            onClick={() => onEdit(service)}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-outline-variant px-3 text-sm text-on-surface transition-colors hover:border-primary hover:text-primary sm:flex-none"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDeleteRequest(service)}
            className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-outline-variant px-3 text-sm text-on-surface-variant transition-colors hover:border-error hover:text-error sm:flex-none"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
