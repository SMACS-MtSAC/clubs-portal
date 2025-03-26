const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Clubs Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">About Clubs Portal</h2>
          <p className="text-gray-600 mb-4">
            Welcome to Clubs Portal, a platform for managing club activities and events.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <ul className="text-gray-600 space-y-2">
            <li>• Login to manage your club's events and members</li>
            <li>• New members need to be registered by existing club members</li>
            <li>• To create a new club, please contact an administrator</li>
            <li>• First-time users will be registered by an administrator</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home; 