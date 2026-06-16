import { Work_Sans, Noto_Serif, Geist_Mono } from "next/font/google";
import QueryProvider from "@/client/lib/providers/QueryProvider";
import SystemStatusBanner from "@/client/modules/shared/components/layout/SystemStatusBanner.jsx";
import Toast from "@/client/modules/shared/components/layout/toast/Toast.jsx";
import "./globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  weight: ["500", "600", "700", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Iron & Oak — Barber booking",
  description:
    "Multi-shop barber appointment and queue management. Discover shops, book services, manage your chair.",
  openGraph: {
    title: "Iron & Oak — Barber booking",
    description: "Multi-shop barber appointment and queue management.",
    images: ["https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1600&q=80"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark ${workSans.variable} ${notoSerif.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="bg-background text-on-surface min-h-full">
        <QueryProvider>
          <SystemStatusBanner />
          {children}
          <Toast />
        </QueryProvider>
      </body>
    </html>
  );
}
