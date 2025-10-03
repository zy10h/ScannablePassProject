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

  unsubscribe(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(user, event) {
    this.observers.forEach((obs) => obs.update(user, event));
  }
}

export { AttendanceObserver, AttendanceSubject };
