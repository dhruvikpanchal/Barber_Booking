function barberInitials(name) {
  if (!name) return "B";
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function BarberThumb({ barber, className = "h-10 w-10" }) {
  if (barber?.image) {
    return (
      <img
        src={barber.image}
        alt=""
        className={`border-outline-variant shrink-0 overflow-hidden rounded-lg border object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`border-outline-variant bg-primary/10 text-primary flex shrink-0 items-center justify-center rounded-lg border text-xs font-semibold ${className}`}
      aria-hidden
    >
      {barberInitials(barber?.name)}
    </div>
  );
}
