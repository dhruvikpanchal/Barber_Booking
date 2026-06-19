function resolveWorkflowStatus(raw) {
  if (raw.workflowStatus) return raw.workflowStatus;
  if (raw.replyStatus === "replied") return "replied";
  return "new";
}

export function buildContactMessageRecord(raw) {
  const status = resolveWorkflowStatus(raw);

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
      timestamp: raw.repliedAt ?? raw.submittedAt,
    });
  }

  return {
    ...raw,
    phone: raw.phone ?? null,
    status,
    thread,
    assignedTo: raw.assignedTo ?? null,
    internalNote: raw.internalNote ?? null,
  };
}
