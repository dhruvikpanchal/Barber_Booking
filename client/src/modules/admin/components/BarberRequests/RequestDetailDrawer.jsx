"use client";

import {
  Briefcase,
  Building2,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Phone,
  Scissors,
  User,
  X,
} from "lucide-react";
import StatusBadge from "./StatusBadge.jsx";
import { EXPERIENCE_LABELS } from "../../../../data/admin/barberRequestsData.js";

function InfoRow({ Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 border-b border-outline-variant/60 py-3 last:border-b-0">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-container text-on-surface-variant">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-label-caps text-on-surface-variant">{label}</p>
        <p className="text-sm text-on-surface">{value}</p>
      </div>
    </div>
  );
}

export default function RequestDetailDrawer({
  request,
  onClose,
  onApprove,
  onReject,
}) {
  if (!request) return null;

  const submitted = new Date(request.submittedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60"
      onClick={onClose}
    >
      <aside
        className="scrollbar-thin h-full w-full max-w-lg overflow-y-auto border-l border-outline-variant bg-surface-container-low shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-outline-variant bg-surface-container-low/95 px-5 py-4 backdrop-blur">
          <div>
            <p className="font-label-caps text-primary">Barber request</p>
            <p className="text-xs text-on-surface-variant">#{request.id}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="space-y-6 p-5">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-serif text-2xl font-bold text-on-surface">
                {request.shopName}
              </h2>
              <StatusBadge status={request.status} />
            </div>
            <p className="text-sm text-on-surface-variant">
              Submitted {submitted}
            </p>
          </div>

          <section className="rounded-lg border border-outline-variant bg-surface-container p-4">
            <InfoRow Icon={User} label="Owner" value={request.ownerName} />
            <InfoRow Icon={Building2} label="Shop" value={request.shopName} />
            <InfoRow Icon={MapPin} label="City" value={request.city} />
            <InfoRow
              Icon={Briefcase}
              label="Experience"
              value={
                EXPERIENCE_LABELS[request.experience] ?? request.experience
              }
            />
            <InfoRow Icon={Mail} label="Email" value={request.email} />
            <InfoRow Icon={Phone} label="Phone" value={request.phone} />
          </section>

          {request.bio && (
            <section>
              <p className="font-label-caps mb-2 text-on-surface-variant">
                Bio
              </p>
              <p className="text-sm leading-relaxed text-on-surface">
                {request.bio}
              </p>
            </section>
          )}

          {request.specialties?.length > 0 && (
            <section>
              <p className="font-label-caps mb-2 text-on-surface-variant">
                Specialties
              </p>
              <div className="flex flex-wrap gap-2">
                {request.specialties.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 rounded-md border border-outline-variant bg-surface-container px-2.5 py-1 text-xs text-on-surface"
                  >
                    <Scissors className="h-3 w-3 text-primary" aria-hidden />
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}

          {request.portfolio && (
            <a
              href={request.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              View portfolio
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          )}

          <section>
            <p className="font-label-caps mb-3 text-on-surface-variant">
              Uploaded documents ({request.documents.length})
            </p>
            <ul className="space-y-2">
              {request.documents.map((doc) => (
                <li
                  key={doc.id}
                  className="flex items-center gap-3 rounded-md border border-outline-variant bg-surface-container px-3 py-2.5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-on-surface">
                      {doc.label}
                    </p>
                    <p className="truncate text-xs text-on-surface-variant">
                      {doc.fileName}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 text-xs font-semibold tracking-wide text-primary hover:underline"
                  >
                    Preview
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {request.status === "rejected" && request.rejectionNote && (
            <div className="rounded-md border border-status-cancelled/30 bg-status-cancelled/10 px-4 py-3 text-sm text-on-surface">
              <p className="font-label-caps mb-1 text-status-cancelled">
                Rejection note
              </p>
              {request.rejectionNote}
            </div>
          )}

          {request.status === "pending" && (
            <div className="flex flex-col gap-2 border-t border-outline-variant pt-4 sm:flex-row">
              <button
                type="button"
                onClick={() => onApprove(request.id)}
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold tracking-wide text-on-primary hover:opacity-90"
              >
                Approve application
              </button>
              <button
                type="button"
                onClick={() => onReject(request)}
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-outline-variant px-4 py-2.5 text-xs font-semibold tracking-wide text-on-surface-variant hover:border-status-cancelled/50 hover:text-status-cancelled"
              >
                Reject application
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
