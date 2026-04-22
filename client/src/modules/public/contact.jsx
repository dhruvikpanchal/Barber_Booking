import React, { useEffect } from 'react';
import { images } from '../../config/imagePath.js';
import { Mail, NotebookPen, Phone, SquareStack, UserRound } from 'lucide-react';
import { useLocation } from 'react-router-dom';

function Contact() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  return (
    <div className="flex flex-col w-full">
      {/* first */}
      <section className="flex flex-col justify-center items-center w-full bg-[#422A3C] min-h-[320px] sm:min-h-[420px] lg:min-h-[495px] px-4 py-10 sm:py-14">
        <div className="flex flex-col justify-center items-center gap-4 sm:gap-5 text-center">
          <p className="text-[#ECBFD3] text-sm sm:text-base">GET IN TOUCH WITH US</p>
          <p className="text-white text-3xl sm:text-4xl lg:text-5xl">We Are Ready To Assist</p>
          <p className="text-white text-3xl sm:text-4xl lg:text-5xl">You In 24x7</p>
        </div>
      </section>

      {/* second */}
      <section className="flex flex-col justify-center items-center w-full gap-10 sm:gap-14 lg:gap-20 px-4 sm:px-8 lg:px-20 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-7xl gap-8 lg:gap-12">
          <div className="">
            <img src={images.ci4} alt="ci4" className="w-full max-w-md lg:max-w-none mx-auto" />
          </div>
          <div className="flex flex-col gap-4 sm:gap-5">
            <p className="text-base">Get in Touch!</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">We are here to help</h1>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">you always...</h1>
            <p className="text-base sm:text-lg ">
              There are many variations of passages of Lorem Ipsum available, but the majority have
              suffered alteration in some form, buying to many desktop publishing packages.
            </p>
            <div className="flex flex-row gap-4 sm:gap-5">
              <div className="border p-3 sm:p-5 rounded-xl shrink-0">
                <img src={images.ci3} alt="" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-5">
                <h1 className="font-bold text-xl">Visit Us :</h1>
                <p className="text-base sm:text-lg">Mariendalsvej 50D 2 2000 Frederiksberg.</p>
              </div>
            </div>
            <div className="flex flex-row gap-4 sm:gap-5">
              <div className="border p-3 sm:p-5 rounded-xl shrink-0">
                <img src={images.ci2} alt="" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-5">
                <h1 className="font-bold text-xl">Drop Us :</h1>
                <p className="text-base sm:text-lg break-all">support@beautyness.com</p>
              </div>
            </div>
            <div className="flex flex-row gap-4 sm:gap-5">
              <div className="border p-3 sm:p-5 rounded-xl shrink-0">
                <img src={images.ci1} alt="" />
              </div>
              <div className="flex flex-col gap-2 sm:gap-5">
                <h1 className="font-bold text-xl">Call Us :</h1>
                <p className="text-base sm:text-lg">Call: 1-800-123-9999</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* form */}
      <section className="w-full bg-[#F3EEDD] py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4 md:gap-6 text-center">
          <p className="text-[#BA7894] uppercase tracking-[0.18em] text-xs md:text-sm font-medium" id="contact-form">
            Schedule Your Presence
          </p>
          <h2 className="text-[#422A3C] text-4xl md:text-5xl font-bold" >Get in touch</h2>
          <p className="text-[#6C6670] max-w-xl text-sm md:text-base">
            There are many variations of passages of Lorem Ipsum available, but the majority have
            suffered alteration in some form.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-10 md:mt-12 bg-[#F6F6F6] rounded-2xl shadow-[0_24px_50px_rgba(57,35,50,0.14)] p-6 md:p-10">
          <form className="flex flex-col gap-3 md:gap-4" >
            <div className="flex items-center gap-3 border border-[#B7B2B8] rounded-sm px-3 h-12 bg-transparent">
              <UserRound size={16} className="text-[#4E3A4A]" />
              <input
                type="text"
                placeholder="Name"
                className="w-full bg-transparent outline-none text-[#4E3A4A] placeholder:text-[#6F6870] text-sm"
              />
            </div>

            <div className="flex items-center gap-3 border border-[#B7B2B8] rounded-sm px-3 h-12 bg-transparent">
              <Mail size={16} className="text-[#4E3A4A]" />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent outline-none text-[#4E3A4A] placeholder:text-[#6F6870] text-sm"
              />
            </div>

            <div className="flex items-center gap-3 border border-[#B7B2B8] rounded-sm px-3 h-12 bg-transparent">
              <Phone size={16} className="text-[#4E3A4A]" />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full bg-transparent outline-none text-[#4E3A4A] placeholder:text-[#6F6870] text-sm"
              />
            </div>

            <div className="flex items-center gap-3 border border-[#B7B2B8] rounded-sm px-3 h-12 bg-transparent">
              <SquareStack size={16} className="text-[#4E3A4A]" />
              <input
                type="text"
                placeholder="Service You Need"
                className="w-full bg-transparent outline-none text-[#4E3A4A] placeholder:text-[#6F6870] text-sm"
              />
            </div>

            <div className="flex items-start gap-3 border border-[#B7B2B8] rounded-sm px-3 py-3 bg-transparent">
              <NotebookPen size={16} className="text-[#4E3A4A] mt-0.5" />
              <textarea
                rows="3"
                placeholder="Any Note For Us"
                className="w-full bg-transparent outline-none resize-none text-[#4E3A4A] placeholder:text-[#6F6870] text-sm"
              />
            </div>

            <button
              type="submit"
              className="mt-1 h-12 bg-[#422A3C] text-white uppercase tracking-[0.15em] text-xs font-semibold"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Contact;
