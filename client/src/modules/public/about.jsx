import { images } from '../../config/imagePath.js';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="flex flex-col w-full">
      {/* first */}
      <section className="flex flex-col justify-center items-center w-full bg-[#422A3C] min-h-[320px] sm:min-h-[420px] lg:min-h-[495px] px-4 py-10 sm:py-14">
        <div className="flex flex-col justify-center items-center gap-4 sm:gap-5 text-center">
          <p className="text-[#ECBFD3] text-sm sm:text-base">SHORT STORY ABOUT US</p>
          <p className="text-white text-3xl sm:text-4xl lg:text-5xl">The big story behind, our</p>
          <p className="text-white text-3xl sm:text-4xl lg:text-5xl">beautyness center</p>
          <Link
            to="/contact#contact-form"
            className="px-6 sm:px-8 py-3 sm:py-5 bg-[#BA7894] text-white text-base sm:text-xl inline-flex"
          >
            CONTACT US
          </Link>
        </div>
      </section>

      {/* our value */}
      <section className="flex flex-col justify-center items-center w-full gap-10 sm:gap-16 lg:gap-20 px-4 sm:px-8 lg:px-20 py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col gap-10 sm:gap-16 lg:gap-20 w-full max-w-4xl">
          <div className="flex flex-col gap-4 sm:gap-5">
            <p className="text-[#BA7894] text-base text-center">Our Values</p>
            <p className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center">
              The work values we thrive for
            </p>
          </div>
          <div className="flex flex-col gap-8 sm:gap-12 lg:gap-16 w-full">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <img src={images.ai3} alt="ai3" className="w-16 h-16 object-contain" />
              <div className="flex flex-col gap-3 sm:gap-5">
                <h1 className="font-bold text-xl">Beauty Experts</h1>
                <p className="text-base sm:text-lg">
                  The majority have suffered alteration in some form, buying to injected humour, or
                  randomised words which desktop publishing packages.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <img src={images.ai4} alt="ai4" className="w-16 h-16 object-contain" />
              <div className="flex flex-col gap-3 sm:gap-5">
                <h1 className="font-bold text-xl">Great Services</h1>
                <p className="text-base sm:text-lg">
                  The majority have suffered alteration in some form, buying to injected humour, or
                  randomised words which desktop publishing packages.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
              <img src={images.ai5} alt="ai5" className="w-16 h-16 object-contain" />
              <div className="flex flex-col gap-3 sm:gap-5">
                <h1 className="font-bold text-xl">100% Genuine</h1>
                <p className="text-base sm:text-lg">
                  The majority have suffered alteration in some form, buying to injected humour, or
                  randomised words which desktop publishing packages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* about */}
      <section className="w-full bg-[#F3EEDD] py-12 sm:py-16 md:py-24 overflow-visible">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="relative bg-[#422A3C] min-h-[360px] md:min-h-[460px] overflow-visible">
            <div className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 md:left-10 lg:left-14 z-20 overflow-visible">
              <img src={images.ai2} alt="about" className="w-[280px] lg:w-[420px] h-[380px] lg:h-[550px] object-cover" />
            </div>
            <div className="md:hidden px-6 pt-8">
              <img src={images.ai2} alt="about" className="w-full max-w-xs mx-auto h-[320px] object-cover" />
            </div>
            <div className="px-6 md:pl-[320px] lg:pl-[500px] md:pr-8 lg:pr-6 py-8 md:py-10">
              <p className="text-[#D9CBD6] text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
                About Us
              </p>
              <h1 className="text-white font-semibold leading-tight text-3xl md:text-5xl max-w-xl mb-6">
                It&apos;s the bridge between service companies and consumers.
              </h1>
              <p className="text-[#CDBFCC] text-sm md:text-lg leading-7 max-w-xl">
                ServiceMarket.dk is a Copenhagen-based technology company known for our overview
                platform. Our aim is to simplify and improve everyday life for citizens in Denmark.
                One platform that brings together all services in an easy and controlled
                environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* what include */}
      <section className="flex flex-col justify-between items-center w-full py-12 sm:py-16 lg:py-20 gap-10 sm:gap-14 lg:gap-20 px-4 sm:px-8 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-20 w-full max-w-7xl">
          <div className="flex flex-col gap-5">
            <p className="text-[#BA7894] text-xl">What Includes?</p>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold">The start of the journey</h1>
            <p className="text-base sm:text-lg">
              ServiceMarket.dk was founded in 2021 by two young entrepreneurs who saw a problem with
              the fragmented service industry in Denmark. There were thousands of small businesses
              offering services, but it was difficult for consumers to find them and know which ones
              to choose. They developed the idea of creating a platform that would bring all these
              service providers together in one place, making it easier for consumers to find what
              they need and get their issues resolved quickly and easily. Without having to go to
              many different websites, each with their own booking system.
            </p>
            <p className="text-2xl font-bold">Our Methodology :</p>
            <div className="flex flex-col gap-5 ">
              <div className="grid grid-cols-[40px_1fr] gap-5">
                <div className="">
                  <img src={images.point} alt="" />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="font-bold text-xl">The Assessment Stage</h1>
                  <p className="text-base sm:text-lg">
                    The point of using Lorem Ipsum is that it has a more-or-less normal letters.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[40px_1fr] gap-5">
                <div className="">
                  <img src={images.point} alt="" />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="font-bold text-xl">The Initialisation Stage</h1>
                  <p className="text-base sm:text-lg">
                    The point of using Lorem Ipsum is that it has a more-or-less normal letters.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-[40px_1fr] gap-5">
                <div className="">
                  <img src={images.point} alt="" />
                </div>
                <div className="flex flex-col gap-2">
                  <h1 className="font-bold text-xl">The Treatment Stage</h1>
                  <p className="text-base sm:text-lg">
                    The point of using Lorem Ipsum is that it has a more-or-less normal letters.The
                    point of using Lorem Ipsum is that it has a more-or-less normal letters.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-first lg:order-none">
            <img src={images.ai1} alt="" className="w-full max-w-md lg:max-w-none mx-auto" />
          </div>
        </div>
      </section>

      {/* customer say */}
      <section className="flex flex-col justify-between items-center w-full bg-[#F0F0F0] py-12 sm:py-16 lg:py-20 gap-8 sm:gap-12 lg:gap-20 px-4 sm:px-6">
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
    </div>
  );
}

export default About;
