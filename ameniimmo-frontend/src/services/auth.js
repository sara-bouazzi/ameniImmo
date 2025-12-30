import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";
const API_URL = `${BASE_URL}/api/auth/`;

export async function loginUser(username, password) {
  try {
    const response = await axios.post(`${API_URL}login/`, {
      username,
      password,
    });
    return response.data; // { user, access, refresh, message }
  } catch (error) {
    throw error.response?.data || { detail: "Erreur inconnue" };
  }
}

export async function registerUser(userData) {
  try {
    const response = await axios.post(`${API_URL}register/`, userData);
    return response.data; // { user, access, refresh, message }
  } catch (error) {
    throw error.response?.data || { detail: "Erreur inconnue" };
  }
}
