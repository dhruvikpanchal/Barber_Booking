/** Mock contact messages data for admin message queue. */
export const INITIAL_CONTACT_MESSAGES = [
  {
    id: "MSG-1001",
    name: "Sarah Connor",
    email: "s.connor@cyberdyne.net",
    subject: "Booking question regarding group events",
    message: "Hi, I would like to book a group session for 5 people next Saturday afternoon. Do you offer any discount or specific packages for group bookings? We would all like premium haircuts and beard grooming if possible. Let me know the pricing.",
    submittedAt: "2026-05-18T10:15:00Z",
    isRead: false,
    replyStatus: "unreplied",
    replyText: "",
  },
  {
    id: "MSG-1002",
    name: "John Doe",
    email: "johndoe@gmail.com",
    subject: "Unable to reset my account password",
    message: "I am trying to reset my password but I'm not receiving the password reset email in my inbox. I checked my spam folder too. Can you please check if my account is active or trigger a reset link manually?",
    submittedAt: "2026-05-17T16:30:00Z",
    isRead: true,
    replyStatus: "replied",
    replyText: "Hi John, I checked your account and sent a manual reset link to your email. Let us know if you need anything else! - Admin",
  },
  {
    id: "MSG-1003",
    name: "Michael Scott",
    email: "m.scott@dundermifflin.com",
    subject: "Corporate rates inquiry for office staff",
    message: "Do you have corporate rates for mid-size paper distribution companies? We want our sales team to look sharp and clean-cut. We are talking about 15-20 men. If you give us a good deal, I will throw in some Dundie awards.",
    submittedAt: "2026-05-15T09:00:00Z",
    isRead: true,
    replyStatus: "unreplied",
    replyText: "",
  },
  {
    id: "MSG-1004",
    name: "James Bond",
    email: "double07@mi6.gov.uk",
    subject: "Urgent grooming appointment booking",
    message: "Need a premium haircut and hot towel shave before a critical mission tomorrow night. All slots seem fully booked online. Can I get an after-hours booking or emergency fit-in?",
    submittedAt: "2026-05-19T21:45:00Z",
    isRead: false,
    replyStatus: "unreplied",
    replyText: "",
  },
  {
    id: "MSG-1005",
    name: "Bruce Wayne",
    email: "bruce@waynecorp.com",
    subject: "Sponsorship & Charity Gala inquiry",
    message: "Wayne Enterprises is hosting the annual Gotham Charity Gala. We would like to feature Iron & Oak as one of our local premium grooming partners, providing gift vouchers to attendees. Let me know who to contact to discuss this sponsorship proposal.",
    submittedAt: "2026-05-14T11:20:00Z",
    isRead: true,
    replyStatus: "replied",
    replyText: "Hello Mr. Wayne, we would be honored to participate in the Charity Gala. Our marketing director will follow up with you directly via email. Thank you! - Iron & Oak Admin",
  },
];

/** Enrich list row with thread + workflow status for the detail page. */
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
      timestamp: new Date(
        submittedDate.getTime() + 1000 * 60 * 45,
      ).toISOString(),
    });
    thread.push({
      id: `${raw.id}-status-replied`,
      type: "status_change",
      author: "Admin",
      authorRole: "admin",
      content: 'Status changed to "Replied"',
      timestamp: new Date(
        submittedDate.getTime() + 1000 * 60 * 46,
      ).toISOString(),
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

const ENRICHED_CONTACT_MESSAGES =
  INITIAL_CONTACT_MESSAGES.map(buildContactMessageRecord);

/** @returns {ReturnType<typeof buildContactMessageRecord> | undefined} */
export function getContactMessageById(id) {
  return ENRICHED_CONTACT_MESSAGES.find((m) => m.id === id);
}
