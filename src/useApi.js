import { useState, useCallback } from 'react';
import axios from 'axios';

const useApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (url, data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(url, data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      throw err;
    }
  }, []);

  return { isLoading, error, sendRequest };
};

export default useApi;
