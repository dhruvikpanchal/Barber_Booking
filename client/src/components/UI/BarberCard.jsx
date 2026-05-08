import Image from "next/image";

function BarberCard({ key, image, name, role, experience, bio, skills }) {
  return (
    <div
      key={key}
      className="bg-[#1f2020] border border-[#53443c] hover:border-[#ffb68c] transition-colors overflow-hidden group"
    >
      <div className="grid md:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden">
          <div className="relative w-full h-full overflow-hidden">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <span className="text-[#ffb68c] text-xs tracking-[0.2em] block mb-3">
              {role}
            </span>

            <h2 className="text-3xl font-bold mb-3">{name}</h2>

            <p className="text-[#a08d83] text-xs tracking-[0.1em] mb-6">
              {experience}
            </p>

            <p className="text-[#d8c2b7] leading-relaxed mb-8">{bio}</p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="border border-[#53443c] px-3 py-1 text-[10px] tracking-[0.1em] text-[#a08d83]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Button */}
          <button className="w-full border border-[#53443c] py-3 text-xs tracking-[0.15em] hover:bg-[#ffb68c] hover:text-[#532200] hover:border-[#ffb68c] transition-all">
            BOOK WITH {name.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BarberCard;
