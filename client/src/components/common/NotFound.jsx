import { Link } from 'react-router-dom';
import { images } from '../../config/imagePath.js';

function NotFound() {
  return (
    <div className="min-h-screen w-full grid place-items-center p-8 bg-linear-to-br from-slate-50 to-indigo-50">
      <div className="text-center max-w-[900px] w-full">
        <h1 className="text-[2.5rem] font-extrabold mb-2">404 - Page Not Found</h1>

        <p className="text-slate-500 mb-7">The page you are looking for doesn't exist.</p>

        <video
          className="w-full max-w-[750px] h-auto rounded-[18px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-gray-200 bg-white p-3 mx-auto mb-8 object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={images.notFound} type="video/mp4" />
        </video>

        <Link
          to="/"
          className="inline-block bg-blue-800 text-white px-9 py-3 rounded-full font-extrabold text-base transition-all duration-200 hover:-translate-y-1 hover:bg-blue-900 shadow-md"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
