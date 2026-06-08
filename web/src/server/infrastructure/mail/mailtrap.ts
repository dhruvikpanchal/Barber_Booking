import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { appConfig, env } from "@/server/config";

export type SendMailOptions = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS,
      },
    });
  }
  return transporter;
}

function appUrl(path = ""): string {
  const base = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="font-family:system-ui,sans-serif;color:#1a1a1a;line-height:1.5">
    <h2 style="margin:0 0 16px">${appConfig.name}</h2>
    <h3 style="margin:0 0 12px">${title}</h3>
    ${body}
    <p style="margin-top:24px;font-size:12px;color:#666">© ${new Date().getFullYear()} ${appConfig.name}</p>
  </body>
</html>`;
}

export async function sendMail(options: SendMailOptions): Promise<void> {
  await getTransporter().sendMail({
    from: env.MAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  });
}

export async function sendEmailVerification(to: string, token: string): Promise<void> {
  const link = appUrl(`/verify-email?token=${encodeURIComponent(token)}`);
  await sendMail({
    to,
    subject: `Verify your ${appConfig.name} account`,
    html: layout(
      "Verify your email",
      `<p>Thanks for signing up. Click the link below to verify your email address:</p>
       <p><a href="${link}">Verify email</a></p>
       <p>This link expires in 24 hours.</p>`,
    ),
    text: `Verify your email: ${link}`,
  });
}

export async function sendPasswordReset(to: string, token: string): Promise<void> {
  const verifyLink = appUrl(`/verify-otp?email=${encodeURIComponent(to)}`);
  const minutes = appConfig.mail.passwordResetExpiresMinutes;
  await sendMail({
    to,
    subject: `Verify your password reset — ${appConfig.name}`,
    html: layout(
      "Verify password reset",
      `<p>We received a request to reset your password.</p>
       <p>Your reset token (OTP) is:</p>
       <p style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;font-size:16px;padding:10px 12px;border:1px solid #eee;display:inline-block;">${token}</p>
       <p style="margin-top:16px;"><a href="${verifyLink}">Enter token and reset password</a></p>
       <p>This token expires in ${minutes} minutes. If you did not request this, you can ignore this email.</p>`,
    ),
    text: `Password reset token (OTP): ${token}\nVerify: ${verifyLink}\nExpires in ${minutes} minutes.`,
  });
}

export type BookingEmailOpts = {
  to: string;
  customerName: string;
  barberName: string;
  serviceNames: string[];
  startAt: Date;
};

export async function sendBookingConfirmation(opts: BookingEmailOpts): Promise<void> {
  const when = opts.startAt.toLocaleString();
  await sendMail({
    to: opts.to,
    subject: "Your appointment is confirmed",
    html: layout(
      "Booking confirmed",
      `<p>Hi ${opts.customerName},</p>
       <p>Your appointment with <strong>${opts.barberName}</strong> is confirmed.</p>
       <p><strong>When:</strong> ${when}</p>
       <p><strong>Services:</strong> ${opts.serviceNames.join(", ")}</p>
       <p><a href="${appUrl("/customer/my-appointments")}">View appointment</a></p>`,
    ),
  });
}

export async function sendBookingCancellation(opts: BookingEmailOpts & { reason?: string }): Promise<void> {
  const when = opts.startAt.toLocaleString();
  await sendMail({
    to: opts.to,
    subject: "Your appointment was cancelled",
    html: layout(
      "Booking cancelled",
      `<p>Hi ${opts.customerName},</p>
       <p>Your appointment with <strong>${opts.barberName}</strong> on ${when} has been cancelled.</p>
       ${opts.reason ? `<p><strong>Reason:</strong> ${opts.reason}</p>` : ""}
       <p><a href="${appUrl("/customer/my-appointments")}">View appointments</a></p>`,
    ),
  });
}

export async function sendAppointmentReminder(opts: BookingEmailOpts): Promise<void> {
  const when = opts.startAt.toLocaleString();
  await sendMail({
    to: opts.to,
    subject: "Appointment reminder — tomorrow",
    html: layout(
      "Appointment reminder",
      `<p>Hi ${opts.customerName},</p>
       <p>This is a reminder for your appointment with <strong>${opts.barberName}</strong> on ${when}.</p>
       <p><strong>Services:</strong> ${opts.serviceNames.join(", ")}</p>`,
    ),
  });
}

export type BarberRequestEmailOpts = {
  to: string;
  ownerName: string;
  shopName: string;
  note?: string;
};

export async function sendBarberRequestApproval(opts: BarberRequestEmailOpts): Promise<void> {
  await sendMail({
    to: opts.to,
    subject: "Your barber application was approved",
    html: layout(
      "Application approved",
      `<p>Hi ${opts.ownerName},</p>
       <p>Your application for <strong>${opts.shopName}</strong> has been approved. You can now sign in and complete your profile.</p>
       <p><a href="${appUrl("/login")}">Sign in</a></p>`,
    ),
  });
}

export async function sendBarberRequestRejection(opts: BarberRequestEmailOpts): Promise<void> {
  await sendMail({
    to: opts.to,
    subject: "Update on your barber application",
    html: layout(
      "Application not approved",
      `<p>Hi ${opts.ownerName},</p>
       <p>Unfortunately your application for <strong>${opts.shopName}</strong> was not approved at this time.</p>
       ${opts.note ? `<p><strong>Note:</strong> ${opts.note}</p>` : ""}`,
    ),
  });
}

export type ReviewRequestEmailOpts = {
  to: string;
  customerName: string;
  barberName: string;
  appointmentId: string;
};

export async function sendBarberApplicationReceived(opts: {
  to: string;
  ownerName: string;
}): Promise<void> {
  await sendMail({
    to: opts.to,
    subject: `We received your ${appConfig.name} barber application`,
    html: layout(
      "Application received",
      `<p>Hi ${opts.ownerName},</p>
       <p>Thank you for applying. Our admin team will review your profile within 1–2 business days.</p>
       <p>You will receive another email once your account is approved.</p>`,
    ),
  });
}

export async function sendGoogleAccountConflict(to: string): Promise<void> {
  await sendMail({
    to,
    subject: `Google sign-in — ${appConfig.name}`,
    html: layout(
      "Use email sign-in",
      `<p>An account with this email already exists and uses a password.</p>
       <p>Please sign in with your email and password instead of Google.</p>
       <p><a href="${appUrl("/login")}">Go to login</a></p>`,
    ),
  });
}

export async function sendReviewRequest(opts: ReviewRequestEmailOpts): Promise<void> {
  const link = appUrl(`/customer/reviews?appointmentId=${encodeURIComponent(opts.appointmentId)}`);
  await sendMail({
    to: opts.to,
    subject: "How was your visit?",
    html: layout(
      "Leave a review",
      `<p>Hi ${opts.customerName},</p>
       <p>Thanks for visiting <strong>${opts.barberName}</strong>. We'd love to hear how it went.</p>
       <p><a href="${link}">Leave a review</a></p>`,
    ),
    text: `Leave a review: ${link}`,
  });
}
