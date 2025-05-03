import { CheckCircle, AlertCircle } from "lucide-react";
import PropTypes from "prop-types";
import "./TextField.css";

// This component is a reusable text input field with validation feedback. It displays an icon based on the validation state (success or error) and shows an error message if applicable.
export default function TextField({
  id, label, type = "text",
  value, onChange, onBlur,
  touched = false, error = "",
  placeholder = "",
  after,
  children,
}) {
  const isSuccess = touched && !error;
  const isError = touched && error;
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>

      <div className={`input-container ${isError ? "error" : isSuccess ? "success" : ""}`}>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
        />
        {after}
        {isSuccess && <CheckCircle className="icon-success" size={18} />}
        {isError && <AlertCircle className="icon-error" size={18} />}
      </div>
      {isError && <span className="error-message">{error}</span>}
      {children}
    </div>
  );
}
TextField.propTypes = { id: PropTypes.string.isRequired, label: PropTypes.string.isRequired,  after: PropTypes.node };
