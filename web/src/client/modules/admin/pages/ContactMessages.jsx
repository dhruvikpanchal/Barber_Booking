"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, Search } from "lucide-react";
import MessageStats from "@/client/modules/admin/components/ContactMessages/MessageStats.jsx";
import {
  MessageCard,
  MessageTableRow,
} from "@/client/modules/admin/components/ContactMessages/MessageTableRow.jsx";
import { INITIAL_CONTACT_MESSAGES } from "@/client/modules/admin/data/contactMessagesData.js";
import { Toast } from "@/client/modules/shared/components/common/settings/TinyPrimitives.jsx";
import { CONTACT_MESSAGE_TABS } from "@/client/modules/admin/constants/admin.js";
import { routes } from "@/client/config/routes/routes.js";

export default function ContactMessages() {
  const router = useRouter();

  const [messages, setMessages] = useState(INITIAL_CONTACT_MESSAGES);
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const stats = useMemo(
    () => ({
      total: messages.length,
      unread: messages.filter((m) => !m.isRead).length,
      unreplied: messages.filter((m) => m.replyStatus === "unreplied").length,
    }),
    [messages],
  );

  const filtered = useMemo(() => {
    let list = messages;

    // Tab filtering
    if (tab === "unread") {
      list = list.filter((m) => !m.isRead);
    } else if (tab === "unreplied") {
      list = list.filter((m) => m.replyStatus === "unreplied");
    } else if (tab === "replied") {
      list = list.filter((m) => m.replyStatus === "replied");
    }

    // Search query filtering
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q),
      );
    }

    // Sort by date submitted desc
    return [...list].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }, [messages, tab, query]);

  function toggleRead(id) {
    let wasRead = false;
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          wasRead = !m.isRead;
          return { ...m, isRead: !m.isRead };
        }
        return m;
      }),
    );

    showToast(wasRead ? "Message marked as read" : "Message marked as unread", "success");
  }

  function reply(id, text) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              replyStatus: "replied",
              replyText: text,
              isRead: true, // Auto mark read on reply
            }
          : m,
      ),
    );

    showToast("Reply sent successfully. Email delivery simulated.", "success");
  }

  function deleteMessage(id) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    showToast("Message deleted.", "info");
  }

  function handleView(message) {
    router.push(routes.admin.contactMessagesDetail(message.id));
  }

  const handlers = {
    onView: handleView,
    onToggleRead: toggleRead,
    onDelete: deleteMessage,
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4">
      <header className="space-y-2">
        <p className="font-label-caps text-primary">Admin · Communication</p>
        <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
          Contact Messages
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
          Respond to customer questions, platform support requests, booking inquiries, and business
          propositions.
        </p>
      </header>

      <MessageStats stats={stats} />

      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        <div className="border-outline-variant flex flex-col gap-4 border-b px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <span className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <MessageSquare className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-on-surface font-serif text-lg font-bold">Inquiries Queue</h2>
              <p className="text-on-surface-variant text-sm">
                {stats.unread} unread · {stats.unreplied} pending reply
              </p>
            </div>
          </div>
          <label className="relative block w-full md:w-72">
            <Search
              className="text-on-surface-variant pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
              aria-hidden
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sender, email, subject…"
              className="border-outline-variant bg-surface-container text-on-surface placeholder:text-on-surface-variant/70 focus:border-primary h-10 w-full rounded-md border py-2 pr-3 pl-9 text-sm focus:outline-none"
            />
          </label>
        </div>

        <div className="scrollbar-thin border-outline-variant flex gap-1 overflow-x-auto border-b px-4 py-2 md:px-6">
          {CONTACT_MESSAGE_TABS.map((t) => {
            const active = tab === t.key;
            let count = messages.length;
            if (t.key === "unread") {
              count = stats.unread;
            } else if (t.key === "unreplied") {
              count = stats.unreplied;
            } else if (t.key === "replied") {
              count = messages.filter((m) => m.replyStatus === "replied").length;
            }
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-1.5 text-[10px] font-bold ${
                    active
                      ? "bg-on-primary/20 text-on-primary"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="px-4 py-14 text-center">
            <p className="text-on-surface font-serif text-base font-bold">No messages found</p>
            <p className="text-on-surface-variant mt-1 text-sm">
              Try adjusting your search query or selecting a different tab.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead>
                  <tr className="border-outline-variant text-on-surface-variant border-b">
                    <th className="font-label-caps px-4 py-3">Sender</th>
                    <th className="font-label-caps px-4 py-3">Subject / Preview</th>
                    <th className="font-label-caps px-4 py-3">Date</th>
                    <th className="font-label-caps px-4 py-3">Status</th>
                    <th className="font-label-caps px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((msg) => (
                    <MessageTableRow key={msg.id} message={msg} {...handlers} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 lg:hidden">
              {filtered.map((msg) => (
                <MessageCard key={msg.id} message={msg} {...handlers} />
              ))}
            </div>
          </>
        )}
      </section>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
