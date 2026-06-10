import { create } from "axios";

const Instance = create({
  baseURL: process.env.EXPO_PUBLIC_API_ENDPOINT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default Instance;
