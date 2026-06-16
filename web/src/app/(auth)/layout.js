import GuestGuard from "@/client/modules/shared/components/auth/GuestGuard";

export default function AuthLayout({ children }) {
  return (
    <GuestGuard>
      <div className="flex flex-col bg-background text-on-surface">{children}</div>
    </GuestGuard>
  );
}
