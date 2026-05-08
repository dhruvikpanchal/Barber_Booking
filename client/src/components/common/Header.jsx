"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <>
      {/* Navbar */}
      <header
        className={`fixed top-0 w-full z-50 flex justify-between items-center px-4 md:px-16 py-4 bg-[#131313]/95 backdrop-blur-sm border-b border-[#53443c] transition-all duration-300`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="text-[#e4e2e1] text-2xl font-black tracking-tight hover:text-[#ffb68c] transition-colors"
        >
          IRON &amp; OAK
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex gap-6 items-center"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className={`text-[#d8c2b7] pb-1 text-xs font-semibold tracking-[0.1em] ${
              pathname === "/"
                ? "text-[#ffb68c] border-b border-[#ffb68c]"
                : "hover:text-[#ffb68c] hover:border-b hover:border-[#ffb68c]"
            }`}
          >
            Home
          </Link>

          {["Services", "Barbers", "Gallery", "About", "Contact"].map(
            (item) => {
              const path = `/${item.toLowerCase()}`;
              return (
                <Link
                  key={item}
                  href={path}
                  className={`text-[#d8c2b7] pb-1 text-xs font-semibold tracking-[0.1em] ${
                    pathname === path
                      ? "text-[#ffb68c] border-b border-[#ffb68c]"
                      : "hover:text-[#ffb68c] hover:border-b hover:border-[#ffb68c]"
                  }`}
                >
                  {item}
                </Link>
              );
            },
          )}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/register"
            className="border border-[#a08d83] text-[#e4e2e1] px-5 py-2 text-xs font-semibold tracking-[0.15em] hover:border-[#ffb68c] hover:text-[#ffb68c] transition-colors"
          >
            SIGN IN
          </Link>

          <Link
            href="#"
            className="bg-[#ffb68c] text-[#532200] px-6 py-2 text-xs font-semibold tracking-[0.15em] hover:opacity-90 transition-all active:scale-95"
          >
            BOOK NOW
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenu(true)}
          className="md:hidden text-[#e4e2e1] p-2"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      {/* Mobile Nav */}
      <div
        className={`fixed inset-0 z-[49] ${mobileMenu ? "block" : "hidden"}`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileMenu(false)}
          className="absolute inset-0 bg-black/70"
        ></div>

        {/* Sidebar */}
        <nav className="absolute right-0 top-0 h-full w-72 bg-[#1b1c1c] border-l border-[#53443c] flex flex-col p-8 gap-8 overflow-y-auto">
          {/* Top */}
          <div className="flex justify-between items-center">
            <span className="text-[#e4e2e1] text-2xl font-black tracking-tight">
              IRON &amp; OAK
            </span>

            <button
              onClick={() => setMobileMenu(false)}
              className="text-[#d8c2b7]"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col gap-6 border-t border-[#53443c] pt-8">
            <Link
              href="/"
              className="text-[#ffb68c] text-xs font-semibold tracking-[0.1em]"
            >
              HOME
            </Link>

            {["SERVICES", "BARBERS", "GALLERY", "ABOUT", "CONTACT"].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-[#d8c2b7] text-xs font-semibold tracking-[0.1em] hover:text-[#ffb68c] transition-colors"
                >
                  {item}
                </Link>
              ),
            )}
          </div>

          {/* Bottom Buttons */}
          <div className="mt-auto flex flex-col gap-3 border-t border-[#53443c] pt-8">
            <Link
              href="#"
              className="w-full text-center border border-[#a08d83] text-[#e4e2e1] py-3 text-xs font-semibold tracking-[0.15em] hover:border-[#ffb68c] hover:text-[#ffb68c] transition-colors"
            >
              SIGN IN
            </Link>

            <Link
              href="/register"
              className="w-full text-center border border-[#a08d83] text-[#e4e2e1] py-3 text-xs font-semibold tracking-[0.15em] hover:border-[#ffb68c] hover:text-[#ffb68c] transition-colors"
            >
              REGISTER
            </Link>

            <Link
              href="#"
              className="w-full text-center bg-[#ffb68c] text-[#532200] py-3 text-xs font-semibold tracking-[0.15em]"
            >
              BOOK NOW
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
