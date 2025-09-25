export const IsWithinWorkingHours = (checkHour: string, workingHours: string) => {
  const [start, end] = workingHours.split('-').map((t) => t.trim());
  const [h, m] = checkHour.split(':').map(Number);
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);

  const toMinutes = (h: number, m: number) => h * 60 + m;
  const check = toMinutes(h, m);
  return check >= toMinutes(sh, sm) && check <= toMinutes(eh, em);
};