"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsWithinWorkingHours = void 0;
const IsWithinWorkingHours = (checkHour, workingHours) => {
    const [start, end] = workingHours.split('-').map((t) => t.trim());
    const [h, m] = checkHour.split(':').map(Number);
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const toMinutes = (h, m) => h * 60 + m;
    const check = toMinutes(h, m);
    return check >= toMinutes(sh, sm) && check <= toMinutes(eh, em);
};
exports.IsWithinWorkingHours = IsWithinWorkingHours;
