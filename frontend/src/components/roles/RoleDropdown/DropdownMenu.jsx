import "./RoleDropdown.css";

// This component is a dropdown menu that displays a list of roles. When a role is selected, it triggers the onSelect function passed as a prop. The menu is only visible when the open prop is true.
export default function DropdownMenu({ open, roleMeta, onSelect}){
    return (
        open && (
            <div className="role-dropdown-menu">
                {Object.entries(roleMeta).map(([id, meta]) => {
                    const Icon = meta.icon;
                    return (
                        <button 
                            type="button"
                            key={id} 
                            className={`role-option ${id}`}
                            onClick={(e) => onSelect(id, e)}
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
        )
    )
}