"use client";

import { Check, CheckCheck, Trash2, ArrowRight } from "lucide-react";
import { TYPE_META } from "../../../../constants/barber/notifications.js";
import { Avatar, StarRow } from "./helpers.jsx";
import { useState } from "react";

export default function ReviewCard({ notif, onRead, onDelete }) {
  const meta = TYPE_META.review;
  const Icon = meta.icon;
  const [replied, setReplied] = useState(false);
  const [reply, setReply] = useState("");
  const [showReply, setShowReply] = useState(false);

  return (
    <div
      className={`group relative rounded-lg border transition-all duration-200
        ${
          notif.read
            ? "border-outline-variant bg-surface-container-low"
            : `border-l-2 ${meta.border} bg-surface-container`
        } ${notif.attention ? "ring-1 ring-status-pending/20" : ""}`}
    >
      {!notif.read && (
        <div
          className={`absolute top-4 right-4 w-2 h-2 rounded-full ${meta.dot}`}
        />
      )}
      {notif.attention && (
        <div className="absolute top-4 right-8 text-[10px] text-status-pending font-semibold tracking-wide">
          NEEDS RESPONSE
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-8 h-8 rounded-md ${meta.bg} border ${meta.border} flex items-center justify-center shrink-0`}
          >
            <Icon className={`w-4 h-4 ${meta.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-[10px] font-semibold tracking-widest ${meta.color}`}
              >
                REVIEW ALERT
              </span>
              <span className="text-[10px] text-on-surface-variant">
                {notif.time}
              </span>
            </div>
            <p className="text-sm text-on-surface font-medium mt-0.5 pr-6">
              {notif.message}
            </p>
          </div>
        </div>

        {/* Review block */}
        <div className="mt-3 ml-11 rounded-md border border-outline-variant bg-surface-container-lowest p-3">
          <div className="flex items-center gap-2 mb-2">
            <Avatar initials={notif.avatar} size="sm" />
            <div>
              <p className="text-sm font-semibold text-on-surface">
                {notif.client}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <StarRow rating={notif.rating} />
                <span className="text-[10px] text-on-surface-variant">
                  {notif.service}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-on-surface-variant italic leading-relaxed border-l-2 border-primary/30 pl-3 mt-2">
            "{notif.review}"
          </p>

          {/* Reply */}
          {!replied && (
            <div className="mt-3">
              {!showReply ? (
                <button
                  onClick={() => setShowReply(true)}
                  className="text-xs text-primary hover:opacity-70 transition font-medium flex items-center gap-1"
                >
                  <ArrowRight className="w-3 h-3" /> Reply to review
                </button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    rows={2}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Thank you for your feedback…"
                    className="w-full rounded border border-outline-variant bg-surface-container px-3 py-2 text-xs text-on-surface
                        placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (reply.trim()) setReplied(true);
                      }}
                      disabled={!reply.trim()}
                      className="rounded bg-primary px-3 py-1.5 text-[11px] font-semibold text-on-primary
                          hover:opacity-90 active:scale-95 transition disabled:opacity-30"
                    >
                      Post Reply
                    </button>
                    <button
                      onClick={() => {
                        setShowReply(false);
                        setReply("");
                      }}
                      className="text-[11px] text-on-surface-variant hover:text-on-surface transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {replied && (
            <div className="mt-2 flex items-center gap-1.5 text-status-confirmed text-xs">
              <Check className="w-3.5 h-3.5" /> Reply posted
            </div>
          )}
        </div>

        <div className="mt-3 ml-11 flex justify-end">
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!notif.read && (
              <button
                onClick={() => onRead(notif.id)}
                className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onDelete(notif.id)}
              className="p-1.5 rounded text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
