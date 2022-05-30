import axios from "axios";

const BASE_URL: string = "http://localhost:1234";

export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
