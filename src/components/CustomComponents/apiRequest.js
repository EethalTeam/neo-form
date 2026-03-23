// utils/api.js
import { config } from "../../components/CustomComponents/config";

// Function to force logout
function handleLogout() {
  localStorage.removeItem("user");
  localStorage.removeItem("userRole");
  //   localStorage.clear(); // clear stored user data
  window.location.href = "/login"; // redirect to login
}

export async function apiRequest(endpoint, options = {}) {
  const userId = localStorage.getItem("userId");

  // 1. Prepare headers
  const headers = {
    ...options.headers,
  };

  // 2. ONLY add application/json if the body is NOT FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const finalOptions = {
    ...options,
    headers: headers,
  };

  try {
    console.log("API URL:", config.Api + "/api/" + endpoint);
    const response = await fetch(config.Api + "/api/" + endpoint, finalOptions);

    if (response.status === 401) {
      handleLogout();
      return;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
