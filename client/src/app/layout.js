import { Work_Sans, Noto_Serif } from "next/font/google";
import "@/styles/globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
});

export const metadata = {
  title: "IRON & OAK",
  description: "Premium Barber Booking Website",
};

export default function AuthLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${notoSerif.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
