import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import api from "../../services/api";

interface Event {
  _id: string;
  name: string;
  description: string;
  posterImage?: string;
  date: string;
  location: string;
  clubId: string;
  collaboratingClubs: string[];
  advisors: string[];
  createdAt: string;
  updatedAt: string;
}

const Events = () => {
  const { user, clubName } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Events useEffect triggered", { user });

    const fetchEvents = async () => {
      console.log("Fetching events...");
      try {
        let response;
        // If user is a club officer, fetch only their club's events
        if (user?.role === "club_officer" && user.clubId) {
          console.log("Fetching club events for club:", user.clubId);
          response = await api.get(`/clubs/${user.clubId}/events`);
        } else {
          console.log("Fetching all events");
          response = await api.get("/events");
        }
        console.log("Events response:", response.data);
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          {user?.role === "club_officer" && (
            <p className="text-gray-600 mt-2">Showing events for {clubName}</p>
          )}
        </div>
        {user && (
          <Link
            to="/events/create"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create New Event
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center text-gray-600 py-8">
          No events found.
          {user?.role === "club_officer" && " Create one to get started!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {event.posterImage && (
                <img
                  src={event.posterImage}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.name}
                </h2>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="text-sm text-gray-500 space-y-1 mb-4">
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(event.date).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span>{" "}
                    {event.location}
                  </p>
                  {event.collaboratingClubs.length > 0 && (
                    <p>
                      <span className="font-medium">Collaborating Clubs:</span>{" "}
                      {event.collaboratingClubs.join(", ")}
                    </p>
                  )}
                  {event.advisors.length > 0 && (
                    <p>
                      <span className="font-medium">Advisors:</span>{" "}
                      {event.advisors.join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    Created: {new Date(event.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/events/${event._id}`}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
