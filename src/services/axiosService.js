import axios from "axios";
const BASE_API_FOOTBALL = process.env.API_FOOTBALL_URL;

const http_api_football = axios.create({
  baseURL: BASE_API_FOOTBALL,
  headers: {
    Authorization: "Bearer test_c2d93f7d290d175539e3ea78a358aa", // guardar api key no .env
  },
});

export { http_api_football };
