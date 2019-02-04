export const formatTime = secs => {
  const date = new Date(null);
  date.setSeconds(secs);
  return date.toISOString().substr(11, 8);
};
