import React from 'react';
import { Link } from 'react-router-dom';

function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 shadow-lg">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-neutral-900">Create Account</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-black font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Google Button */}
        <button className="mt-6 w-full flex items-center justify-center gap-2 border border-neutral-300 rounded-lg py-3 text-sm font-medium hover:bg-neutral-100 transition">
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.4 0 6.4 1.2 8.8 3.5l6.6-6.6C35.5 2.3 30.2 0 24 0 14.7 0 6.5 5.4 2.7 13.3l7.9 6.1C12.5 13.3 17.8 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.5 2.7-2 5-4.2 6.6l6.6 5.1c3.8-3.5 6.4-8.7 6.4-16z"
            />
            <path
              fill="#FBBC05"
              d="M10.6 28.6c-.5-1.5-.8-3.1-.8-4.6s.3-3.1.8-4.6l-7.9-6.1C1 16.7 0 20.2 0 24s1 7.3 2.7 10.7l7.9-6.1z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.2 0 11.5-2 15.3-5.5l-6.6-5.1c-2 1.4-4.6 2.3-8.7 2.3-6.2 0-11.5-3.8-13.4-9.2l-7.9 6.1C6.5 42.6 14.7 48 24 48z"
            />
          </svg>
          Sign up with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-neutral-300"></div>
          <span className="px-3 text-xs text-neutral-400 uppercase">or</span>
          <div className="flex-1 border-t border-neutral-300"></div>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm text-neutral-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-neutral-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Enter password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-neutral-700 mb-1">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              placeholder="Confirm password"
            />
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2">
            <input type="checkbox" className="accent-black" />
            <span className="text-sm text-neutral-600">
              I agree to the{' '}
              <a href="#" className="underline">
                Terms
              </a>
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-neutral-800 transition"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
