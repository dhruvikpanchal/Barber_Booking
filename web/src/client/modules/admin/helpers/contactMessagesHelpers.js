export function buildContactMessageRecord(raw) {
  const baseStatus = raw.replyStatus === "replied" ? "replied" : "new";
  const submittedDate = new Date(raw.submittedAt);

  const thread = [
    {
      id: `${raw.id}-msg`,
      type: "message",
      author: raw.name,
      authorRole: "sender",
      content: raw.message,
      timestamp: raw.submittedAt,
    },
  ];

  if (raw.replyStatus === "replied" && raw.replyText) {
    thread.push({
      id: `${raw.id}-reply`,
      type: "reply",
      author: "Admin",
      authorRole: "admin",
      content: raw.replyText,
      timestamp: new Date(submittedDate.getTime() + 1000 * 60 * 45).toISOString(),
    });
    thread.push({
      id: `${raw.id}-status-replied`,
      type: "status_change",
      author: "Admin",
      authorRole: "admin",
      content: 'Status changed to "Replied"',
      timestamp: new Date(submittedDate.getTime() + 1000 * 60 * 46).toISOString(),
    });
  }

  return {
    ...raw,
    phone: raw.phone ?? null,
    status: baseStatus,
    thread,
    assignedTo: baseStatus !== "new" ? "Admin" : null,
    internalNote: null,
  };
}
