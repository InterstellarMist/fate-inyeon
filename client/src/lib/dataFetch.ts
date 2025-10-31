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
      // Handle 404 for matches and likes as empty results
      if (response.status === 404) {
        if (endpoint === "/api/matches") {
          return { matches: [], profiles: [] };
        }
        if (endpoint === "/api/likes") {
          return [];
        }
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };
};

// Like a candidate
export const likeCandidate = async (
  candidateId: string,
  token: string | null
): Promise<{
  message: string;
  match?: { profile1: string; profile2: string };
}> => {
  if (!token) {
    throw new Error("No authentication token available");
  }

  const response = await fetch(
    `${API_URL}/api/candidates/like/${candidateId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Dislike a candidate
export const dislikeCandidate = async (
  candidateId: string,
  token: string | null
): Promise<{ message: string }> => {
  if (!token) {
    throw new Error("No authentication token available");
  }

  const response = await fetch(
    `${API_URL}/api/candidates/dislike/${candidateId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
