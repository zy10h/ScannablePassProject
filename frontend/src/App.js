import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import EventsListing from "./pages/EventsListing";
import EventDetailPage from "./components/events/singleDetail";
import Admin from "./components/admin";
import AddEventForm from "./components/admin/addEvent";
import ProfileData from "./components/admin/profile";
import Footer from "./components/footer";
import NotFound from "./pages/NotFound";
import RegisterUser from "./components/admin/attendance";
import Attendance from "./components/attendance";


function AppWrapper() {
  const location = useLocation();
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  const hideFooter =
    location.pathname.startsWith("/admin") ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Navigate to="/eventListing" replace />} />
          <Route path="/eventListing" element={<EventsListing />} />
          <Route path="/event-details/:id" element={<EventDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/admin-dashboard" element={<Admin />} />
          <Route path="/admin-addevent" element={<AddEventForm />} />
          <Route path="/admin-profile" element={<ProfileData />} />
          <Route path="/admin-attendance" element={<RegisterUser />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
