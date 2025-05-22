// Initial signup page for ProScout application

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, PasswordField, FormStepper, PasswordStrengthIndicator } from "../../../../components/common";
import RoleDropdown from "../../../../components/roles/RoleDropdown/RoleDropdown";
import useSignupForm from "../../hooks/useSignupForm";
import "../../styles/SignupStyles/InitialSignup.css";

export default function InitialSignup() {
  const nav = useNavigate();
  const { values, errors, touched, isValid, onChange, onBlur, selectRole, validate } = useSignupForm();
  // Animation state
  const [fadeIn, setFadeIn] = useState(false);

  // Animate on mount
  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    // Animation before navigation
    setFadeIn(false);
    
    // Delay navigation slightly for animation
    setTimeout(() => {
      // push to step‑2 page and carry creds via location.state
      nav(`/signup/${values.role}`, { 
        state: {
          email: values.email,
          username: values.username,
          password: values.password,
        }
      });
    }, 300);
  };

  return (
    <div className={`si-wrapper ${fadeIn ? 'fade-in' : 'fade-out'}`}>
      <h1 className="si-headline">Create your ProScout account</h1>
      <form className="si-form" onSubmit={handleSubmit}>
        {/* ---- Email field ---- */}
        <TextField
          id="email"   label="Email"
          value={values.email} onChange={onChange} onBlur={onBlur}
          touched={touched.email} error={errors.email}
          placeholder="your.email@example.com"
        />
        {/* ---- Username field ---- */}
        <TextField
          id="username" label="Username"
          value={values.username} onChange={onChange} onBlur={onBlur}
          touched={touched.username} error={errors.username}
          placeholder="Choose a username"
        />

        {/* ---- Password field ---- */}
        <PasswordField
          id="password" label="Password" 
          value={values.password} onChange={onChange} onBlur={onBlur}
          touched={touched.password} error={errors.password}
          placeholder="Choose a password"
          children = {<PasswordStrengthIndicator value={values.password}/>}  
        />
         
        {/* ---- Confirm Password field ---- */}
        <PasswordField
          id="confirm" label="Confirm Password"
          value={values.confirm} onChange={onChange} onBlur={onBlur}
          touched={touched.confirm} error={errors.confirm} 
          placeholder="Re-enter your password"
        />
        {/* ---- Role selector dropdown ---- */}
        <div className="form-field">
          <label>Select Your Role</label>
          <RoleDropdown value={values.role} onSelect={selectRole} />
          {touched.role && errors.role && <span className="error-message">{errors.role}</span>}
        </div>

        {/* ---- Submit button ---- */}
        <button 
          type="submit" 
          className={`si-submit ${isValid ? 'active' : 'disabled'}`}
          disabled={!isValid}
        >
          Continue to Next Step
        </button>
        
        {/* ---- Form progress indicator ---- */}
        <FormStepper step={0} />
      </form>
    </div>
  );
}