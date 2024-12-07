import axios from "axios";

const BASE_API_FOOTBALL = process.env.API_FOOTBALL_URL;

const http_api_football = axios.create({
  baseURL: BASE_API_FOOTBALL,
  headers: {
    Authorization: "Bearer live_40d63df9ff115f28ea51c345300522", // guardar api key no .env
    // test_c2d93f7d290d175539e3ea78a358aa
    // live_40d63df9ff115f28ea51c345300522
  },
});

export { http_api_football };
