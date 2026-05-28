"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Mail,
  Reply,
  Trash2,
  User,
  X,
  CheckCircle,
  Eye,
  EyeOff
} from "lucide-react";

export default function MessageDetailDrawer({
  message,
  onClose,
  onToggleRead,
  onReply,
  onDelete,
}) {
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    setReplyText("");
  }, [message]);

  if (!message) return null;

  const submitted = new Date(message.submittedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    onReply(message.id, replyText);
    setReplyText("");
    setSending(false);
  };

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
            <p className="font-label-caps text-primary">Contact Message</p>
            <p className="text-xs text-on-surface-variant">#{message.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleRead(message.id)}
              title={message.isRead ? "Mark unread" : "Mark read"}
              className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              {message.isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => onDelete(message.id)}
              title="Delete message"
              className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-status-cancelled transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="space-y-6 p-5">
          <div className="space-y-2">
            <div className="flex flex-col gap-1">
              <h2 className="font-serif text-xl font-bold text-on-surface leading-tight">
                {message.subject}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  message.isRead 
                    ? "bg-zinc-500/15 text-zinc-400 border border-zinc-500/25" 
                    : "bg-status-pending/15 text-status-pending border border-status-pending/25"
                }`}>
                  {message.isRead ? "Read" : "Unread"}
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  message.replyStatus === "replied"
                    ? "bg-status-confirmed/15 text-status-confirmed border border-status-confirmed/25"
                    : "bg-status-cancelled/15 text-status-cancelled border border-status-cancelled/25"
                }`}>
                  {message.replyStatus === "replied" ? "Replied" : "Unreplied"}
                </span>
              </div>
            </div>
          </div>

          <section className="rounded-lg border border-outline-variant bg-surface-container p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-container text-on-surface-variant">
                <User className="h-4 w-4" />
              </span>
              <div>
                <p className="font-label-caps text-on-surface-variant">Sender</p>
                <p className="text-sm font-medium text-on-surface">{message.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-outline-variant/60 pt-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-container text-on-surface-variant">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <p className="font-label-caps text-on-surface-variant">Email</p>
                <a href={`mailto:${message.email}`} className="text-sm text-primary hover:underline font-medium break-all">
                  {message.email}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3 border-t border-outline-variant/60 pt-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-container text-on-surface-variant">
                <Calendar className="h-4 w-4" />
              </span>
              <div>
                <p className="font-label-caps text-on-surface-variant">Received At</p>
                <p className="text-sm text-on-surface">{submitted}</p>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <p className="font-label-caps text-on-surface-variant">Message</p>
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-4 text-sm leading-relaxed text-on-surface whitespace-pre-line">
              {message.message}
            </div>
          </section>

          {message.replyStatus === "replied" && message.replyText && (
            <section className="space-y-2">
              <p className="font-label-caps text-status-confirmed flex items-center gap-1.5 font-semibold">
                <CheckCircle className="h-4 w-4" />
                Reply History
              </p>
              <div className="rounded-lg border border-status-confirmed/25 bg-status-confirmed/5 p-4 text-sm leading-relaxed text-on-surface whitespace-pre-line">
                {message.replyText}
              </div>
            </section>
          )}

          {message.replyStatus === "unreplied" && (
            <section className="border-t border-outline-variant pt-4 space-y-3">
              <p className="font-label-caps text-on-surface-variant flex items-center gap-1.5">
                <Reply className="h-4 w-4 text-primary" />
                Send Reply
              </p>
              <form onSubmit={handleSendReply} className="space-y-3">
                <textarea
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Write your response to ${message.name}...`}
                  rows={5}
                  className="w-full resize-y rounded-md border border-outline-variant bg-surface-container px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:outline-none focus:bg-surface-container-high transition-colors"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-xs font-semibold tracking-wide text-on-primary hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                        SENDING...
                      </>
                    ) : (
                      <>
                        <Reply className="h-3.5 w-3.5" />
                        SEND REPLY
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}
