import { Link } from 'react-router-dom';

export default function Example() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <form className="flex flex-col">
          {/* Title */}
          <h2 className="text-3xl font-semibold text-gray-900 text-center">Sign in</h2>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Welcome back! Please sign in to continue
          </p>

          {/* Google Button */}
          <button
            type="button"
            className="w-full mt-6 flex items-center justify-center gap-2 h-12 rounded-full border border-gray-300 hover:bg-gray-100 transition"
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="googleLogo"
            />
            <span className="text-sm text-gray-700">Sign in with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 w-full my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="text-xs text-gray-500 whitespace-nowrap">or sign in with email</p>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Email */}
          <div className="flex items-center border border-gray-300 rounded-lg h-12 px-4 gap-2">
            <input
              type="email"
              placeholder="Email"
              className="w-full outline-none text-sm"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center mt-4 border border-gray-300 rounded-lg h-12 px-4 gap-2">
            <input
              type="password"
              placeholder="Password"
              className="w-full outline-none text-sm"
              required
            />
          </div>

          {/* Options */}
          <div className="flex items-center justify-between mt-6 text-sm text-gray-500">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Remember me
            </label>
            <Link to="/auth/forget-password" className="hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="mt-6 w-full h-11 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Login
          </button>

          {/* Footer */}
          <p className="text-sm text-gray-500 text-center mt-4">
            Don’t have an account?{' '}
            <Link to="/auth/register" className="text-black hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
