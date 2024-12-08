import axios from "axios";

const BASE_API_FOOTBALL = process.env.API_FOOTBALL_URL;
const API_KEY_FOOTBALL = process.env.API_KEY_FOOTBALL;

const http_api_football = axios.create({
  baseURL: BASE_API_FOOTBALL,
  headers: {
    Authorization: `Bearer ${API_KEY_FOOTBALL}`, // guardar api key no .env
  },
});

export { http_api_football };
