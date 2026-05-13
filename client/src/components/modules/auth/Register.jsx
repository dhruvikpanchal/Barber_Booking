'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { register } from '@/constants/ImagePath.js';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [password, setPassword] = useState('');

  const getStrength = () => {
    if (password.length < 4) return 0;
    if (password.length < 7) return 1;
    if (password.length < 10) return 2;
    return 3;
  };

  const strength = getStrength();

  const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <section className="bg-[#131313] text-[#e4e2e1] min-h-screen flex">
      {/* Left Side */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="relative w-full h-full overflow-hidden">
          <Image
            src={register}
            alt="barber"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 420px"
            className="object-cover grayscale brightness-[0.3]"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#131313]/80"></div>

        <div className="absolute bottom-12 left-12 right-12">
          <span className="text-[#ffb68c] tracking-[0.3em] block mb-4 text-xs font-semibold">
            JOIN THE BROTHERHOOD
          </span>

          <h2 className="text-5xl font-bold mb-4">Your first cut awaits.</h2>

          <p className="text-[#d8c2b7] leading-relaxed">
            Create your account to book with our master barbers, track your style history, and earn
            loyalty rewards.
          </p>

          <div className="mt-8 flex gap-8">
            <div>
              <span className="text-[#ffb68c] text-3xl font-bold block">Free</span>

              <span className="text-[10px] text-[#a08d83] tracking-[0.1em]">TO JOIN</span>
            </div>

            <div>
              <span className="text-[#ffb68c] text-3xl font-bold block">Instant</span>

              <span className="text-[10px] text-[#a08d83] tracking-[0.1em]">BOOKING</span>
            </div>

            <div>
              <span className="text-[#ffb68c] text-3xl font-bold block">Points</span>

              <span className="text-[10px] text-[#a08d83] tracking-[0.1em]">REWARDS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <Link
            href="/"
            className="text-3xl font-black tracking-tight text-[#e4e2e1] hover:text-[#ffb68c] transition-colors mb-12 block lg:hidden"
          >
            IRON &amp; OAK
          </Link>

          <span className="text-[#a08d83] block mb-3 text-xs tracking-[0.1em]">NEW CLIENT</span>

          <h1 className="text-5xl font-bold mb-10">Create Account</h1>

          <form className="space-y-5">
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#d8c2b7] block mb-2 text-xs tracking-[0.1em]">
                  FIRST NAME
                </label>

                <input
                  type="text"
                  placeholder="James"
                  className="w-full bg-[#1f2020] border border-[#53443c] px-4 py-3 text-[#e4e2e1] focus:outline-none focus:border-[#ffb68c] placeholder:text-[#d8c2b7]/40"
                />
              </div>

              <div>
                <label className="text-[#d8c2b7] block mb-2 text-xs tracking-[0.1em]">
                  LAST NAME
                </label>

                <input
                  type="text"
                  placeholder="Wilson"
                  className="w-full bg-[#1f2020] border border-[#53443c] px-4 py-3 text-[#e4e2e1] focus:outline-none focus:border-[#ffb68c] placeholder:text-[#d8c2b7]/40"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[#d8c2b7] block mb-2 text-xs tracking-[0.1em]">
                EMAIL ADDRESS
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#1f2020] border border-[#53443c] px-4 py-3 text-[#e4e2e1] focus:outline-none focus:border-[#ffb68c] placeholder:text-[#d8c2b7]/40"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-[#d8c2b7] block mb-2 text-xs tracking-[0.1em]">
                PHONE NUMBER
              </label>

              <input
                type="tel"
                placeholder="+1 (212) 555-0100"
                className="w-full bg-[#1f2020] border border-[#53443c] px-4 py-3 text-[#e4e2e1] focus:outline-none focus:border-[#ffb68c] placeholder:text-[#d8c2b7]/40"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-[#d8c2b7] block mb-2 text-xs tracking-[0.1em]">PASSWORD</label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1f2020] border border-[#53443c] px-4 py-3 pr-12 text-[#e4e2e1] focus:outline-none focus:border-[#ffb68c] placeholder:text-[#d8c2b7]/40"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d8c2b7]"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>

              {/* Strength Bar */}
              <div className="mt-2 flex gap-1">
                {[0, 1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className={`flex-1 h-1 transition-colors ${
                      item <= strength ? strengthColors[strength] : 'bg-[#53443c]'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[#d8c2b7] block mb-2 text-xs tracking-[0.1em]">
                CONFIRM PASSWORD
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  className="w-full bg-[#1f2020] border border-[#53443c] px-4 py-3 pr-12 text-[#e4e2e1] focus:outline-none focus:border-[#ffb68c] placeholder:text-[#d8c2b7]/40"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d8c2b7]"
                >
                  {showConfirmPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 pt-2">
              <input type="checkbox" className="w-4 h-4 mt-1 accent-[#ffb68c]" />

              <p className="text-[11px] text-[#d8c2b7] leading-relaxed">
                I AGREE TO THE{' '}
                <Link href="#" className="text-[#ffb68c] hover:underline">
                  TERMS OF SERVICE
                </Link>{' '}
                AND{' '}
                <Link href="#" className="text-[#ffb68c] hover:underline">
                  PRIVACY POLICY
                </Link>
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#ffb68c] text-[#532200] py-4 text-xs font-semibold tracking-[0.2em] hover:opacity-90 transition-all active:scale-95"
            >
              CREATE ACCOUNT
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-[#d8c2b7] mt-8">
            Already a member?{' '}
            <Link href="/login" className="text-[#ffb68c] hover:opacity-70 transition">
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
