import PublicNavbar from "@/components/layout/navbar/PublicNavbar";
import PublicFooter from "@/components/layout/footer/PublicFooter";
import PublicBottomNav from "@/components/layout/bottom-nav/PublicBottomNav";

export default function PublicShell({ children }) {
  return (
    <div className="app-public-root flex min-h-dvh flex-col bg-background text-on-surface">
      <PublicNavbar />
      <main
        className="flex-1"
        style={{
          paddingTop: "var(--header-height)",
          paddingBottom: "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {children}
      </main>
      <PublicFooter />
      <PublicBottomNav />
    </div>
  );
}
