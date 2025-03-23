import { useApi } from '../hooks/useApi';
import api from '../services/api';

interface HealthResponse {
  status: string;
  message: string;
}

const TestConnectionPage = () => {
  const { data, loading, error, execute } = useApi<HealthResponse>(
    () => api.get('/health').then(res => res.data)
  );

  const testConnection = () => {
    execute();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Backend Connection Test</h1>
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
          <div>Testing URL: http://localhost:5000/api/health</div>
        </div>
      </div>
    </div>
  );
};

export default TestConnectionPage; 