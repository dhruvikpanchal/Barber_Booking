import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900">Forgot Password</h2>
          <p className="text-sm text-gray-500 mt-2">
            Enter your email and we’ll send you a reset link
          </p>
        </div>

        {/* Form */}
        <form className="mt-6 flex flex-col gap-4">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 w-full h-11 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to Login */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Remember your password?{' '}
          <Link to="/auth/login" className="text-black hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
