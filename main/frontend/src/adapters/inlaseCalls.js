import axios from "axios";

export const BACKEND_URL = "http://localhost:6006";

export class InLaseError extends Error {
  contructor(response) {
    this.response = response;
  }
}

export const inlase = axios.create({
  baseURL: `${BACKEND_URL}/api/`,
});
