import { http } from "../http";
import { handle } from "@/utils/serviceFactory";

export const SignupService = {
  signupInitial(payload) {
    return handle(http.post("/signup", payload));
  },
  login(payload) {
    return handle(http.post("/login", payload));
  },
};
