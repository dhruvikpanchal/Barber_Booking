"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { Panel } from "./Primitives.jsx";

const REPLY_CHAR_LIMIT = 2000;

export function ReplyPanel({ message, onSend, disabled, sending = false }) {
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setBody("");
    setSent(false);
  }, [message.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    const text = body.trim();
    if (!text || sending || disabled) return;

    await onSend(text);
    setBody("");
    setSent(true);
    window.setTimeout(() => setSent(false), 2000);
  }

  const inputsDisabled = disabled || sending;

  return (
    <Panel title="Reply" icon={Send}>
      {disabled && !sending ? (
        <p className="text-on-surface-variant text-sm">
          This thread is closed. Reopen the workflow to send another reply.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="sr-only">Reply to {message.name}</span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, REPLY_CHAR_LIMIT))}
              rows={4}
              required
              disabled={inputsDisabled}
              placeholder={`Write your reply to ${message.name}…`}
              className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary w-full resize-y rounded-lg border px-3 py-2.5 text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-on-surface-variant text-xs">
              {body.length}/{REPLY_CHAR_LIMIT}
            </span>
            <button
              type="submit"
              disabled={inputsDisabled || !body.trim()}
              className="bg-primary text-on-primary inline-flex h-10 w-full items-center justify-center gap-2 rounded-md text-sm font-bold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-6"
            >
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Sending…
                </>
              ) : sent ? (
                <>
                  <CheckCircle2 className="h-4 w-4" aria-hidden />
                  Sent
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden />
                  Send reply
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Panel>
  );
}
