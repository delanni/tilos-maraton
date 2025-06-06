export const formatTime2Digit = (dateOrString: Date | string) => {
  const date = typeof dateOrString === "string" ? new Date(dateOrString) : dateOrString;
  return date.toLocaleTimeString("hu-HU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (dateOrString: string | Date) => {
  const date = typeof dateOrString === "string" ? new Date(dateOrString) : dateOrString;
  return date.toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDay = (dateOrString: string | Date) => {
  const date = typeof dateOrString === "string" ? new Date(dateOrString) : dateOrString;
  return date.toLocaleDateString("hu-HU", {
    month: "short",
    day: "numeric",
  });
};

export const formatDate2Digit = (dateOrString: string | Date) => {
  const date = typeof dateOrString === "string" ? new Date(dateOrString) : dateOrString;
  return date.toLocaleDateString("hu-HU", {
    month: "2-digit",
    day: "2-digit",
  });
};

export const printDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diff = end.getTime() - start.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) {
    return `${minutes} perc`;
  } 
  if (minutes === 0) {
    return `${hours} óra`;
  }

  return `${hours} óra ${minutes} perc`;
};
