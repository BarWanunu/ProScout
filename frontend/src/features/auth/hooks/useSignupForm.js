import { useState, useEffect } from "react";

const useSignupForm = () => {
  // Form state
  const [values, setValues] = useState({
    email: "",
    username: "",
    password: "",
    confirm: "",
    role: ""
  });

  // Error state
  const [errors, setErrors] = useState({});
  
  // Touched fields tracking
  const [touched, setTouched] = useState({});
  
  // Form validity state
  const [isValid, setIsValid] = useState(false);

  // Update form values
  const onChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched({
        ...touched,
        [name]: true
      });
    }
  };

  // Handle field blur
  const onBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
  };

  // Select role
  const selectRole = (role) => {
    setValues({
      ...values,
      role
    });
    setTouched({
      ...touched,
      role: true
    });
  };

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validateUsername = (username) => {
    if (!username) return "Username is required";
    if (username.length < 3) return "Username must be at least 3 characters";
    if (username.length > 20) return "Username must be less than 20 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number";
    if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character";
    return "";
  };

  const validateConfirm = (confirm, password) => {
    if (!confirm) return "Please confirm your password";
    if (confirm !== password) return "Passwords do not match";
    return "";
  };

  const validateRole = (role) => {
    if (!role) return "Please select a role";
    return "";
  };

  // Run validation on every value change
  useEffect(() => {
    const newErrors = {};
    
    // Only validate touched fields
    if (touched.email) newErrors.email = validateEmail(values.email);
    if (touched.username) newErrors.username = validateUsername(values.username);
    if (touched.password) newErrors.password = validatePassword(values.password);
    if (touched.confirm) newErrors.confirm = validateConfirm(values.confirm, values.password);
    if (touched.role) newErrors.role = validateRole(values.role);
    
    setErrors(newErrors);
    
    // Check if form is valid (no errors and all fields filled)
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    const allFieldsFilled = values.email && values.username && values.password && values.confirm && values.role;
    
    setIsValid(!hasErrors && allFieldsFilled);
  }, [values, touched]);

  // Validate all fields
  const validate = () => {
    const newErrors = {
      email: validateEmail(values.email),
      username: validateUsername(values.username),
      password: validatePassword(values.password),
      confirm: validateConfirm(values.confirm, values.password),
      role: validateRole(values.role)
    };
    
    setErrors(newErrors);
    setTouched({
      email: true,
      username: true,
      password: true,
      confirm: true,
      role: true
    });
    
    // Check if there are any errors
    return !Object.values(newErrors).some(error => error !== "");
  };

  return {
    values,
    errors,
    touched,
    isValid,
    onChange,
    onBlur,
    selectRole,
    validate
  };
};

export default useSignupForm;