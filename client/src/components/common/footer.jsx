import { images } from '../../config/imagePath.js';

function Footer() {
  return (
    <div className="flex flex-col w-full justify-between items-center">
      <div
        className="w-full px-4 sm:px-8 lg:px-16 py-12 sm:py-16"
        style={{ background: 'var(--color-f1)', color: 'var(--color-white)' }}
      >
        <div className="flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start lg:items-center gap-6">
            {/* logo and name */}
            <div className="flex flex-row gap-2 justify-center items-center">
              <img src={images.logo2} alt="logo2" className="" />
              <p className="text-white font-bold text-2xl">Vector</p>
            </div>

            {/* icons and links */}
            <div className="flex flex-row flex-wrap justify-center sm:justify-start gap-1">
              <div className="">
                <a href="#facebook" className="">
                  <img src={images.icon1} alt="icon1" className="" />
                </a>
              </div>
              <div className="">
                <a href="#twitter" className="">
                  <img src={images.icon2} alt="icon2" className="" />
                </a>
              </div>
              <div className="">
                <a href="#linkdin" className="">
                  <img src={images.icon3} alt="icon3" className="" />
                </a>
              </div>
              <div className="">
                <a href="#instagram" className="">
                  <img src={images.icon4} alt="icon4" className="" />
                </a>
              </div>
            </div>
          </div>

          {/* divider */}
          <hr className="w-full text-white" style={{}} />

          {/* text info container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center sm:text-left">
            {/* pages links */}
            <div className="flex flex-col gap-3">
              <h1 className="text-xl font-bold">Explore</h1>
              <div className="flex flex-col gap-1 text-sm sm:text-base">
                <a href="#home" className="">
                  Home
                </a>
                <a href="#about" className="">
                  About
                </a>
                <a href="#services" className="">
                  Services
                </a>
                <a href="#blog" className="">
                  Blog
                </a>
                <a href="#contact" className="">
                  Contact
                </a>
              </div>
            </div>

            {/* service pages */}
            <div className="flex flex-col gap-3">
              <h1 className="text-xl font-bold">Utility Pages</h1>
              <div className="flex flex-col gap-1 text-sm sm:text-base">
                <a href="#policy" className="">
                  Privacy Policy
                </a>
                <a href="#terms" className="">
                  Terms of Use
                </a>
              </div>
            </div>

            {/* contact pages */}
            <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
              <h1 className="text-xl font-bold">Keep in Touch</h1>

              {/* email , phone , address */}
              <div className="flex flex-col gap-2 text-sm sm:text-base">
                <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] gap-1 sm:gap-2">
                  <p>Address :</p>
                  <p>Mariendalsvej 50D 2 2000 Frederiksberg.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] gap-1 sm:gap-2">
                  <p>Email :</p>
                  <p className="break-all sm:break-normal">support@servicemarket.com</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[90px_1fr] gap-1 sm:gap-2">
                  <p>Phone :</p>
                  <p>(+22) 123 - 4567 - 900</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex w-full justify-center items-center text-center px-4 py-3 text-sm sm:text-base"
        style={{ background: 'var(--color-f2)', color: 'var(--color-white)' }}
      >
        ©️ 2026, ServiceMarket.dk | All rights reserved.
      </div>
    </div>
  );
}

export default Footer;
