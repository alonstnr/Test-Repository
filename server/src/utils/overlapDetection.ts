interface TimeRange {
  date: Date;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

export function doTimeSlotsOverlap(a: TimeRange, b: TimeRange): boolean {
  const aDate = new Date(a.date).toISOString().split('T')[0];
  const bDate = new Date(b.date).toISOString().split('T')[0];

  if (aDate !== bDate) return false;

  const aStart = timeToMinutes(a.startTime);
  const aEnd = timeToMinutes(a.endTime);
  const bStart = timeToMinutes(b.startTime);
  const bEnd = timeToMinutes(b.endTime);

  return aStart < bEnd && bStart < aEnd;
}
