import QRCode from "qrcode";

class QRCodeDecorator {
  constructor(user, eventId = null) {
    this.user = user;
    this.eventId = eventId;
  }

  async generateQRCode() {
    const params = new URLSearchParams({
      id: this.user._id.toString(),
      email: this.user.email,
    });

    if (this.eventId) {
      params.append("eventId", this.eventId);
    }

    const attendanceUrl = `http://13.54.229.16/:3000/attendance?${params.toString()}`;

    return await QRCode.toDataURL(attendanceUrl);
  }
}

export default QRCodeDecorator;
