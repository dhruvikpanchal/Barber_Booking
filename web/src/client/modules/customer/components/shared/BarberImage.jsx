function barberInitials(name) {
  if (!name) return "B";
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function BarberImage({
  src,
  name = "Barber",
  className = "h-12 w-12 rounded-xl",
  imageClassName = "h-full w-full object-cover",
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`border-outline-variant shrink-0 overflow-hidden border ${className} ${imageClassName}`}
      />
    );
  }

  return (
    <div
      className={`border-outline-variant bg-primary/10 text-primary flex shrink-0 items-center justify-center border text-xs font-semibold ${className}`}
      aria-hidden
    >
      {barberInitials(name)}
    </div>
  );
}
