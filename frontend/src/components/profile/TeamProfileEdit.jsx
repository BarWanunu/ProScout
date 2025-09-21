import { useState } from 'react';
import teamService from '../../api/services/teamService';
import './ProfileEdit.css';

export default function TeamProfileEdit({ onClose, onSuccess }) {
  const [fieldToEdit, setFieldToEdit] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const [fileValue, setFileValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const availableFields = [
    { value: 'formation', label: 'Formation', type: 'text', placeholder: 'e.g. 4-4-2' },
    { value: 'stadium', label: 'Stadium', type: 'text', placeholder: 'e.g. Old Trafford' },
    { value: 'trophies', label: 'Number of Trophies', type: 'number', placeholder: '0' },
    { value: 'logo', label: 'Team Logo', type: 'file' }
  ];

  const handleFieldSelect = (field) => {
    setFieldToEdit(field);
    setFieldValue('');
    setFileValue('');
    setErrors({});
  };

  const handleValueChange = (e) => {
    const { value, files, type } = e.target;
    
    if (type === 'file') {
      setFileValue(files[0]);
    } else {
      setFieldValue(value);
    }
    
    // Clear errors when user starts changing
    setErrors({});
  };

  const validateField = () => {
    const newErrors = {};
    
    if (fieldToEdit === 'trophies') {
      const trophies = parseInt(fieldValue);
      if (isNaN(trophies) || trophies < 0) {
        newErrors.field = 'Trophies must be 0 or more';
      }
    } else if (fieldToEdit === 'logo') {
      if (!fileValue || fileValue === '') {
        newErrors.field = 'Please select a logo file';
      }
    } else if (['formation', 'stadium'].includes(fieldToEdit)) {
      if (!fieldValue.trim()) {
        newErrors.field = `${availableFields.find(f => f.value === fieldToEdit)?.label} cannot be empty`;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fieldToEdit) {
      alert('Please select a field to update');
      return;
    }
    
    if (!validateField()) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (fieldToEdit === 'logo') {
        await teamService.updateTeamField({ 
          field: 'logo', 
          value: fileValue, 
          token 
        });
      } else {
        await teamService.updateTeamField({ 
          field: fieldToEdit, 
          value: fieldValue, 
          token 
        });
      }
      
      alert(`${availableFields.find(f => f.value === fieldToEdit)?.label} updated successfully!`);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const selectedField = availableFields.find(f => f.value === fieldToEdit);

  return (
    <div className="profile-edit-overlay">
      <div className="profile-edit-modal team-modal">
        <div className="modal-header">
          <h2>Edit Team Profile</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="field-selector">
            <h3>Select field to update:</h3>
            <div className="field-options">
              {availableFields.map(field => (
                <button
                  key={field.value}
                  type="button"
                  className={`field-option ${fieldToEdit === field.value ? 'selected' : ''}`}
                  onClick={() => handleFieldSelect(field.value)}
                  disabled={loading}
                >
                  {field.label}
                </button>
              ))}
            </div>
          </div>

          {fieldToEdit && (
            <div className="field-editor">
              <h3>Update {selectedField?.label}</h3>
              
              {selectedField?.type === 'file' ? (
                <div className="form-group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleValueChange}
                    disabled={loading}
                    required
                  />
                  {errors.field && <span className="error">{errors.field}</span>}
                </div>
              ) : (
                <div className="form-group">
                  <input
                    type={selectedField?.type || 'text'}
                    value={fieldValue}
                    onChange={handleValueChange}
                    placeholder={selectedField?.placeholder}
                    min={selectedField?.type === 'number' ? '0' : undefined}
                    maxLength={selectedField?.type === 'text' ? '100' : undefined}
                    disabled={loading}
                    required
                  />
                  {errors.field && <span className="error">{errors.field}</span>}
                </div>
              )}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={loading || !fieldToEdit}
            >
              {loading ? 'Updating...' : 'Update Field'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}