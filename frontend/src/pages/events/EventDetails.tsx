import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import api from "../../services/api";

interface Event {
  _id: string;
  name: string;
  description: string;
  posterImage?: string;
  date: string;
  location: string;
  clubId: {
    _id: string;
    name: string;
  };
  collaboratingClubs: string[];
  advisors: string[];
  createdAt: string;
  updatedAt: string;
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    posterImage: "",
    date: "",
    location: "",
    collaboratingClubs: [] as string[],
    advisors: [] as string[],
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);

        // Convert date to local datetime-local format
        const eventDate = new Date(response.data.date);
        const formattedDate = eventDate.toISOString().slice(0, 16);

        setFormData({
          name: response.data.name,
          description: response.data.description,
          posterImage: response.data.posterImage || "",
          date: formattedDate,
          location: response.data.location,
          collaboratingClubs: response.data.collaboratingClubs,
          advisors: response.data.advisors,
        });
      } catch (err) {
        setError("Failed to fetch event details");
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "collaboratingClubs" || name === "advisors") {
      setFormData({
        ...formData,
        [name]: value.split(",").map((item) => item.trim()),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.put(`/events/${id}`, formData);
      const response = await api.get(`/events/${id}`);
      setEvent(response.data);
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update event");
      console.error("Error updating event:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await api.delete(`/events/${id}`);
      navigate("/events");
    } catch (err) {
      setError("Failed to delete event");
      console.error("Error deleting event:", err);
    }
  };

  const canEditEvent = () => {
    if (!user || !event) return false;
    return (
      user.role === "admin" ||
      (user.role === "club_officer" && user.clubId === event.clubId._id)
    );
  };

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

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Event not found
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Event Details</h1>
          {canEditEvent() && (
            <div className="space-x-4">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>

        {isEditing ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Event Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={4}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="posterImage"
              >
                Poster Image URL
              </label>
              <input
                type="text"
                id="posterImage"
                name="posterImage"
                value={formData.posterImage}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="date"
              >
                Date and Time
              </label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="location"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="collaboratingClubs"
              >
                Collaborating Clubs (comma-separated)
              </label>
              <input
                type="text"
                id="collaboratingClubs"
                name="collaboratingClubs"
                value={formData.collaboratingClubs.join(", ")}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="advisors"
              >
                Advisors (comma-separated)
              </label>
              <input
                type="text"
                id="advisors"
                name="advisors"
                value={formData.advisors.join(", ")}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {event.posterImage && (
              <div className="mb-6">
                <img
                  src={event.posterImage}
                  alt={event.name}
                  className="w-full h-64 object-cover rounded"
                />
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {event.name}
              </h2>
              <p className="text-gray-600">{event.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-bold text-gray-700">
                  Date and Time
                </h3>
                <p className="text-gray-600">
                  {new Date(event.date).toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-700">Location</h3>
                <p className="text-gray-600">{event.location}</p>
              </div>

              {event.collaboratingClubs.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700">
                    Collaborating Clubs
                  </h3>
                  <p className="text-gray-600">
                    {event.collaboratingClubs.join(", ")}
                  </p>
                </div>
              )}

              {event.advisors.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700">Advisors</h3>
                  <p className="text-gray-600">{event.advisors.join(", ")}</p>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500">
              <p>Created: {new Date(event.createdAt).toLocaleDateString()}</p>
              <p>
                Last Updated: {new Date(event.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
