// using Decorator Pattern to add QR code generation to user profiles.
const QRCode = require("qrcode");

class QRCodeDecorator {
  constructor(user, eventId = null) {
    this.user = user;
    this.eventId = eventId;
  }

  async generateQRCode() {
    const data = { id: this.user.id, email: this.user.email };
    if (this.eventId) data.eventId = this.eventId;
    return await QRCode.toDataURL(JSON.stringify(data));
  }
}

module.exports = QRCodeDecorator;
