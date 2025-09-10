import { http } from "../http";

export const signupUser = async ({ email, username, password, role }) => {
  try {
    const res = await http.post("/api/user", {
      email,
      username,
      password,
      role,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Signup failed.";
  }
};
