import { useState } from "react";
import TextField from "./TextField";
import "./TextField.css";

// This component is a password input field that allows the user to toggle the visibility of the password.
export default function PasswordField(props) {
  // State for password visibility
  const [visible, setVisible] = useState(false);
  // Toggle password visibility
  const toggleVisibility = () => {
      setVisible(!visible);
  };
  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      after={
        <button
          type="button"
          className="toggle-visibility"
          onClick={toggleVisibility}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? "Hide" : "Show"}
        </button> 
      }
    />
  );
}
