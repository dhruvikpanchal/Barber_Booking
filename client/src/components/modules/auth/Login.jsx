'use client';

import Link from 'next/link';
import Image from 'next/image';
import { login } from '@/constants/ImagePath.js';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="bg-[#131313] text-[#e4e2e1] min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={login}
            alt="barbershop"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 420px"
            fill
            className="object-cover grayscale brightness-[0.35]"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#131313]/80"></div>

        <div className="absolute bottom-12 left-12 right-12">
          <span className="text-[#ffb68c] tracking-[0.3em] block mb-4 text-xs font-semibold">
            IRON &amp; OAK BARBERSHOP
          </span>

          <h2 className="text-5xl font-bold mb-4">Welcome back.</h2>

          <p className="text-[#d8c2b7] leading-relaxed">
            Sign in to manage your bookings and discover your next perfect cut.
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile Logo */}
          <Link
            href="/"
            className="text-3xl font-black tracking-tight text-[#e4e2e1] hover:text-[#ffb68c] transition-colors mb-12 block lg:hidden"
          >
            IRON &amp; OAK
          </Link>

          <span className="text-[#a08d83] block mb-3 text-xs tracking-[0.1em]">CLIENT PORTAL</span>

          <h1 className="text-5xl font-bold mb-10">Sign In</h1>

          {/* Error Alert */}
          <div className="hidden bg-[#93000a] border border-red-400/30 px-4 py-3 mb-6 items-center gap-3">
            <span className="material-symbols-outlined text-red-300 text-[20px]">error</span>

            <p className="text-[#ffdad6] text-[11px] tracking-[0.1em]">
              Invalid email or password.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-[#d8c2b7] block mb-2 text-xs tracking-[0.1em]">
                EMAIL ADDRESS
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#1f2020] border border-[#53443c] px-4 py-3 text-[#e4e2e1] focus:outline-none focus:border-[#ffb68c] transition-colors placeholder:text-[#d8c2b7]/40"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[#d8c2b7] text-xs tracking-[0.1em]">PASSWORD</label>

                <Link
                  href="/forgot-password"
                  className="text-[#ffb68c] hover:opacity-70 transition text-[10px] tracking-[0.1em]"
                >
                  FORGOT PASSWORD?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-[#1f2020] border border-[#53443c] px-4 py-3 pr-12 text-[#e4e2e1] focus:outline-none focus:border-[#ffb68c] transition-colors placeholder:text-[#d8c2b7]/40"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d8c2b7] hover:text-[#ffb68c] transition-colors"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4 accent-[#ffb68c]" />

              <label className="text-[#d8c2b7] text-xs tracking-[0.1em] cursor-pointer">
                REMEMBER ME
              </label>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#ffb68c] text-[#532200] py-4 text-xs font-semibold tracking-[0.2em] hover:opacity-90 transition-all active:scale-95"
            >
              SIGN IN
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-[#53443c]"></div>

            <span className="text-[#a08d83] text-[10px] tracking-[0.1em]">OTHER ROLES</span>

            <div className="flex-1 h-px bg-[#53443c]"></div>
          </div>

          {/* Role Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link
              href="#"
              className="border border-[#53443c] py-3 text-[#e4e2e1] hover:border-[#ffb68c] hover:text-[#ffb68c] transition-colors text-center text-[11px] tracking-[0.1em]"
            >
              BARBER LOGIN
            </Link>

            <Link
              href="#"
              className="border border-[#53443c] py-3 text-[#e4e2e1] hover:border-[#ffb68c] hover:text-[#ffb68c] transition-colors text-center text-[11px] tracking-[0.1em]"
            >
              ADMIN LOGIN
            </Link>
          </div>

          {/* Register */}
          <p className="text-center text-[#d8c2b7]">
            New client?{' '}
            <Link href="/register" className="text-[#ffb68c] hover:opacity-70 transition">
              CREATE ACCOUNT
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
