import axios from "axios";

export const api = () => {
  const defaultOptions = {
    baseURL: process.env.REACT_APP_BACKEND_SERVER
      ? process.env.REACT_APP_BACKEND_SERVER
      : "http://localhost:4000/",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Create instance
  let instance = axios.create(defaultOptions);

  // Set the AUTH token for any request
  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  });

  return instance;
};
