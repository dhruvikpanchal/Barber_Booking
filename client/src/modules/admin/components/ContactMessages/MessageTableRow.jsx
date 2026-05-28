"use client";

import Link from "next/link";
import { Eye, Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import { routes } from "@/config/routes/routes.js";

export function MessageTableRow({ message, onView, onToggleRead, onDelete }) {
  const dateFormatted = new Date(message.submittedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <tr className={`border-t border-outline-variant transition-colors hover:bg-surface-container/40 ${
      !message.isRead ? "bg-primary/5 font-semibold" : ""
    }`}>
      <td className="px-4 py-3.5">
        <p className="font-semibold text-on-surface">{message.name}</p>
        <p className="text-xs text-on-surface-variant break-all">{message.email}</p>
      </td>
      <td className="px-4 py-3.5 max-w-xs md:max-w-md">
        <p className="truncate font-semibold text-on-surface">{message.subject}</p>
        <p className="truncate text-xs text-on-surface-variant">{message.message}</p>
      </td>
      <td className="px-4 py-3.5 text-xs text-on-surface-variant whitespace-nowrap">
        {dateFormatted}
      </td>
      <td className="px-4 py-3.5 whitespace-nowrap">
        <div className="flex gap-1.5">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
            message.isRead
              ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
              : "bg-status-pending/10 text-status-pending border-status-pending/20"
          }`}>
            {message.isRead ? "Read" : "New"}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
            message.replyStatus === "replied"
              ? "bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20"
              : "bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20"
          }`}>
            {message.replyStatus === "replied" ? "Replied" : "Unreplied"}
          </span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1">
          <Link
            href={routes.admin.contactMessagesDetail(message.id)}
            title="View Details"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-all hover:bg-surface-container hover:text-on-surface"
          >
            <Eye className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => onToggleRead(message.id)}
            title={message.isRead ? "Mark as unread" : "Mark as read"}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all"
          >
            {message.isRead ? <MailOpen className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
          </button>
          {message.replyStatus === "unreplied" && (
            <button
              type="button"
              onClick={() => onView(message)}
              title="Reply"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all"
            >
              <Reply className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(message.id)}
            title="Delete"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant hover:border-status-cancelled/30 hover:text-status-cancelled transition-all"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function MessageCard({ message, onView, onToggleRead, onDelete }) {
  const dateFormatted = new Date(message.submittedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className={`rounded-lg border border-outline-variant bg-surface-container p-4 ${
      !message.isRead ? "border-primary/40 bg-surface-container-high/40" : ""
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-on-surface">{message.name}</p>
          <p className="text-xs text-on-surface-variant truncate">{message.email}</p>
        </div>
        <div className="flex flex-col gap-1 items-end shrink-0">
          <span className="text-[10px] text-on-surface-variant">{dateFormatted}</span>
          <div className="flex gap-1">
            <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold border ${
              message.isRead
                ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                : "bg-status-pending/10 text-status-pending border-status-pending/20"
            }`}>
              {message.isRead ? "Read" : "New"}
            </span>
            <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold border ${
              message.replyStatus === "replied"
                ? "bg-status-confirmed/10 text-status-confirmed border-status-confirmed/20"
                : "bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20"
            }`}>
              {message.replyStatus === "replied" ? "Replied" : "Unreplied"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-3">
        <p className="text-xs font-semibold text-on-surface truncate">{message.subject}</p>
        <p className="text-xs text-on-surface-variant line-clamp-2 mt-0.5 leading-relaxed">{message.message}</p>
      </div>

      <div className="mt-4 border-t border-outline-variant pt-3 flex items-center justify-between">
        <Link
          href={routes.admin.contactMessagesDetail(message.id)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View details
        </Link>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onToggleRead(message.id)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            {message.isRead ? <MailOpen className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => onDelete(message.id)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant hover:border-status-cancelled/30 hover:text-status-cancelled"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
