"use client";

import Link from "@/lib/AppLink";
import { usePathname } from "next/navigation";

/** Smart link that adds an active style when href matches the current path. */
export default function NavLink({
  href = "#",
  exact = false,
  prefetch = false,
  className = "",
  activeClassName = "",
  inactiveClassName = "",
  children,
  ...rest
}) {
  const pathname = usePathname() || "";
  const isPlaceholder = href === "#";
  const isActive =
    !isPlaceholder &&
    (exact
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      prefetch={prefetch}
      data-active={isActive ? "true" : undefined}
      className={`${className} ${isActive ? activeClassName : inactiveClassName}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
