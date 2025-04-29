// RoleGrid is a thin layout wrapper that renders three RoleCards in a responsive grid

import PropTypes from "prop-types";
import { ROLES } from "../../constants/roles";
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
