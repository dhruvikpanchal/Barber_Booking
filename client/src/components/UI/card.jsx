import { Star, MapPin } from 'lucide-react';

function SalonCard({ image, name, rating, reviews, address }) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Image */}
      <div className="h-[200px] w-full">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Rating */}
        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <Star className="text-pink-400" size={16} />
            <span>{rating}</span>
          </div>
          <p>{reviews} reviews</p>
        </div>

        {/* Salon Name */}
        <h3 className="text-base sm:text-lg font-semibold mb-2">{name}</h3>

        {/* Address */}
        <div className="flex items-start gap-2 text-sm text-gray-500 mb-5">
          <MapPin size={16} />
          <p>{address}</p>
        </div>

        {/* Button */}
        <button
          className="w-full py-3 rounded-xl text-white font-semibold"
          style={{ background: 'var(--color-l1)' }}
        >
          BOOK NOW
        </button>
      </div>
    </div>
  );
}

export default SalonCard;
