# 🎟️ Digital Event Pass Generator (MERN)

A **MERN-based solution** for educational institutions to generate **unique, scannable event passes** for seminars, workshops, and fests.  
It streamlines **event registration, entry validation, and real-time attendance tracking**, improving **event logistics and security**.

---

## 🚀 Features

- **Event Management (Admin)**
  - Add, update, and delete events
  - Set event details such as title, description, date, location, category, seats, etc.
- **User Registration**
  - Students/staff can sign up
  - Register for available events
- **QR Code Event Passes**
  - Unique QR code generated for each registration
  - Scannable at entry for validation
- **Attendance Tracking**
  - Real-time tracking of participants on event day
- **Authentication**
  - Admin & User login with role-based access

---

## 🛠️ Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JWT (JSON Web Tokens)
- **QR Code:** `qrcode` package

---

## 📂 Project Structure

```
project-root/
│── backend/          # Express + MongoDB API
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes (events, users, auth)
│   └── controllers/  # Business logic
│
│── frontend/         # React app
│   ├── src/components
│   ├── src/pages
│   └── src/context
│
└── README.md
```

---

## 🔑 Credentials (Demo Accounts)

### 👨‍💻 Admin Accounts

- **Email:** `admin@gmail.com`  
  **Password:** `admin123`

- **Email:** `admin2@gmail.com`  
  **Password:** `admin2123`

### 👤 User Account

- **Email:** `test12@gmail.com`  
  **Password:** `test123`

---

## ⚡ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/digital-event-pass-generator.git
cd digital-event-pass-generator
```

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

- Create a `.env` file inside `backend/` with:

  ```
  MONGO_URI=your_mongo_connection_string
  JWT_SECRET=your_secret_key
  PORT=5000
  ```

- Run the server:
  ```bash
  npm start
  ```

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
npm start
```

---

## 📸 Screenshots (Optional)

(Add screenshots of event list, registration page, QR pass, and admin dashboard)

---

## ✅ Future Improvements

- Email notifications with attached QR passes
- Multi-role authentication (Super Admin, Organizer, Volunteer)
- Analytics dashboard for event insights
- Mobile app integration

---

## 👨‍🏫 Use Case

This system is tailored for **schools, colleges, and universities** to:

- Prevent fake entries with **secure QR validation**
- Save time with **digital registration**
- Monitor **attendance in real-time**

---

Jira Url: https://shanabbas.atlassian.net/jira/software/projects/SPP/boards/8/backlog?atlOrigin=eyJpIjoiMjI4MTA2YWQ4ODg0NDdmNWI0N2FiOTFhOWNjZWZiMmQiLCJwIjoiaiJ9
