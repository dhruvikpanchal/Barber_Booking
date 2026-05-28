/** App paths grouped by audience (frontend-only; no auth wired yet). */
export const routes = {
  public: {
    home: "/", // Done
    services: "/services", // Done
    servicesDetail: (id) => `/services/${id}`, // Done
    // shops: "/shops",
    barbers: "/barbers", // Done
    barbersDetail: (id) => `/barbers/${id}`, // Done
    about: "/about", // Done
    contact: "/contact", // Done
  },

  auth: {
    login: "/login", // Done
    register: "/register", // Done
    barberRegister: "/barber-register", // Done
    barberRegisterRules: "/barber-register-rules", // Done
    forgotPassword: "/forgot-password", // Done
    resetPassword: "/reset-password", // Done
  },

  admin: {
    dashboard: "/admin/dashboard", //Done
    profile: "/admin/profile", // Done
    analytics: "/admin/analytics", // Done
    reports: "/admin/reports", // Done
    appointments: "/admin/appointments", // Done
    appointmentsDetail: (id) => `/admin/appointments/${id}`, // Done
    barberRequests: "/admin/barber-requests", // Done
    barberRequestsDetail: (id) => `/admin/barber-requests/${id}`, // Done
    users: "/admin/users", // Done
    usersDetail: (id) => `/admin/users/${id}`, // Done
    barbers: "/admin/barbers", // Done
    barbersDetail: (id) => `/admin/barbers/${id}`, // Done
    contactMessages: "/admin/contact-messages", // Done
    contactMessagesDetail: (id) => `/admin/contact-messages/${id}`, // Done
    settings: "/admin/settings", // Done
    notifications: "/admin/notifications", // Done
  },

  barber: {
    dashboard: "/barber/dashboard", //Done
    schedule: "/barber/schedule", // Done
    services: "/barber/services", // Done
    walkIns: "/barber/walk-ins", // Done
    profile: "/barber/profile", // Done
    settings: "/barber/settings", // Done
    notifications: "/barber/notifications", // Done
    queue: "/barber/queue", // Done
    appointments: "/barber/appointments", // Done
    appointmentsDetail: (id) => `/barber/appointments/${id}`, // Done
    reviews: "/barber/reviews", // Done
    reviewsDetail: (id) => `/barber/reviews/${id}`, // Done
    analytics: "/barber/analytics", // Done
  },

  customer: {
    dashboard: "/customer/dashboard", // Done
    bookAppointment: "/customer/book-appointment", // Done
    myAppointments: "/customer/my-appointments", // Done
    appointmentsDetail: (id) => `/customer/my-appointments/${id}`, // Done
    favorites: "/customer/favorites", // Done
    reviews: "/customer/reviews", // Done
    profile: "/customer/profile", // Done
    settings: "/customer/settings", // Done
    notifications: "/customer/notifications", //Done
  },
};
