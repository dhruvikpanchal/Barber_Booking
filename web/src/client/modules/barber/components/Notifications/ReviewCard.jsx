"use client";

import { Check, CheckCheck, Trash2, ArrowRight } from "lucide-react";
import { TYPE_META } from "../../constants/notifications.js";
import { InitialsAvatar } from "@/client/modules/shared/components/ui/InitialsAvatar.jsx";
import { StarRow } from "@/client/modules/shared/components/ui/StarRow.jsx";
import { useState } from "react";

export default function ReviewCard({ notif, onRead, onDelete }) {
  const meta = TYPE_META.review;
  const Icon = meta.icon;
  const [replied, setReplied] = useState(false);
  const [reply, setReply] = useState("");
  const [showReply, setShowReply] = useState(false);

  return (
    <div
      className={`group relative rounded-lg border transition-all duration-200 ${
        notif.read
          ? "border-outline-variant bg-surface-container-low"
          : `border-l-2 ${meta.border} bg-surface-container`
      } ${notif.attention ? "ring-status-pending/20 ring-1" : ""}`}
    >
      {!notif.read && <div className={`absolute top-4 right-4 h-2 w-2 rounded-full ${meta.dot}`} />}
      {notif.attention && (
        <div className="text-status-pending absolute top-4 right-8 text-[10px] font-semibold tracking-wide">
          NEEDS RESPONSE
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`h-8 w-8 rounded-md ${meta.bg} border ${meta.border} flex shrink-0 items-center justify-center`}
          >
            <Icon className={`h-4 w-4 ${meta.color}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-semibold tracking-widest ${meta.color}`}>
                REVIEW ALERT
              </span>
              <span className="text-on-surface-variant text-[10px]">{notif.time}</span>
            </div>
            <p className="text-on-surface mt-0.5 pr-6 text-sm font-medium">{notif.message}</p>
          </div>
        </div>

        {/* Review block */}
        <div className="border-outline-variant bg-surface-container-lowest mt-3 ml-11 rounded-md border p-3">
          <div className="mb-2 flex items-center gap-2">
            <InitialsAvatar initials={notif.avatar} size="sm" />
            <div>
              <p className="text-on-surface text-sm font-semibold">{notif.client}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                <StarRow rating={notif.rating} variant="yellow" />
                <span className="text-on-surface-variant text-[10px]">{notif.service}</span>
              </div>
            </div>
          </div>
          <p className="text-on-surface-variant border-primary/30 mt-2 border-l-2 pl-3 text-xs leading-relaxed italic">
            "{notif.review}"
          </p>

          {/* Reply */}
          {!replied && (
            <div className="mt-3">
              {!showReply ? (
                <button
                  onClick={() => setShowReply(true)}
                  className="text-primary flex items-center gap-1 text-xs font-medium transition hover:opacity-70"
                >
                  <ArrowRight className="h-3 w-3" /> Reply to review
                </button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Thank you for your feedback…"
                    className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary w-full resize-none rounded border px-3 py-2 text-xs focus:outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (reply.trim()) setReplied(true);
                      }}
                      disabled={!reply.trim()}
                      className="bg-primary text-on-primary rounded px-3 py-1.5 text-[11px] font-semibold transition hover:opacity-90 active:scale-95 disabled:opacity-30"
                    >
                      Post Reply
                    </button>
                    <button
                      onClick={() => {
                        setShowReply(false);
                        setReply("");
                      }}
                      className="text-on-surface-variant hover:text-on-surface text-[11px] transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {replied && (
            <div className="text-status-confirmed mt-2 flex items-center gap-1.5 text-xs">
              <Check className="h-3.5 w-3.5" /> Reply posted
            </div>
          )}
        </div>

        <div className="mt-3 ml-11 flex justify-end">
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            {!notif.read && (
              <button
                onClick={() => onRead(notif.id)}
                className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded p-1.5 transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              onClick={() => onDelete(notif.id)}
              className="text-on-surface-variant hover:text-error hover:bg-surface-container-high rounded p-1.5 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
