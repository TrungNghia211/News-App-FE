export const apiFetch = async (
  endpoint,
  method = "GET",
  payload = null,
  token = null
) => {
  const baseUrl = "http://localhost:8000";
  const url = `${baseUrl}${endpoint}`;

  try {
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const options = {
      method,
      headers,
      ...(payload && { body: JSON.stringify(payload) }),
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          message: "API request failed with no additional details",
        };
      }
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error.message || error);
    throw error;
  }
};
