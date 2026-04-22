import React from 'react';

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900">Reset Password</h2>
          <p className="text-sm text-gray-500 mt-2">Enter your new password below</p>
        </div>

        {/* Form */}
        <form className="mt-6 flex flex-col gap-4">
          {/* New Password */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full h-11 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Reset Password
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Back to{' '}
          <a href="#" className="text-black hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
