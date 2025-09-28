import React, { useState, useRef, useEffect } from 'react';
import './ActionMenu.css';

const ActionMenu = ({ 
  actions, 
  trigger,
  position = 'bottom-right',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleActionClick = (action) => {
    if (action.onClick) {
      action.onClick();
    }
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`action-menu-container ${className}`}>
      <div 
        ref={triggerRef}
        className="action-menu-trigger"
        onClick={toggleMenu}
      >
        {trigger}
      </div>
      
      {isOpen && (
        <div 
          ref={menuRef}
          className={`action-menu ${position}`}
        >
          {actions.map((action, index) => {
            if (action.type === 'separator') {
              return <div key={`separator-${index}`} className="action-menu-separator" />;
            }
            
            return (
              <button
                key={index}
                className={`action-menu-item ${action.className || ''}`}
                onClick={() => handleActionClick(action)}
                disabled={action.disabled}
                title={action.tooltip}
              >
                {action.icon && <span className="action-icon">{action.icon}</span>}
                <span className="action-label">{action.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;