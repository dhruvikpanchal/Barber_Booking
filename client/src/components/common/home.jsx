import { useState } from 'react';
import { images } from '../../config/imagePath.js';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SalonCard from '../UI/card.jsx';
import { options, salons } from '../../config/data.js';

function Home() {
  const [start, setStart] = useState(0);

  const visibleItems = options.slice(start, start + 6);

  const next = () => {
    if (start + 6 < options.length) {
      setStart(start + 1);
    }
  };

  const prev = () => {
    if (start > 0) {
      setStart(start - 1);
    }
  };

  return (
    <div className="flex flex-col w-full gap-8 sm:gap-10">
      {/* search */}
      <section className="w-full ">
        <div className="relative w-full min-h-[460px] sm:min-h-[520px] lg:min-h-[620px] overflow-hidden">
          {/* Background Image */}
          <img
            src={images.banner1}
            alt="banner"
            className="absolute top-0 right-0 h-full w-full object-cover"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#422A3C] via-[#422A3CD9] via-[#422A3C99] to-transparent"></div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="w-full max-w-3xl px-5 sm:px-8 lg:px-14 py-12 sm:py-16 lg:py-20 text-white">
              <p className="text-xs sm:text-sm tracking-wider uppercase mb-3 sm:mb-4">
                Hair salon, masseuse, beauty salon
              </p>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif leading-tight mb-4 sm:mb-6">
                Find a service
                <br />
                close to you
              </h1>

              <p className="text-sm sm:text-base text-gray-200 max-w-xl mb-8 sm:mb-10">
                There are many variations of passages available, but most have suffered alteration
                in some form.
              </p>

              {/* Search Box */}
              <div className="w-full max-w-2xl rounded-full p-2 bg-white shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Service Name"
                    className="w-full px-4 py-3 rounded-full border border-gray-200 text-sm text-gray-800 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Address"
                    className="w-full px-4 py-3 rounded-full border border-gray-200 text-sm text-gray-800 outline-none"
                  />

                  <button
                    type="button"
                    className="px-6 py-3 rounded-full font-semibold text-white hover:opacity-90 transition"
                    style={{ background: 'var(--color-l1)' }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* services */}
      <section className="py-8 sm:py-10 w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          {/* Left Arrow */}
          <button onClick={prev} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <ChevronLeft />
          </button>

          {/* Options */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-row gap-4 sm:gap-8 lg:gap-12">
            {visibleItems.map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center min-w-[110px]">
                <img src={item.img} alt={item.name} className="w-12 h-12 sm:w-16 sm:h-16" />
                <p className="mt-2 text-xs sm:text-sm">{item.name}</p>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button onClick={next} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
            <ChevronRight />
          </button>
        </div>
      </section>

      {/* experience with images */}
      <section className="bg-[#F0F0F0] py-12 sm:py-16 lg:py-20 flex flex-col gap-8 sm:gap-10 px-4 sm:px-8 lg:px-20">
        <div className="flex flex-col gap-2">
          <p className="text-2xl sm:text-3xl lg:text-4xl text-black text-center font-bold">
            We are Experienced in making you
          </p>
          <p className="text-2xl sm:text-3xl lg:text-4xl text-black text-center font-bold"> very Beautiful</p>
          <p className="text-base sm:text-lg lg:text-xl text-black text-center">
            Lorem ipsum dolor sit amet consectetur. Eu quis enim tempor et proin neque.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-4 sm:gap-5 rounded-2xl overflow-hidden">
          <div className="">
            <img src={images.s1} alt="" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col gap-5">
            <img src={images.s2} alt="" className="w-full h-full object-cover" />
            <img src={images.s3} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-5">
            <img src={images.s4} alt="" className="w-full h-full object-cover" />
            <img src={images.s5} alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Recommended */}
      <section className="flex flex-col w-full gap-8 sm:gap-10 px-4 sm:px-8 lg:px-20 py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col gap-2">
          <p className="text-center text-base sm:text-xl text-[#BA7894]">Subheading</p>
          <p className="text-center text-2xl sm:text-3xl lg:text-4xl font-bold text-[#422A3C]">
            Recommended
          </p>
          <p className="text-center text-sm sm:text-base text-[#555555]">
            Lorem ipsum dolor sit amet consectetur. Eu quis enim tempor et proin neque.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {salons.map((salon, index) => (
            <SalonCard key={index} {...salon} />
          ))}
        </div>
      </section>

      {/* customer say */}
      <section className="flex flex-col justify-between items-center w-full bg-[#F0F0F0] py-12 sm:py-16 lg:py-20 gap-8 sm:gap-12 px-4 sm:px-6">
        <div className="flex flex-col gap-2">
          <p className="text-[#BA7894] text-base sm:text-xl text-center">Testimonials</p>
          <p className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center">
            What our Customers says...
          </p>
        </div>
        <div
          className="bg-[#422A3C] border border-white rounded-xl overflow-hidden w-full max-w-5xl"
          style={{ backgroundImage: `url(${images.user_say1})` }}
        >
          <img src={images.user_say1} alt="user_say1" className="object-fill w-full h-full" />
        </div>
      </section>

      {/* register */}
      <section className="flex flex-col px-4 sm:px-8 lg:px-20 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-center text-center space-y-2 gap-8 lg:gap-16 py-4 sm:py-8">
          <div className="">
            <img
              src={images.banner2}
              alt="banner"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex flex-col gap-4 sm:gap-5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-start">
              Subscribe to newsletter
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-500/70 pb-4 sm:pb-8 text-start">
              Sign up for our newsletter to stay up-to-date on the latest promotions, discounts, and
              new features releases.
            </p>
            <form className="relative flex flex-col sm:flex-row sm:items-center gap-2 rounded-3xl border border-slate-200 p-2 mt-2 sm:mt-6 text-sm max-w-xl w-full">
              <svg
                className="absolute left-5 top-[18px] sm:top-1/2 sm:-translate-y-1/2"
                width="19"
                height="17"
                viewBox="0 0 19 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 6 9.505 8.865a1 1 0 0 1-1.005 0L4 6"
                  stroke="#90A1B9"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.3 1H2.7C1.761 1 1 1.84 1 2.875v11.25C1 15.161 1.761 16 2.7 16h13.6c.939 0 1.7-.84 1.7-1.875V2.875C18 1.839 17.239 1 16.3 1"
                  stroke="#90A1B9"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="focus:outline-none pl-10 py-3 sm:py-4 bg-transparent w-full"
                required
              />
              <button className="shrink-0 px-5 sm:px-6 py-3 text-sm bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl active:scale-95 transition duration-300 text-white w-full sm:w-auto">
                Subscribe now
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
