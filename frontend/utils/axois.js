import axios from "axios";

const Instance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_ENDPOINT || process.env.NEXT_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

Instance.interceptors.request.use(
  async (config) => {
    try {
      // Retrieve token client-side safely from Clerk window object if loaded
      if (typeof window !== "undefined" && window.Clerk) {
        const token = await window.Clerk.session?.getToken();
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Clerk Interceptor Error:", error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default Instance;
