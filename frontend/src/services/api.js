import axios from "axios";

const api = axios.create({
  baseURL: "https://kaleva36.onrender.com"+"/api",
});

export default api;