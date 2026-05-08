import { barberDetails as barbers } from "@/constants/Data";
import BarberCard from "@/components/ui/BarberCard";

export default function Barbers() {
  return (
    <main className="bg-[#131313] text-[#e4e2e1] min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 md:px-16 bg-[#1b1c1c] border-b border-[#53443c]">
        <div className="max-w-[1280px] mx-auto">
          <span className="text-[#ffb68c] tracking-[0.3em] block mb-4 text-xs font-semibold">
            THE CRAFTSMEN
          </span>

          <h1 className="text-[40px] md:text-6xl text-[#e4e2e1] mb-6 font-black">
            Our Master Barbers
          </h1>

          <p className="text-[#d8c2b7] text-lg leading-relaxed max-w-2xl">
            Each member of our team is a certified artisan with years of
            hands-on experience. Select a barber you trust, or let us match you
            with one.
          </p>
        </div>
      </section>

      {/* Barber Grid */}
      <section className="py-20 px-4 md:px-16">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {barbers.map((barber) => (
            <BarberCard
              key={barber.name}
              image={barber.image}
              name={barber.name}
              role={barber.role}
              experience={barber.experience}
              bio={barber.bio}
              skills={barber.skills}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 md:px-16 bg-[#ffb68c] text-[#532200]">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Find your perfect barber.
            </h2>

            <p className="text-lg leading-relaxed">
              Every appointment is tailored to your style, personality, and
              grooming goals.
            </p>
          </div>

          <button className="bg-[#532200] text-[#ffb68c] px-12 py-5 text-xs font-semibold tracking-[0.2em] hover:opacity-90 transition-opacity whitespace-nowrap">
            BOOK APPOINTMENT
          </button>
        </div>
      </section>
    </main>
  );
}
