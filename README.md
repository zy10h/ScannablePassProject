# 🎟️ Digital Event Pass Generator (MERN)

The **Digital Event Pass Generator** is a MERN application designed for educational institutions to simplify **event registrations and access control**.  
It generates **secure QR-based passes** for attendees, validates them at entry, and records **attendance in real-time**, ensuring smooth event operations.

---

## 🚀 Key Features

- **Event Administration**
  - Create, update, and remove events
  - Define event details (title, description, venue, date, time, category, seat availability)
- **User Participation**
  - Students and staff can register accounts
  - Sign up for events quickly
- **QR Passes**
  - Each registration issues a unique QR code
  - QR code scanning ensures secure entry
- **Attendance Monitoring**
  - Track participation live during the event
- **Authentication**
  - Secure login system with separate roles for Admin and User

---

## 🛠️ Technology Stack

- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **QR Generation:** `qrcode` library

---

## 📂 Project Layout

```
project-root/
│── backend/          # Express + MongoDB API
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes (events, users, authentication)
│   └── controllers/  # Core logic
│
│── frontend/         # React application
│   ├── src/components
│   ├── src/pages
│   └── src/context
│   └── src/layout
│   └── src/assets
│
└── README.md
```

---

## 🔑 Demo Accounts

### 👨‍💻 Admins

- **Email:** `admin@gmail.com` | **Password:** `admin123`
- **Email:** `admin2@gmail.com` | **Password:** `admin2123`

### 👤 User

- **Email:** `test12@gmail.com` | **Password:** `test123`

---

## ⚡ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/abdullah-ubaid/ScannablePassProject.git
```

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the backend server:

```bash
npm start
```

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## ✅ Future Enhancements

- Automatic email delivery of QR passes
- Multiple roles (Organizers, Volunteers, Super Admin)
- Event analytics dashboard
- Mobile application integration

---

## 🎯 Target Use Case

Designed primarily for **universities, schools, and colleges**, this system:

- Prevents unauthorized entries using **QR verification**
- Eliminates manual registration delays
- Enables **instant attendance logging**

---

## 📌 Jira Project

For project management and backlog tracking, visit:  
👉 [Jira Board](https://shanabbas.atlassian.net/jira/software/projects/SPP/boards/8/backlog?atlOrigin=eyJpIjoiMjI4MTA2YWQ4ODg0NDdmNWI0N2FiOTFhOWNjZWZiMmQiLCJwIjoiaiJ9)

---
