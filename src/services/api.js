import axios from "axios";

const api = axios.create({
  baseURL: "http://10.162.84.185:8000/api",
  headers: {
    Accept: "application/json",
  },
});

export default api;