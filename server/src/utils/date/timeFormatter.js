export const formatTime = ({ date }) => {
  if (!date) return null;

  const d = new Date(date);
  if (isNaN(d)) return null;

  return d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const formatSlot = ({ slot }) => {
  if (!slot) return slot;

  return {
    ...slot,
    startTime: formatTime({ date: slot.startTime }),
    endTime: formatTime({ date: slot.endTime }),
  };
};

export const formatDateUTC = ({ date } = {}) => {
  if (!date) return null;

  const d = new Date(date);
  if (isNaN(d)) return null;

  return d.toISOString().split('T')[0];
};
