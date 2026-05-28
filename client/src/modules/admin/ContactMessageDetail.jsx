"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MailOpen, Trash2 } from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import {
  statusEntry,
  WorkflowBadge,
  ReadBadge,
  Breadcrumb,
  SenderPanel,
  StatusPanel,
  ThreadPanel,
} from "./components/ContactMessageDetail/Primitives.jsx";
import { DeleteConfirmBanner } from "./components/ContactMessageDetail/DeleteConfirmBanner.jsx";
import { ReplyPanel } from "./components/ContactMessageDetail/ReplyPanel.jsx";

/**
 * @param {{ message: NonNullable<ReturnType<typeof import('@/data/admin/contactMessagesData.js').getContactMessageById>> }} props
 */
export default function ContactMessageDetail({ message: initialMessage }) {
  const [message, setMessage] = useState(initialMessage);
  const [showDelete, setShowDelete] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    setMessage(initialMessage);
    setRemoved(false);
    setShowDelete(false);
  }, [initialMessage]);

  function handleStatusChange(next) {
    setMessage((prev) => ({
      ...prev,
      status: next,
      thread: [...prev.thread, statusEntry(prev.id, next)],
    }));
  }

  function handleToggleRead() {
    setMessage((prev) => ({ ...prev, isRead: !prev.isRead }));
  }

  function handleSendReply(text) {
    const now = new Date().toISOString();
    setMessage((prev) => ({
      ...prev,
      isRead: true,
      replyStatus: "replied",
      replyText: text,
      status: "replied",
      thread: [
        ...prev.thread,
        {
          id: `${prev.id}-reply-${Date.now()}`,
          type: "reply",
          author: "Admin",
          authorRole: "admin",
          content: text,
          timestamp: now,
        },
        statusEntry(prev.id, "replied"),
      ],
    }));
  }

  function handleDelete() {
    setRemoved(true);
    setShowDelete(false);
  }

  if (removed) {
    return (
      <div className="mx-auto max-w-3xl py-8 text-center">
        <Trash2
          className="mx-auto h-10 w-10 text-on-surface-variant/30"
          aria-hidden
        />
        <p className="mt-4 font-serif text-lg font-bold text-on-surface">
          Message deleted
        </p>
        <p className="mt-1.5 text-sm text-on-surface-variant">
          This inquiry was removed from the queue.
        </p>
        <Link
          href={routes.admin.contactMessages}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-bold text-on-primary hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to messages
        </Link>
      </div>
    );
  }

  const replyLocked = message.status === "closed";

  return (
    <div className="mx-auto min-w-0 max-w-5xl space-y-5 pb-4 sm:space-y-6">
      <Breadcrumb messageId={message.id} />

      {showDelete ? (
        <DeleteConfirmBanner
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      ) : null}

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Link
              href={routes.admin.contactMessages}
              className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-outline-variant bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
              aria-label="Back to contact messages"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </Link>
            <div className="min-w-0">
              <p className="font-label-caps text-[11px] text-primary">
                Contact message
                <span className="hidden sm:inline"> · {message.id}</span>
              </p>
              <h1 className="mt-1 font-serif text-xl font-bold leading-snug text-on-surface sm:text-2xl">
                {message.subject}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <WorkflowBadge status={message.status} />
                <ReadBadge isRead={message.isRead} />
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                    message.replyStatus === "replied"
                      ? "border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed"
                      : "border-status-cancelled/30 bg-status-cancelled/10 text-status-cancelled"
                  }`}
                >
                  {message.replyStatus === "replied"
                    ? "Replied"
                    : "Needs reply"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              onClick={handleToggleRead}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-outline-variant bg-surface-container px-3 text-xs font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface sm:flex-none"
            >
              {message.isRead ? (
                <>
                  <MailOpen className="h-3.5 w-3.5" aria-hidden />
                  Mark unread
                </>
              ) : (
                <>
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  Mark read
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowDelete(true)}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border border-outline-variant bg-surface-container px-3 text-xs font-semibold text-on-surface-variant transition-colors hover:border-status-cancelled/40 hover:bg-status-cancelled/8 hover:text-status-cancelled sm:flex-none"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              Delete
            </button>
          </div>
        </div>

        {!message.isRead && (
          <div className="flex flex-col gap-2 rounded-lg border border-status-pending/30 bg-status-pending/8 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium text-status-pending">
              This message has not been read yet.
            </p>
            <button
              type="button"
              onClick={handleToggleRead}
              className="self-start text-xs font-semibold text-status-pending hover:underline sm:self-auto"
            >
              Mark as read
            </button>
          </div>
        )}
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <aside className="order-1 min-w-0 space-y-5 lg:order-2">
          <SenderPanel message={message} />
          <StatusPanel
            status={message.status}
            onStatusChange={handleStatusChange}
          />
        </aside>

        <div className="order-2 min-w-0 space-y-5 lg:order-1">
          <ThreadPanel thread={message.thread} />
          <ReplyPanel
            message={message}
            onSend={handleSendReply}
            disabled={replyLocked}
          />
        </div>
      </div>
    </div>
  );
}
