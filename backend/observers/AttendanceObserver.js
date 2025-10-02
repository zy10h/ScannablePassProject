//  using Observer Pattern to notify when a user attends an event.

class AttendanceObserver {
  update(user, event) {
    console.log(`🔔 Notification: ${user.name} attended ${event.title}`);
  }
}

class AttendanceSubject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify(user, event) {
    this.observers.forEach((obs) => obs.update(user, event));
  }
}

module.exports = { AttendanceObserver, AttendanceSubject };
