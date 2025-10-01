//  using Strategy Pattern to handle different attendance strategies like user scans and admin checks.

class UserScanStrategy {
  scan(user, event) {
    return `${user.name} scanned QR for ${event.title}`;
  }
}

class AdminCheckStrategy {
  scan(admin, event) {
    return `${admin.name} checked attendance for event: ${event.title}`;
  }
}

module.exports = { UserScanStrategy, AdminCheckStrategy };

