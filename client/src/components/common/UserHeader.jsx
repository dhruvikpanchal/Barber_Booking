'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function UserHeader() {
  const [mobileMenu, setMobileMenu] = useState(false);

  const navItems = [
    {
      name: 'Overview',
      href: '/user/overview',
    },
    {
      name: 'My Bookings',
      href: '/user/my-bookings',
    },
    {
      name: 'Booking History',
      href: '/user/booking-history',
    },
    {
      name: 'Favorite Barber',
      href: '/user/favorite-barber',
    },
    {
      name: 'Add Appoitment',
      href: '/user/add-appoitment',
    },
    {
      name: 'Profile',
      href: '/user/profile',
    },
    {
      name: 'Settings',
      href: '/user/settings',
    },
  ];

  return (
    <>
      {/* Click-outside backdrop — only present while the dropdown is open */}
      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[65px] flex items-center justify-between px-4 md:px-6 lg:px-8 bg-[#131313]/95 backdrop-blur-sm border-b border-[#53443c]">
        {/* Left */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="text-[#e4e2e1] text-xl sm:text-2xl font-black tracking-tight"
          >
            IRON & OAK
          </Link>
        </div>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2a2a2a] border border-[#53443c] flex items-center justify-center text-[#ffb68c] font-semibold">
            DP
          </div>

          <div>
            <p className="text-sm text-[#e4e2e1] font-medium">Dhruvik Panchal</p>

            <p className="text-[11px] text-[#a08d83]">Premium Member</p>
          </div>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="lg:hidden flex flex-col gap-1.5 p-1"
        >
          <span className="w-6 h-0.5 bg-[#e4e2e1]"></span>

          <span className="w-6 h-0.5 bg-[#e4e2e1]"></span>

          <span className="w-6 h-0.5 bg-[#e4e2e1]"></span>
        </button>

        {/* Mobile Dropdown */}
        <div
          className={`
            absolute top-[70px] right-4
            w-[240px]
            bg-[#1b1c1c]
            border border-[#53443c]
            rounded-2xl
            shadow-2xl
            overflow-hidden
            transition-all duration-300
            lg:hidden

            ${
              mobileMenu
                ? 'opacity-100 visible translate-y-0'
                : 'opacity-0 invisible -translate-y-3'
            }
          `}
        >
          {/* Profile */}
          <div className="p-5 border-b border-[#53443c]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#2a2a2a] border border-[#53443c] flex items-center justify-center text-[#ffb68c] font-semibold">
                DP
              </div>

              <div>
                <p className="text-[#e4e2e1] font-medium">Dhruvik Panchal</p>

                <p className="text-[#a08d83] text-xs">Premium Member</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex flex-col p-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenu(false)}
                className="px-4 py-3 rounded-xl text-[#d8c2b7] hover:bg-[#242525] hover:text-[#ffb68c] transition-all"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-[#53443c] gap-2 flex flex-col">
            <button className="w-full bg-[#ffb68c] text-[#532200] py-3 rounded-xl font-semibold hover:opacity-90">
              LOGOUT
            </button>
            <button
              onClick={() => setMobileMenu(false)}
              className="w-full bg-[#ffb68c] text-[#532200] py-3 rounded-xl font-semibold hover:opacity-90"
            >
              Close Menu
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
