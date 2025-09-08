import axios from "axios";

const BASE_URL = "http://localhost:3000/api/user"; // שנה לפי הצורך

export const signupUser = async ({ email, username, password, role }) => {
  try {
    const response = await axios.post(BASE_URL, {
      email,
      username,
      password,
      role,
    });
    return response.data;
  } catch (err) {
    throw err.response?.data?.message || "Signup failed.";
  }
};
