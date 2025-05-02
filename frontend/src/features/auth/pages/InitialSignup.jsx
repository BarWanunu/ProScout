// Initial signup page for ProScout application
import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { UserIcon, UsersIcon, EyeIcon, CheckCircle, AlertCircle, ChevronDown } from 'lucide-react';
import useSignupForm from "../hooks/useSignupForm";
import "../styles/InitialSignup.css";

// Role metadata for the signup page
// Each role has a label, icon, and color for styling
const ROLE_META = {
  player: { label: "Player", icon: UserIcon, color: "blue", description: "Join as a player to showcase your skills" },
  team: { label: "Team", icon: UsersIcon, color: "green", description: "Join as a team to find talented players" },
  scout: { label: "Scout", icon: EyeIcon, color: "purple", description: "Join as a scout to discover new talent" },
};

export default function InitialSignup() {
  const nav = useNavigate();
  const { values, errors, touched, isValid, onChange, onBlur, selectRole, validate } = useSignupForm();
  
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // State for role dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
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

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Toggle confirm password visibility
  const toggleConfirmVisibility = () => {
    setShowConfirm(!showConfirm);
  };
  
  // Handle role selection - FIXED to prevent navigation
  const handleRoleSelect = (roleId, e) => {
    // Prevent default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Just update the role in the form state
    selectRole(roleId);
    
    // Close the dropdown
    setDropdownOpen(false);
    
    // Return false to prevent any default behavior
    return false;
  };

  // Toggle dropdown without navigation
  const toggleDropdown = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDropdownOpen(!dropdownOpen);
    return false;
  };

  return (
    <div className={`si-wrapper ${fadeIn ? 'fade-in' : 'fade-out'}`}>
      <h1 className="si-headline">Create your ProScout account</h1>

      <form className="si-form" onSubmit={handleSubmit}>
        {/* ---- Email field ---- */}
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <div className={`input-container ${touched.email && (errors.email ? 'error' : 'success')}`}>
            <input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="your.email@example.com"
            />
            {touched.email && !errors.email && <CheckCircle className="icon-success" size={18} />}
            {touched.email && errors.email && <AlertCircle className="icon-error" size={18} />}
          </div>
          {touched.email && errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {/* ---- Username field ---- */}
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <div className={`input-container ${touched.username && (errors.username ? 'error' : 'success')}`}>
            <input
              id="username"
              name="username"
              value={values.username}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Choose a username"
            />
            {touched.username && !errors.username && <CheckCircle className="icon-success" size={18} />}
            {touched.username && errors.username && <AlertCircle className="icon-error" size={18} />}
          </div>
          {touched.username && errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        {/* ---- Password field ---- */}
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <div className={`input-container ${touched.password && (errors.password ? 'error' : 'success')}`}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {touched.password && !errors.password && <CheckCircle className="icon-success" size={18} />}
            {touched.password && errors.password && <AlertCircle className="icon-error" size={18} />}
          </div>
          {touched.password && errors.password && <span className="error-message">{errors.password}</span>}
          
          {/* Password strength indicator */}
          {values.password && (
            <div className="password-strength">
              <div className="strength-meter">
                <div 
                  className={`strength-value ${
                    values.password.length >= 8 ? 
                      (/[A-Z]/.test(values.password) && /[a-z]/.test(values.password) && /[0-9]/.test(values.password) && /[^A-Za-z0-9]/.test(values.password) ? 
                        'strong' : 'medium') 
                      : 'weak'
                  }`}
                ></div>
              </div>
              <span className="strength-text">
                {values.password.length < 8 ? 'Weak' : 
                  (/[A-Z]/.test(values.password) && /[a-z]/.test(values.password) && /[0-9]/.test(values.password) && /[^A-Za-z0-9]/.test(values.password) ? 
                    'Strong' : 'Medium')}
              </span>
            </div>
          )}
        </div>

        {/* ---- Confirm Password field ---- */}
        <div className="form-field">
          <label htmlFor="confirm">Confirm Password</label>
          <div className={`input-container ${touched.confirm && (errors.confirm ? 'error' : 'success')}`}>
            <input
              id="confirm"
              name="confirm"
              type={showConfirm ? "text" : "password"}
              value={values.confirm}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="toggle-visibility"
              onClick={toggleConfirmVisibility}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
            {touched.confirm && !errors.confirm && <CheckCircle className="icon-success" size={18} />}
            {touched.confirm && errors.confirm && <AlertCircle className="icon-error" size={18} />}
          </div>
          {touched.confirm && errors.confirm && <span className="error-message">{errors.confirm}</span>}
        </div>

        {/* ---- Role selector dropdown ---- */}
        <div className="form-field">
          <label>Select Your Role</label>
          <div className="role-dropdown">
            <button 
              type="button" 
              className={`role-dropdown-toggle ${values.role ? `selected ${values.role}` : ''}`}
              onClick={toggleDropdown}
            >
              {values.role ? (
                <>
                  {/** assign then render the component */}
                  {(() => {
                     const RoleIcon = ROLE_META[values.role].icon;
                     return <RoleIcon className="role-icon" />;
                   })()}
                  <span>{ROLE_META[values.role].label}</span>
                </>
              ) : (
                <span>Select a role</span>
              )}
              <ChevronDown size={18} className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
            </button>
            
            {dropdownOpen && (
              <div className="role-dropdown-menu">
                {Object.entries(ROLE_META).map(([id, meta]) => {
                  const Icon = meta.icon;
                  return (
                    <button
                        type="button"
                        key={id}
                        className={`role-option ${id}`}
                        onClick={(e) => handleRoleSelect(id, e)}
                    >
                      <Icon className="role-icon" />
                      <div className="role-info">
                        <span className="role-label">{meta.label}</span>
                        <span className="role-description">{meta.description}</span>
                      </div>
                    </button>
                    
                  );
                })}
              </div>
            )}
          </div>
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
        <div className="form-progress">
          <div className="progress-step active">Account</div>
          <div className="progress-connector"></div>
          <div className="progress-step">Profile</div>
          <div className="progress-connector"></div>
          <div className="progress-step">Complete</div>
        </div>
      </form>
    </div>
  );
}