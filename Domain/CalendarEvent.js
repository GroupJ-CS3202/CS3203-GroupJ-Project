// Domain/CalendarEvent.js

class CalendarEvent {
  constructor(date, time, title, notes) {
    this.date = date;   // e.g. "2025-10-14"
    this.time = time;   // e.g. "14:30"
    this.title = title; // e.g. "Doctor Appointment"
    this.notes = notes; // e.g. "Bring insurance card"
  }
}

export default CalendarEvent;
