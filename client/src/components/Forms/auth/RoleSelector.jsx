"use client";

const ROLES = [
  { key: "customer", label: "Customer" },
  { key: "barber", label: "Barber" },
  { key: "admin", label: "Admin" },
];

/**
 * @param {{
 *   value: 'customer' | 'barber' | 'admin';
 *   onChange: (role: 'customer' | 'barber' | 'admin') => void;
 *   disabled?: boolean;
 * }} props
 */
export default function RoleSelector({ value, onChange, disabled = false }) {
  return (
    <div
      className="mb-8 grid grid-cols-3 gap-0 border border-[#53443c]"
      role="tablist"
      aria-label="Sign in as"
    >
      {ROLES.map((role) => {
        const active = value === role.key;
        return (
          <button
            key={role.key}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={disabled}
            onClick={() => onChange(role.key)}
            className={`py-3 text-[11px] font-semibold tracking-[0.12em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb68c]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131313] disabled:opacity-50 ${
              active
                ? "bg-[#ffb68c] text-[#532200]"
                : "bg-[#1f2020] text-[#e4e2e1] hover:bg-[#2a2a2a] hover:text-[#ffb68c]"
            }`}
          >
            {role.label.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
