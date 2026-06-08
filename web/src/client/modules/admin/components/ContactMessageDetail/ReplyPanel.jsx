"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import {
  Panel,
} from "./Primitives.jsx";

const REPLY_CHAR_LIMIT = 2000;

export function ReplyPanel({ message, onSend, disabled }) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setBody("");
    setSent(false);
  }, [message.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    const text = body.trim();
    if (!text || sending || disabled) return;

    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    onSend(text);
    setBody("");
    setSent(true);
    setSending(false);
    window.setTimeout(() => setSent(false), 2000);
  }

  return (
    <Panel title="Reply" icon={Send}>
      {disabled ? (
        <p className="text-sm text-on-surface-variant">
          This thread is closed. Reopen the workflow to send another reply.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block">
            <span className="sr-only">Reply to {message.name}</span>
            <textarea
              value={body}
              onChange={(e) =>
                setBody(e.target.value.slice(0, REPLY_CHAR_LIMIT))
              }
              rows={4}
              required
              placeholder={`Write your reply to ${message.name}…`}
              className="w-full resize-y rounded-lg border border-outline-variant bg-surface-container px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
            />
          </label>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-on-surface-variant">
              {body.length}/{REPLY_CHAR_LIMIT}
            </span>
            <button
              type="submit"
              disabled={sending || !body.trim()}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary text-sm font-bold text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-6"
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
