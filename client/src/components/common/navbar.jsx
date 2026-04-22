import { images } from '../../config/imagePath.js';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();

    // TODO(backend): enable server-side logout after backend is ready.
    // await logout();

    navigate('/');
    setIsMenuOpen(false);
  };
  return (
    <div className="bg-white w-full px-4 sm:px-6 lg:px-10 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        {/* top row */}
        {/* <div className="flex items-center justify-center gap-3"> */}
        <img src={images.logo} alt="logo" />
        <p className="text-2xl sm:text-3xl font-serif flex-1" style={{ color: 'var(--color-l1)' }}>
          STYLICLE
        </p>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="lg:hidden border border-gray-300 rounded-md p-2"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        {/* </div> */}

        {/* desktop */}
        <div className="hidden lg:flex items-center justify-between mt-3 gap-5">
          <div className="flex items-center justify-center gap-5 text-base">
            <Link to="/" className="hover:text-blue-700">
              Home
            </Link>
            <Link to="/about" className="hover:text-blue-700">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-blue-700">
              Contact Us
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="border border-black bg-black rounded-lg px-4 py-2 text-base font-bold text-white hover:bg-white hover:border-black hover:text-black hover:cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/auth/login')}
                  className="border border-black bg-white rounded-lg px-4 py-2 text-base font-bold text-black hover:bg-black hover:border-white hover:text-white hover:cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/auth/register')}
                  className="border border-black bg-black rounded-lg px-4 py-2 text-base font-bold text-white hover:bg-white hover:border-black hover:text-black hover:cursor-pointer "
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {/* phone + tablet menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-3 border border-gray-200 rounded-lg p-4 flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-blue-700 text-sm sm:text-base"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-blue-700 text-sm sm:text-base"
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-blue-700 text-sm sm:text-base"
            >
              Contact Us
            </Link>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="border border-black bg-black rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base font-bold text-white hover:bg-white hover:border-black hover:text-black hover:cursor-pointer"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    navigate('#login');
                    setIsMenuOpen(false);
                  }}
                  className="border border-black bg-white rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base font-bold text-black hover:bg-black hover:border-white hover:text-white hover:cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('#register');
                    setIsMenuOpen(false);
                  }}
                  className="border border-black bg-black rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base font-bold text-white hover:bg-white hover:border-black hover:text-black hover:cursor-pointer "
                >
                  Register
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
