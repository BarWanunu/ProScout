import { http } from "../http";
import { handle } from "./serviceFactory";

export const SignupService = {
  signupInitial(payload) {
    return handle(http.post("/user", payload));
  },
  login(payload) {
    return handle(http.post("/login", payload));
  },
};
