import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';

// Placeholder components - we'll create these next
const Home = () => <div>Home Page</div>;
const Clubs = () => <div>Clubs Page</div>;
const Events = () => <div>Events Page</div>;
const Login = () => <div>Login Page</div>;
const Register = () => <div>Register Page</div>;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
