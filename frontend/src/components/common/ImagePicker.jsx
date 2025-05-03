// Description: A simple image picker component that allows users to select an image file from their device. It displays a label and a file input field, and shows a checkmark when an image is selected. 

import PropTypes from "prop-types";
import "./TextField.css"

export default function ImagePicker({ id, label, value, onChange }) {
  return (
    <div className="form-field">
      <label>{label}</label>
      <input type="file" id={id} accept="image/*"
             onChange={e => onChange(e.target.files[0])} />
      {value && <span style={{ color:"#4ade80" }}>✓ Selected</span>}
    </div>
  );
}
ImagePicker.propTypes = { id:PropTypes.string.isRequired, label:PropTypes.string.isRequired };
