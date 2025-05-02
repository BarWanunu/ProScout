// This component is used to display a role card in the roles selection page.
// It shows the role's title, description, and an icon. When clicked, it calls the onSelect function with the role's id.

import PropTypes from "prop-types";
import "./RoleCard.css"


const RoleCard = ({ role, onSelect }) => {
  const { id, title, description, icon: Icon, colorClass } = role;

  return (
    <div role="button" className="card" onClick={() => onSelect(id)}>
      <div className={`card__icon ${colorClass}`}>
        <Icon className="text-white h-8 w-8" />
      </div>
      <h3 className="card__title">{title}</h3>
      <p className="card__text">{description}</p>
    </div>
  );
};

RoleCard.propTypes = {
  role: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default RoleCard;
