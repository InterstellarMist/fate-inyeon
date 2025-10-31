const API_URL = import.meta.env.VITE_API_URL || "";

// Global fetcher function for SWR
// This will be configured via SWRConfig to access token from context
// The token getter function allows us to get the latest token value
export const createAuthFetcher = (getToken: () => string | null) => {
  return async (endpoint: string) => {
    const token = getToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };
};
