"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { routes } from "@/client/config/routes/routes.js";
import { adminHook } from "@/client/modules/admin/hooks/adminQuery.jsx";
import { mapContactMessageDetail } from "@/client/modules/admin/helpers/adminMappers.js";
import {
  statusEntry,
  WorkflowBadge,
  ReadBadge,
  Breadcrumb,
  SenderPanel,
  StatusPanel,
  ThreadPanel,
} from "@/client/modules/admin/components/ContactMessageDetail/Primitives.jsx";
import { DeleteConfirmBanner } from "@/client/modules/admin/components/ContactMessageDetail/DeleteConfirmBanner.jsx";
import { ReplyPanel } from "@/client/modules/admin/components/ContactMessageDetail/ReplyPanel.jsx";

/**
 * @param {{ id: string }} props
 */
export default function ContactMessageDetail({ id }) {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = adminHook.ContactMessages.useContactMessage(id);
  const updateMutation = adminHook.ContactMessages.useUpdateContactMessage();
  const replyMutation = adminHook.ContactMessages.useReplyContactMessage();

  const busy = isPending || updateMutation.isPending || replyMutation.isPending;

  const [showDelete, setShowDelete] = useState(false);
  const [workflowStatus, setWorkflowStatus] = useState(null);

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load contact message.");
    }
  }, [isError, error]);

  const message = useMemo(() => (data ? mapContactMessageDetail(data) : null), [data]);

  useEffect(() => {
    if (message) {
      setWorkflowStatus(message.status);
      setShowDelete(false);
    }
  }, [message?.id, message?.status]);

  function handleStatusChange(next) {
    if (busy || !message) return;
    setWorkflowStatus(next);
    toast.success(`Workflow updated to ${next.replace("_", " ")}.`);
  }

  async function handleToggleRead() {
    if (busy || !message) return;
    try {
      await toast.promise(
        updateMutation.mutateAsync({ id, isRead: !message.isRead }),
        {
          loading: "Updating read status…",
          success: message.isRead ? "Marked as unread" : "Marked as read",
          error: "Could not update message.",
        },
      );
      await refetch();
    } catch {
      /* toast handles error */
    }
  }

  async function handleSendReply(text) {
    if (busy || !message) return;
    try {
      await toast.promise(replyMutation.mutateAsync({ id, replyText: text }), {
        loading: "Sending reply…",
        success: "Reply sent successfully.",
        error: "Could not send reply.",
      });
      await refetch();
    } catch {
      /* toast handles error */
    }
  }

  function handleDelete() {
    toast.info("Message deletion is not available via API.");
    setShowDelete(false);
  }

  if (isPending) {
    return (
      <div className="mx-auto max-w-5xl py-16 text-center">
        <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" aria-hidden />
        <p className="text-on-surface-variant mt-4 text-sm">Loading message…</p>
      </div>
    );
  }

  if (isError || !message) {
    return (
      <div className="text-on-surface mx-auto max-w-5xl py-16 text-center">
        <p className="font-medium">Could not load contact message.</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={busy}
            className="text-primary text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Try again
          </button>
          <Link
            href={routes.admin.contactMessages}
            className="border-outline-variant text-on-surface-variant hover:text-on-surface inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to messages
          </Link>
        </div>
      </div>
    );
  }

  const displayMessage = {
    ...message,
    status: workflowStatus ?? message.status,
    thread:
      workflowStatus && workflowStatus !== message.status
        ? [...message.thread, statusEntry(message.id, workflowStatus)]
        : message.thread,
  };

  const replyLocked = displayMessage.status === "closed";

  return (
    <div className="mx-auto max-w-5xl min-w-0 space-y-5 pb-4 sm:space-y-6">
      <Breadcrumb messageId={displayMessage.id} />

      {showDelete ? (
        <DeleteConfirmBanner onCancel={() => setShowDelete(false)} onConfirm={handleDelete} />
      ) : null}

      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Link
              href={routes.admin.contactMessages}
              className="border-outline-variant bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors"
              aria-label="Back to contact messages"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </Link>
            <div className="min-w-0">
              <p className="font-label-caps text-primary text-[11px]">
                Contact message
                <span className="hidden sm:inline"> · {displayMessage.id}</span>
              </p>
              <h1 className="text-on-surface mt-1 font-serif text-xl leading-snug font-bold sm:text-2xl">
                {displayMessage.subject}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <WorkflowBadge status={displayMessage.status} />
                <ReadBadge isRead={displayMessage.isRead} />
                <span
                  className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                    displayMessage.replyStatus === "replied"
                      ? "border-status-confirmed/30 bg-status-confirmed/10 text-status-confirmed"
                      : "border-status-cancelled/30 bg-status-cancelled/10 text-status-cancelled"
                  }`}
                >
                  {displayMessage.replyStatus === "replied" ? "Replied" : "Needs reply"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            <button
              type="button"
              disabled={busy}
              onClick={handleToggleRead}
              className="border-outline-variant bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              {displayMessage.isRead ? (
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
              disabled={busy}
              onClick={() => setShowDelete(true)}
              className="border-outline-variant bg-surface-container text-on-surface-variant hover:border-status-cancelled/40 hover:bg-status-cancelled/8 hover:text-status-cancelled inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md border px-3 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              Delete
            </button>
          </div>
        </div>

        {!displayMessage.isRead && (
          <div className="border-status-pending/30 bg-status-pending/8 flex flex-col gap-2 rounded-lg border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-status-pending font-medium">This message has not been read yet.</p>
            <button
              type="button"
              disabled={busy}
              onClick={handleToggleRead}
              className="text-status-pending self-start text-xs font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
            >
              Mark as read
            </button>
          </div>
        )}
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <aside className="order-1 min-w-0 space-y-5 lg:order-2">
          <SenderPanel message={displayMessage} />
          <StatusPanel
            status={displayMessage.status}
            onStatusChange={handleStatusChange}
            disabled={busy}
          />
        </aside>

        <div className="order-2 min-w-0 space-y-5 lg:order-1">
          <ThreadPanel thread={displayMessage.thread} />
          <ReplyPanel
            message={displayMessage}
            onSend={handleSendReply}
            disabled={replyLocked || busy}
            sending={replyMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
