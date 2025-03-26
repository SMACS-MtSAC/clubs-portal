import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Clubs from "./pages/clubs/Clubs";
import CreateClub from "./pages/clubs/CreateClub";
import ClubDetails from "./pages/clubs/ClubDetails";
import Events from "./pages/events/Events";
import EventDetails from "./pages/events/EventDetails";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Test from "./pages/Test";
import RegisterAdmin from "./pages/auth/RegisterAdmin";
import { UserProvider } from "./contexts/useAuth";
import CreateEvent from "./pages/events/CreateEvent";

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/clubs/create" element={<CreateClub />} />
            <Route path="/clubs/:id" element={<ClubDetails />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/create" element={<CreateEvent />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-admin" element={<RegisterAdmin />} />
            <Route path="/test" element={<Test />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;
