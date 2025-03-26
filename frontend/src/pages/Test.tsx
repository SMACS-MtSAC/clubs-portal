import { useState } from "react";
import axios from "axios";

const Test = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const testConnection = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/health"
      );
      setConnectionStatus("Connection successful: " + response.data.message);
      setIsSuccess(true);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setConnectionStatus("Connection failed: " + error.message);
        setIsSuccess(false);
      } else {
        setConnectionStatus("An unexpected error occurred");
        setIsSuccess(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center">
        <button
          onClick={testConnection}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Test Backend Connection
        </button>
        {connectionStatus && (
          <p
            className={`mt-4 text-lg ${
              isSuccess ? "text-green-600" : "text-red-600"
            }`}
          >
            {connectionStatus}
          </p>
        )}
      </div>
    </div>
  );
};

export default Test;
