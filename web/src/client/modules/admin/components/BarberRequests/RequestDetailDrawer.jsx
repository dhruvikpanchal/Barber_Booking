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
import Drawer from "@/client/modules/shared/components/ui/Drawer";
import StatusBadge from "@/client/modules/shared/components/ui/StatusBadge";
import { BARBER_REQUEST_STATUSES } from "@/client/modules/admin/constants/adminConstants.js";
import { EXPERIENCE_LABELS } from "@/client/modules/admin/constants/barberRequestsConstants.js";

function InfoRow({ Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="border-outline-variant/60 flex items-start gap-3 border-b py-3 last:border-b-0">
      <span className="bg-surface-container text-on-surface-variant mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-label-caps text-on-surface-variant">{label}</p>
        <p className="text-on-surface text-sm">{value}</p>
      </div>
    </div>
  );
}

export default function RequestDetailDrawer({ request, onClose, onApprove, onReject }) {
  if (!request) return null;

  const submitted = new Date(request.submittedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Drawer
      open
      onClose={onClose}
      panelClassName="scrollbar-thin border-outline-variant bg-surface-container-low w-full max-w-lg overflow-y-auto"
    >
      <header className="border-outline-variant bg-surface-container-low/95 sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur">
        <div>
          <p className="font-label-caps text-primary">Barber request</p>
          <p className="text-on-surface-variant text-xs">#{request.id}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface flex h-9 w-9 items-center justify-center rounded-md"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </header>

      <div className="space-y-6 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-on-surface font-serif text-2xl font-bold">{request.shopName}</h2>
            <StatusBadge status={request.status} config={BARBER_REQUEST_STATUSES} />
          </div>
          <p className="text-on-surface-variant text-sm">Submitted {submitted}</p>
        </div>

        <section className="border-outline-variant bg-surface-container rounded-lg border p-4">
          <InfoRow Icon={User} label="Owner" value={request.ownerName} />
          <InfoRow Icon={Building2} label="Shop" value={request.shopName} />
          <InfoRow Icon={MapPin} label="City" value={request.city} />
          <InfoRow
            Icon={Briefcase}
            label="Experience"
            value={EXPERIENCE_LABELS[request.experience] ?? request.experience}
          />
          <InfoRow Icon={Mail} label="Email" value={request.email} />
          <InfoRow Icon={Phone} label="Phone" value={request.phone} />
        </section>

        {request.bio && (
          <section>
            <p className="font-label-caps text-on-surface-variant mb-2">Bio</p>
            <p className="text-on-surface text-sm leading-relaxed">{request.bio}</p>
          </section>
        )}

        {request.specialties?.length > 0 && (
          <section>
            <p className="font-label-caps text-on-surface-variant mb-2">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {request.specialties.map((s) => (
                <span
                  key={s}
                  className="border-outline-variant bg-surface-container text-on-surface inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs"
                >
                  <Scissors className="text-primary h-3 w-3" aria-hidden />
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
            className="text-primary inline-flex items-center gap-2 text-sm font-medium hover:underline"
          >
            View portfolio
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        )}

        <section>
          <p className="font-label-caps text-on-surface-variant mb-3">
            Uploaded documents ({request.documents.length})
          </p>
          <ul className="space-y-2">
            {request.documents.map((doc) => (
              <li
                key={doc.id}
                className="border-outline-variant bg-surface-container flex items-center gap-3 rounded-md border px-3 py-2.5"
              >
                <span className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
                  <FileText className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-on-surface truncate text-sm font-medium">{doc.label}</p>
                  <p className="text-on-surface-variant truncate text-xs">{doc.fileName}</p>
                </div>
                <button
                  type="button"
                  className="text-primary shrink-0 text-xs font-semibold tracking-wide hover:underline"
                >
                  Preview
                </button>
              </li>
            ))}
          </ul>
        </section>

        {request.status === "rejected" && request.rejectionNote && (
          <div className="border-status-cancelled/30 bg-status-cancelled/10 text-on-surface rounded-md border px-4 py-3 text-sm">
            <p className="font-label-caps text-status-cancelled mb-1">Rejection note</p>
            {request.rejectionNote}
          </div>
        )}

        {request.status === "pending" && (
          <div className="border-outline-variant flex flex-col gap-2 border-t pt-4 sm:flex-row">
            <button
              type="button"
              onClick={() => onApprove(request.id)}
              className="bg-primary text-on-primary flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-xs font-semibold tracking-wide hover:opacity-90"
            >
              Approve application
            </button>
            <button
              type="button"
              onClick={() => onReject(request)}
              className="border-outline-variant text-on-surface-variant hover:border-status-cancelled/50 hover:text-status-cancelled flex flex-1 items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-xs font-semibold tracking-wide"
            >
              Reject application
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
}
