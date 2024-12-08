import axios from "axios";

const BASE_API_FOOTBALL = process.env.API_FOOTBALL_URL;
const API_KEY_FOOTBALL_LIVE = process.env.API_KEY_FOOTBALL_LIVE;
// const API_KEY_FOOTBALL_TEST = process.env.API_KEY_FOOTBALL_TEST;

const http_api_football = axios.create({
  baseURL: BASE_API_FOOTBALL,
  headers: {
    Authorization: `Bearer ${API_KEY_FOOTBALL_LIVE}`, // guardar api key no .env
  },
});

export { http_api_football };
