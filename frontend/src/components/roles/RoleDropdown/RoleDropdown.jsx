import { useState } from "react";
import DropdownButton from "./DropdownBtn.jsx";
import DropdownMenu from "./DropdownMenu.jsx";
import "./RoleDropdown.css";
import { ROLE_META } from "../../../constants/roles";

// This component is a dropdown for selecting user roles. It displays the currently selected role and allows the user to select a different role from a list. The dropdown is toggled by clicking on the button, and the selected role is passed to the parent component through the onSelect callback.

export default function RoleDropdown({ value, onSelect }) {

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Handle role selection
  const handleRoleSelect = (roleId, e) => {
    // Prevent default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    // Just update the role in the form state
    onSelect(roleId);
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
    <div className="role-dropdown">
      <DropdownButton 
        value={value} open={dropdownOpen} roleMeta={ROLE_META}
        onClick={toggleDropdown}
      />
      <DropdownMenu 
        open={dropdownOpen} roleMeta={ROLE_META} 
        onSelect={ handleRoleSelect } 
      />
    </div>
  );
}
