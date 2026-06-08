export function mapServiceChange(sc) {
  if (!sc) return null;
  return {
    ...sc,
    requestedServices: sc.updatedServices ?? sc.requestedServices ?? [],
  };
}
