export function buildStartAt(dateIso, timeId) {
  const d = new Date(dateIso);
  const [h, m] = timeId.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}
