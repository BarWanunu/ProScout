import PropTypes from "prop-types";
import { ROLES } from "../../data/roles";
import RoleCard from "./RoleCard/RoleCard";

const RoleGrid = ({ onSelect }) => (
  <div className="card-grid">
    {ROLES.map(role => (
      <RoleCard key={role.id} role={role} onSelect={onSelect} />
    ))}
  </div>
);

RoleGrid.propTypes = { onSelect: PropTypes.func.isRequired };
export default RoleGrid;
