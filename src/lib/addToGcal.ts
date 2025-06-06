export const addToGoogleCalendar = (performance: {
  startTime: string;
  endTime: string;
  artist?: { name: string; description: string };
  stage?: { name: string };
}) => {
  if (!performance.startTime || !performance.endTime) return;

  const formatDate = (date: Date) => {
    return `${date.toISOString().replace(/[-:]/g, "").split(".")[0]}Z`;
  };

  const startDate = new Date(performance.startTime);
  const endDate = new Date(performance.endTime);

  const event = {
    action: "TEMPLATE",
    text: performance.artist?.name || "Tilos Maraton",
    details: performance.artist?.description || "Tilos Maraton",
    location: performance.stage?.name || "Tilos Maraton",
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
  };

  const url = new URL("https://www.google.com/calendar/render");
  url.search = new URLSearchParams(event as Record<string, string>).toString();

  window.open(url.toString(), "_blank");
};
