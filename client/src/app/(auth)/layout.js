export default function AuthLayout({ children }) {
  return (
    <div className="flex flex-col bg-background text-on-surface">
      {children}
    </div>
  );
}
