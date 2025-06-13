import https from "https";
import axios from "axios";

const agent = new https.Agent({
  rejectUnauthorized: false, // Accept self-signed cert
});

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  httpsAgent: agent, // use this
});

export default api;
