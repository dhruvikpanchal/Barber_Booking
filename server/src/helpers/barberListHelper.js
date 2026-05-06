export const buildBarberListWhere = ({ search, location, status, isAvailable }) => ({
  ...(status && { status }),
  ...(isAvailable !== undefined && { isAvailable }),
  ...(location && { location: { contains: location, mode: 'insensitive' } }),
  ...(search && { user: { name: { contains: search, mode: 'insensitive' } } }),
});
