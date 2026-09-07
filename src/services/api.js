import axios from "axios";

const api = axios.create({
  baseURL: "https://count-registered-earn-ryan.trycloudflare.com/api",
  headers: {
    Accept: "application/json",
  },
});

export default api;