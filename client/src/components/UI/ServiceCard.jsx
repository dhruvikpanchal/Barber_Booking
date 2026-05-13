import Link from 'next/link';
import Image from 'next/image';

export default function ServiceCard({
  title,
  image,
  price,
  features,
  description,
  BookingLink = '/login',
}) {
  return (
    <div className="bg-[#131313] border border-[#53443c] hover:border-[#ffb68c] transition-colors group">
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 420px"
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />
      </div>

      <div className="p-8">
        <div className="flex justify-between items-baseline mb-4">
          <h3 className="text-2xl text-[#e4e2e1] font-semibold">{title}</h3>

          <span className="text-[#ffb68c] text-2xl font-bold">{price}</span>
        </div>

        <p className="text-[#d8c2b7] mb-8 leading-relaxed">{description}</p>

        <ul className="space-y-3 mb-8">
          {features.map((item) => (
            <li
              key={item}
              className="flex items-center gap-3 text-[#a08d83] text-xs tracking-[0.1em]"
            >
              ✓ {item}
            </li>
          ))}
        </ul>

        <Link
          href={BookingLink}
          className="block w-full text-center border border-[#53443c] py-3 text-xs tracking-[0.15em] hover:bg-[#ffb68c] hover:text-[#532200] hover:border-[#ffb68c] transition-all"
        >
          BOOK SERVICE
        </Link>
      </div>
    </div>
  );
}
