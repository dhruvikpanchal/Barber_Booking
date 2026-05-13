'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { i1, i2, i3, i4, i5, i6, i7 } from '@/constants/ImagePath';

export default function UserSidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      icon: i1,
      name: 'Overview',
      href: '/user/overview',
    },
    {
      icon: i2,
      name: 'My Bookings',
      href: '/user/my-bookings',
    },
    {
      icon: i3,
      name: 'Booking History',
      href: '/user/booking-history',
    },
    {
      icon: i4,
      name: 'Favorite Barber',
      href: '/user/favorite-barber',
    },
    {
      icon: i7,
      name: 'Add Appoitment',
      href: '/user/add-appoitment',
    },
    {
      icon: i6,
      name: 'Profile',
      href: '/user/profile',
    },
    {
      icon: i5,
      name: 'Settings',
      href: '/user/settings',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`
          fixed inset-0 z-[60]
          bg-black/70
          transition-all duration-300
          lg:hidden

          ${sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-[65px] left-0 z-[70]
          h-[calc(100vh-65px)]
          w-[260px]
          bg-[#1b1c1c]
          border-r border-[#53443c]
          flex flex-col
          transition-transform duration-300

          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}

          lg:translate-x-0
        `}
      >
        {/* Top */}
        <div className="p-6 border-b border-[#53443c]">
          <p className="text-[#a08d83] text-xs tracking-[0.2em] mt-2">ACCOUNT DASHBOARD</p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  px-4 py-3 rounded-xl
                  text-sm font-medium tracking-wide
                  transition-all duration-200

                  ${
                    isActive
                      ? 'bg-[#ffb68c] text-[#532200]'
                      : 'text-[#d8c2b7] hover:bg-[#242525] hover:text-[#ffb68c]'
                  }
                `}
              >
                <div className="flex flex-row items-center gap-2">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={16}
                    height={16}
                    className={`w-4 h-4 ${
                      isActive ? 'invert brightness-100' : 'invert brightness-0'
                    }`}
                  />

                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="mt-auto p-4 border-t border-[#53443c]">
          <button className="w-full border border-[#532200] bg-[#ffb68c] text-[#532200] py-3 rounded-xl text-sm font-semibold tracking-wide hover:border-[#ffb68c] hover:text-[#ffb68c] transition-all duration-200">
            LOGOUT
          </button>
        </div>
      </aside>
    </>
  );
}
