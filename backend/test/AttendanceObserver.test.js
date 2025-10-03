import { expect } from "chai";
import sinon from "sinon";
import {
  AttendanceObserver,
  AttendanceSubject,
} from "../observers/AttendanceObserver.js"; // path adjust karo

describe("AttendanceObserver Pattern", () => {
  let subject, observer1, observer2, user, event;

  beforeEach(() => {
    subject = new AttendanceSubject();
    observer1 = new AttendanceObserver();
    observer2 = new AttendanceObserver();

    sinon.spy(observer1, "update");
    sinon.spy(observer2, "update");

    subject.subscribe(observer1);
    subject.subscribe(observer2);

    user = { name: "Abdullah", email: "abdullah@example.com" };
    event = { title: "AI Conference 2025" };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should call update on all subscribed observers", () => {
    subject.notify(user, event);

    expect(observer1.update.calledOnce).to.be.true;
    expect(observer1.update.calledWith(user, event)).to.be.true;

    expect(observer2.update.calledOnce).to.be.true;
    expect(observer2.update.calledWith(user, event)).to.be.true;
  });

  it("should not call update on unsubscribed observers", () => {
    subject.unsubscribe(observer2);
    subject.notify(user, event);

    expect(observer1.update.calledOnce).to.be.true;
    expect(observer2.update.called).to.be.false;
  });
});
