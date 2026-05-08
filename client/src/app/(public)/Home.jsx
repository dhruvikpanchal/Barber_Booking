import Link from "next/link";
import Image from "next/image";
import { home, overService } from "@/constants/ImagePath.js";
import { barbers, services } from "../../constants/Data.js";
import ServiceCard from "../../components/ui/ServiceCard.jsx";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={home}
            alt="IRON & OAK luxury barbershop interior"
            fill
            className="object-cover grayscale brightness-[0.3]"
          />
        </div>

        <div className="relative z-10 text-center px-4 md:px-16 max-w-[900px]">
          <span className="text-[#ffb68c] tracking-[0.4em] block mb-4 text-xs font-semibold">
            ESTABLISHED MMXXIV · STEEL DISTRICT, NEW YORK
          </span>

          <h1 className="text-[56px] md:text-[84px] text-[#e4e2e1] mb-6 leading-tight font-black">
            PRECISION
            <br />
            &amp; HERITAGE
          </h1>

          <p className="text-[#c8c6c5] mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
            Experience the art of modern grooming in an atmosphere of timeless
            craftsmanship.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="#"
              className="bg-[#ffb68c] text-[#532200] px-10 py-4 text-xs font-semibold tracking-[0.2em]"
            >
              BOOK YOUR APPOINTMENT
            </Link>

            <Link
              href="#"
              className="border border-[#a08d83] text-[#e4e2e1] px-10 py-4 text-xs font-semibold tracking-[0.2em]"
            >
              VIEW SERVICES
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="bg-[#1b1c1c] border-y border-[#53443c] py-4 overflow-hidden">
        <div className="flex min-w-max animate-marquee">
          {[
            "PRECISION CUTS",
            "STRAIGHT RAZOR SHAVES",
            "BEARD SCULPTING",
            "HOT TOWEL TREATMENTS",
            "MASTER BARBERS",
            "EST. 2026",
            "PRECISION CUTS",
            "STRAIGHT RAZOR SHAVES",
            "BEARD SCULPTING",
            "HOT TOWEL TREATMENTS",
            "MASTER BARBERS",
            "EST. 2026",
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-6 mr-16 whitespace-nowrap"
            >
              <span className="text-[#a08d83] tracking-[0.3em] text-xs">
                {item}
              </span>

              <span className="text-[#ffb68c]">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story */}
      <section className="py-32 px-4 md:px-16 bg-[#131313]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 relative">
            <div className="border-2 border-[#a08d83] p-4 inline-block absolute -top-8 -left-4 bg-[#131313] z-10">
              <span className="text-[#ffb68c] text-3xl font-bold">15+</span>

              <p className="text-[10px] text-[#d8c2b7] tracking-[0.1em]">
                YEARS OF MASTERY
              </p>
            </div>

            <div className="relative w-full aspect-[4/5] border border-[#53443c] overflow-hidden">
              <Image
                src={overService}
                alt="story"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <span className="text-[#a08d83] block mb-4 text-xs tracking-[0.2em]">
              OUR PHILOSOPHY
            </span>

            <h2 className="text-5xl text-[#e4e2e1] mb-8 font-bold">
              A Legacy Carved in Steel and Wood
            </h2>

            <div className="space-y-6 text-[#d8c2b7] leading-relaxed">
              <p>
                At IRON &amp; OAK, we believe that grooming is more than a
                routine; it is a ritual of restoration.
              </p>

              <p>
                Every tool in our kit is chosen for its balance and edge. We
                don&apos;t just cut hair; we sculpt confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-32 px-4 md:px-16 bg-[#1b1c1c]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-20">
            <span className="text-[#ffb68c] block mb-4 text-xs tracking-[0.2em]">
              THE MENU
            </span>

            <h2 className="text-6xl text-[#e4e2e1] font-black">
              Signature Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.title}
                title={service.title}
                image={service.image}
                price={service.price}
                features={service.features}
                description={service.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-32 px-4 md:px-16 bg-[#131313]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-20">
            <span className="text-[#ffb68c] block mb-4 text-xs tracking-[0.2em]">
              THE CRAFTSMEN
            </span>

            <h2 className="text-6xl text-[#e4e2e1] font-black">
              Our Master Barbers
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {barbers.map((barber) => (
              <div key={barber.name} className="group cursor-pointer">
                
                <div className="overflow-hidden border border-[#53443c] mb-4">
                  <div className="relative w-full aspect-[3/4] overflow-hidden">
                    <Image
                      src={barber.image}
                      alt={barber.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                </div>

                <p className="text-[#e4e2e1] text-2xl group-hover:text-[#ffb68c] transition-colors">
                  {barber.name}
                </p>

                <p className="text-[#a08d83] mt-1 text-xs tracking-[0.1em]">
                  {barber.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 md:px-16 bg-[#ffb68c] text-[#532200]">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="max-w-xl">
            <h2 className="text-4xl mb-4 font-bold">
              Ready for your transformation?
            </h2>

            <p className="text-lg leading-relaxed">
              Walk-ins are welcome, but appointments are recommended.
            </p>
          </div>

          <Link
            href="#"
            className="bg-[#532200] text-[#ffb68c] px-12 py-5 text-xs tracking-[0.2em]"
          >
            SECURE YOUR CHAIR
          </Link>
        </div>
      </section>
    </main>
  );
}
