export const byStartTime = (a: { startTime: string }, b: { startTime: string }) => {
  return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
};
