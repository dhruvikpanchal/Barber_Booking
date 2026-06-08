"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Smart link that adds an active style when href matches the current path. */
export default function NavLink({
  href = "#",
  exact = false,
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
      data-active={isActive ? "true" : undefined}
      className={`${className} ${isActive ? activeClassName : inactiveClassName}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
