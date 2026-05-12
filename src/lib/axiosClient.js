import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Request Interceptor (optional: add token)
axiosClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response Interceptor (Global Error Handling)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // 👉 Network error (server down, CORS, no internet)
    if (!error.response) {
      console.error("Network Error:", error);
      return Promise.reject({
        message: "Network error — server is unreachable.",
        status: null,
      });
    }

    const { status, data } = error.response;

    // 👉 Handle by status codes
    switch (status) {
      case 400:
        console.warn("Bad Request:", data);
        break;

      case 401:
        console.warn("Unauthorized: Token expired or invalid");
        // Example: auto logout
        // localStorage.removeItem("token");
        // window.location.href = "/login";
        break;

      case 403:
        console.warn("Forbidden:", data);
        break;

      case 404:
        console.warn("Not Found:", data);
        break;

      case 500:
        console.error("Server Error:", data);
        break;

      default:
        console.error("Unhandled Error:", data);
    }

    // Always reject with same structure
    return Promise.reject({
      status,
      message: data?.message || "Something went wrong!",
      data,
    });
  }
);

export default axiosClient;