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

function AppWrapper() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/eventListing" replace />} />
        <Route path="/eventListing" element={<EventsListing />} />
        <Route path="/event-details/:id" element={<EventDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />

        <Route path="/admin-dashboard" element={<Admin />} />
        <Route path="/admin-addevent" element={<AddEventForm />} />
        <Route path="/admin-profile" element={<ProfileData />} />
      </Routes>
    </>
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
