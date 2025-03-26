import { Link } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const Navbar = () => {
  const { user, logout, isLoggedIn, clubName } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Clubs Portal
            </Link>
            {isLoggedIn && (
              <div className="ml-10 flex items-center space-x-4">
                {user?.role === "admin" && (
                  <Link
                    to="/clubs"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Clubs
                  </Link>
                )}

                <Link
                  to="/events"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Events
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                {user.role === "admin" ? (
                  <span className="text-gray-600 mr-4">
                    Welcome, {user.username}!
                  </span>
                ) : (
                  <span className="text-gray-600 mr-4">
                    Welcome, {user.username} from {clubName}!
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
                <Link
                  to="/register"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium ml-4"
                >
                  Register User
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium mr-4"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
