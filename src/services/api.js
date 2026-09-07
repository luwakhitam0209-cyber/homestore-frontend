import axios from "axios";

const api = axios.create({
  baseURL: "https://attract-officers-count-rats.trycloudflare.com/api",
  headers: {
    Accept: "application/json",
  },
});

export default api;