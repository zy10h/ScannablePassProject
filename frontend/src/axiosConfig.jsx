import axios from "axios";

const axiosInstance = axios.create({
  //baseURL: "http://localhost:5001/api",
  baseURL: "http://52.65.234.130:5001/api", // live
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
