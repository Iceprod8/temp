import axios from "axios";

const { location } = window;

export const BACKEND_URL =
  process.env.REACT_APP_URL ||
  `${location.protocol}//${location.hostname}:8000`;

export class APIError extends Error {
  constructor(response) {
    super(response.statusText);
    this.response = response;
  }
}

export const backend = axios.create({
  baseURL: `${BACKEND_URL}/api/1/`,
});

// Set the AUTH token for any request
backend.interceptors.request.use((config) => {
  const token = localStorage.getItem("access-token");
  const nconfig = { ...config };
  nconfig.headers.Authorization = token ? `Bearer ${token}` : "";
  return nconfig;
});

// Handle response errors (401 Unauthorized for token refresh)
backend.interceptors.response.use(
  (response) => response, // Pass successful responses through
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired access token
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark this request as a retry to avoid infinite loops

      const refreshToken = localStorage.getItem("refresh-token");
      if (!refreshToken) {
        // No refresh token available; redirect to root and clear storage
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
        window.location.href = "/"; // Redirect to the root of the website
        return Promise.reject(new APIError(error.response));
      }

      try {
        // Attempt to refresh the access token
        const { data } = await axios.post(
          `${BACKEND_URL}/api/1/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        // Save the new access token
        localStorage.setItem("access-token", data.access);

        // Update the Authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return backend(originalRequest);
      } catch (refreshError) {
        // If refreshing the token fails, redirect to root and clear storage
        console.error("Token refresh failed:", refreshError);
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
        window.location.href = "/"; // Redirect to the root of the website
        return Promise.reject(new APIError(refreshError.response));
      }
    }

    // Reject other errors
    return Promise.reject(new APIError(error.response));
  }
);
