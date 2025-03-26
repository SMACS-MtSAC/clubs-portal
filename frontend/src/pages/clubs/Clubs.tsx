import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import api from "../../services/api";

interface Club {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const Clubs = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await api.get("/clubs");
        setClubs(response.data);
      } catch (err) {
        setError("Failed to fetch clubs");
        console.error("Error fetching clubs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Clubs</h1>

      {user?.role === "admin" && (
        <div className="mb-6">
          <Link
            to="/clubs/create"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New Club
          </Link>
          <div className="mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <div
                key={club._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {club.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{club.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      Club Account Created:{" "}
                      {new Date(club.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Last Updated:{" "}
                      {new Date(club.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-4">
                    <Link
                      to={`/clubs/${club._id}`}
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {user?.role === "club_officer" && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-yellow-700">
            If you want to edit your club, ask an admin to do it for you.
          </p>
        </div>
      )}
    </div>
  );
};

export default Clubs;
