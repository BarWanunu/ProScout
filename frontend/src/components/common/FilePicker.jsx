import PropTypes from "prop-types";
import "./TextField.css"           
/**
 * Generic file chooser.
 * Props:
 *   id, label   – required
 *   accept      – MIME pattern e.g. "video/*"
 *   value       – currently selected File (or null)
 *   onChange(f) – returns File | null
 */
export default function FilePicker({ id, label, accept, value, onChange }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        type="file"
        id={id}
        accept={accept}
        onChange={e => onChange(e.target.files?.[0] ?? null)}
      />
      {value && (
        <span style={{ color: "#4ade80", marginLeft: "0.5rem" }}>
          ✓ {value.name}
        </span>
      )}
    </div>
  );
}

FilePicker.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  accept: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};
FilePicker.defaultProps = { accept: "*" };
