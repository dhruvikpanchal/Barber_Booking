"use client";

import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Home,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";
import { routes } from "@/config/routes/routes.js";
import {
  formatDateLabel,
  formatTimeLabel,
  formatTimeAgo,
} from "@/lib/format/formatDateTime.js";
import {
  WORKFLOW_STATUS,
  STATUS_NEXT,
} from "@/data/admin/contactMessageDetailData.js";

export function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function fullDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function statusEntry(messageId, nextStatus) {
  const cfg = WORKFLOW_STATUS[nextStatus];
  return {
    id: `${messageId}-sc-${Date.now()}`,
    type: "status_change",
    author: "Admin",
    authorRole: "admin",
    content: `Status changed to "${cfg.label}"`,
    timestamp: new Date().toISOString(),
  };
}

export function WorkflowBadge({ status }) {
  const cfg = WORKFLOW_STATUS[status] ?? WORKFLOW_STATUS.new;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cfg.badge}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {cfg.label}
    </span>
  );
}

export function ReadBadge({ isRead }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${
        isRead
          ? "border-outline-variant bg-surface-container text-on-surface-variant"
          : "border-status-pending/30 bg-status-pending/10 text-status-pending"
      }`}
    >
      {isRead ? "Read" : "Unread"}
    </span>
  );
}

export function Breadcrumb({ messageId }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 flex-wrap items-center gap-1 text-xs text-on-surface-variant"
    >
      <Link
        href={routes.admin.dashboard}
        className="inline-flex shrink-0 items-center gap-1 transition-colors hover:text-primary"
      >
        <Home className="h-3 w-3" aria-hidden />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      <ChevronRight className="h-3 w-3 shrink-0 opacity-40" aria-hidden />
      <Link
        href={routes.admin.contactMessages}
        className="shrink-0 transition-colors hover:text-primary"
      >
        <span className="hidden sm:inline">Contact messages</span>
        <span className="sm:hidden">Messages</span>
      </Link>
      <ChevronRight className="h-3 w-3 shrink-0 opacity-40" aria-hidden />
      <span
        className="min-w-0 truncate font-medium text-on-surface"
        aria-current="page"
      >
        {messageId}
      </span>
    </nav>
  );
}

export function Panel({ title, icon: Icon, children }) {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-low">
      <div className="flex items-center gap-2.5 border-b border-outline-variant px-4 py-3 sm:px-5">
        {Icon ? (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        ) : null}
        <h2 className="min-w-0 flex-1 font-serif text-sm font-bold text-on-surface sm:text-base">
          {title}
        </h2>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function SenderPanel({ message }) {
  return (
    <Panel title="Sender" icon={User}>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container font-serif text-sm font-bold text-primary">
          {initials(message.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-on-surface">
            {message.name}
          </p>
          <p className="text-xs text-on-surface-variant">
            {formatTimeAgo(message.submittedAt)}
          </p>
        </div>
      </div>
      <ul className="mt-4 divide-y divide-outline-variant/60 rounded-lg border border-outline-variant text-sm">
        <li className="flex gap-3 px-3 py-3 sm:px-4">
          <Mail
            className="mt-0.5 h-4 w-4 shrink-0 text-on-surface-variant"
            aria-hidden
          />
          <div className="min-w-0">
            <p className="font-label-caps text-[10px] text-on-surface-variant">
              Email
            </p>
            <a
              href={`mailto:${message.email}`}
              className="mt-0.5 block break-all font-medium text-primary hover:underline"
            >
              {message.email}
            </a>
          </div>
        </li>
        <li className="flex gap-3 px-3 py-3 sm:px-4">
          <Calendar
            className="mt-0.5 h-4 w-4 shrink-0 text-on-surface-variant"
            aria-hidden
          />
          <div className="min-w-0">
            <p className="font-label-caps text-[10px] text-on-surface-variant">
              Received
            </p>
            <p
              className="mt-0.5 text-on-surface"
              title={fullDateTime(message.submittedAt)}
            >
              {formatDateLabel(message.submittedAt, {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              · {formatTimeLabel(message.submittedAt)}
            </p>
          </div>
        </li>
      </ul>
    </Panel>
  );
}

export function StatusPanel({ status, onStatusChange }) {
  const cfg = WORKFLOW_STATUS[status] ?? WORKFLOW_STATUS.new;
  const options = STATUS_NEXT[status] ?? [];

  return (
    <Panel title="Workflow" icon={MessageSquare}>
      <div className="flex items-start gap-3 rounded-lg border border-outline-variant bg-surface-container p-3">
        <span
          className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${cfg.dot}`}
          aria-hidden
        />
        <div className="min-w-0">
          <WorkflowBadge status={status} />
          <p className="mt-2 text-xs leading-relaxed text-on-surface-variant">
            {status === "new" && "Awaiting first review from the team."}
            {status === "in_progress" && "Someone is working on this inquiry."}
            {status === "replied" && "A reply has been sent to the sender."}
            {status === "closed" && "No further action required."}
          </p>
        </div>
      </div>
      {options.length > 0 ? (
        <div className="mt-4 space-y-2">
          <p className="font-label-caps text-[10px] text-on-surface-variant">
            Move to
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {options.map((next) => {
              const nextCfg = WORKFLOW_STATUS[next];
              const NextIcon = nextCfg.icon;
              return (
                <button
                  key={next}
                  type="button"
                  onClick={() => onStatusChange(next)}
                  className="inline-flex items-center justify-center gap-2 rounded-md border border-outline-variant bg-surface-container px-3 py-2.5 text-left text-xs font-semibold text-on-surface transition-colors hover:border-primary/40 hover:bg-primary/8 hover:text-primary sm:justify-start"
                >
                  <NextIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {nextCfg.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </Panel>
  );
}

export function ThreadEntry({ entry }) {
  if (entry.type === "status_change") {
    return (
      <li className="flex gap-3 py-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container text-on-surface-variant">
          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
        </span>
        <p className="min-w-0 pt-1 text-xs text-on-surface-variant">
          <span className="font-semibold text-on-surface">{entry.author}</span>{" "}
          {entry.content}
          <time
            className="mt-1 block text-[11px] opacity-80"
            dateTime={entry.timestamp}
            title={fullDateTime(entry.timestamp)}
          >
            {formatTimeAgo(entry.timestamp)}
          </time>
        </p>
      </li>
    );
  }

  const isAdmin = entry.authorRole === "admin";
  return (
    <li className={`flex gap-3 ${isAdmin ? "flex-row-reverse" : ""}`}>
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isAdmin
            ? "bg-primary/20 text-primary"
            : "border border-outline-variant bg-surface-container text-on-surface-variant"
        }`}
      >
        {isAdmin ? "A" : initials(entry.author)}
      </span>
      <div
        className={`min-w-0 max-w-[85%] sm:max-w-[75%] ${
          isAdmin ? "text-right" : ""
        }`}
      >
        <p className="text-xs font-semibold text-on-surface">
          {entry.author}
          {isAdmin ? (
            <span className="ml-1.5 font-normal text-on-surface-variant">
              · Team
            </span>
          ) : null}
        </p>
        <div
          className={`mt-1 rounded-lg border px-3 py-2.5 text-sm leading-relaxed ${
            isAdmin
              ? "border-primary/25 bg-primary/10 text-on-surface"
              : "border-outline-variant bg-surface-container text-on-surface"
          }`}
        >
          <p className="whitespace-pre-wrap break-words text-left">
            {entry.content}
          </p>
        </div>
        <time
          className="mt-1 block text-[11px] text-on-surface-variant"
          dateTime={entry.timestamp}
          title={fullDateTime(entry.timestamp)}
        >
          {formatTimeAgo(entry.timestamp)}
        </time>
      </div>
    </li>
  );
}

export function ThreadPanel({ thread }) {
  return (
    <Panel title="Conversation" icon={MessageSquare}>
      <ul className="space-y-4">
        {thread.map((entry) => (
          <ThreadEntry key={entry.id} entry={entry} />
        ))}
      </ul>
    </Panel>
  );
}
