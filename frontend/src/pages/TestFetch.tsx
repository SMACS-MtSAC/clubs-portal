import { useState } from 'react';

interface HealthResponse {
  status: string;
  message: string;
}

const TestFetchPage = () => {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Backend Connection Test (Fetch)</h1>
      <div className="p-4 rounded-lg shadow">
        <button
          onClick={testConnection}
          disabled={loading}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
        {data && <div className="p-2 rounded bg-green-100 text-green-800">{data.status}</div>}
        {error && <div className="p-2 rounded bg-red-100 text-red-800">{error}</div>}
        <div className="mt-2 text-sm text-gray-600">
          <div>Testing URL: {import.meta.env.VITE_API_URL}/health</div>
        </div>
      </div>
    </div>
  );
};

export default TestFetchPage; 