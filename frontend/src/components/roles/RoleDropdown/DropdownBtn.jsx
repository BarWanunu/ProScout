import "./RoleDropdown.css";
import { ChevronDown } from "lucide-react";

// This component is a button for a dropdown menu that displays the currently selected role. It shows an icon and label for the selected role, or a placeholder text if no role is selected. The button also indicates whether the dropdown is open or closed with an arrow icon.
export default function DropdownBtn({ value, open, roleMeta, onClick }) {
  return (
    <button
        type="button"
        className={`role-dropdown-toggle ${value ? `selected ${value}` : ""}`}
        onClick={onClick}
    >
        {value ? (
            <>
            {/** assign then render the component */}
            {(() => {
                const RoleIcon = roleMeta[value].icon;
                return <RoleIcon className="role-icon" />;
                })()}
                <span>{roleMeta[value].label}</span>
            </>
            ) : (
                <span>Select a role</span>
                )}
                <ChevronDown size={18} className={`dropdown-arrow ${open ? 'open' : ''}`} />
    </button>
  );
}
