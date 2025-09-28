import { useState } from 'react';
import playerService from '../../../api/services/playerService';
import { POSITIONS } from '../../../data/positions';
import '../styles/ProfileEdit.css';

export default function PlayerProfileEdit({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    age: '',
    number: '',
    position: '',
    height: '',
    weight: '',
    club: '',
    photo: '',
    video: '',
    videoFile: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [videoInputType, setVideoInputType] = useState('url'); // 'url' or 'file'

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleVideoTypeToggle = (type) => {
    setVideoInputType(type);
    // Clear video data when switching types
    setFormData(prev => ({
      ...prev,
      video: '',
      videoFile: ''
    }));
    // Clear any video errors
    if (errors.video) {
      setErrors(prev => ({
        ...prev,
        video: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.age && (parseInt(formData.age) < 16 || parseInt(formData.age) > 45)) {
      newErrors.age = 'Age must be between 16-45';
    }
    
    if (formData.number && (parseInt(formData.number) < 0 || parseInt(formData.number) > 99)) {
      newErrors.number = 'Jersey number must be between 0-99';
    }
    
    if (formData.height && parseInt(formData.height) <= 0) {
      newErrors.height = 'Height must be a positive number';
    }
    
    if (formData.weight && parseInt(formData.weight) <= 0) {
      newErrors.weight = 'Weight must be a positive number';
    }
    
    // Validate video URL if provided
    if (videoInputType === 'url' && formData.video && formData.video.trim()) {
      try {
        new URL(formData.video);
      } catch {
        newErrors.video = 'Please enter a valid URL';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // Check if at least one field is filled
    const hasData = Object.entries(formData).some(([key, value]) => {
      if (['photo', 'videoFile'].includes(key)) return value && value !== '';
      if (key === 'video' && videoInputType === 'url') return value.trim() !== '';
      if (key === 'video' || key === 'videoFile') return false; // Skip these in this check
      return value.trim() !== '';
    });
    
    if (!hasData) {
      alert('Please fill at least one field to update');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Filter out empty fields (except files)
      const updateData = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'photo' && value && value !== '') {
          updateData[key] = value;
        } else if (key === 'videoFile' && value && value !== '' && videoInputType === 'file') {
          updateData.video = value; // Send video file as 'video' field
        } else if (key === 'video' && value.trim() !== '' && videoInputType === 'url') {
          updateData[key] = value;
        } else if (!['photo', 'video', 'videoFile'].includes(key) && value.trim() !== '') {
          updateData[key] = value;
        }
      });
      
      await playerService.updatePlayer(updateData, token);
      
      alert('Profile updated successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
      alert(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-edit-overlay">
      <div className="profile-edit-modal">
        <div className="modal-header">
          <h2>Edit Player Profile</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="profile-edit-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="16-45"
                min="16"
                max="45"
                disabled={loading}
              />
              {errors.age && <span className="error">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="number">Jersey Number</label>
              <input
                type="number"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="0-99"
                min="0"
                max="99"
                disabled={loading}
              />
              {errors.number && <span className="error">{errors.number}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="position">Position</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select Position</option>
                {POSITIONS.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="e.g. 180"
                min="1"
                disabled={loading}
              />
              {errors.height && <span className="error">{errors.height}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g. 75"
                min="1"
                disabled={loading}
              />
              {errors.weight && <span className="error">{errors.weight}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="club">Current Club</label>
              <input
                type="text"
                id="club"
                name="club"
                value={formData.club}
                onChange={handleChange}
                placeholder="e.g. FC Barcelona"
                maxLength="100"
                disabled={loading}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="photo">Profile Photo</label>
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handleChange}
                accept="image/*"
                disabled={loading}
              />
            </div>

            <div className="form-group full-width">
              <label>Video</label>
              <div className="video-input-container">
                <div className="video-type-toggle">
                  <button
                    type="button"
                    className={`toggle-btn ${videoInputType === 'url' ? 'active' : ''}`}
                    onClick={() => handleVideoTypeToggle('url')}
                    disabled={loading}
                  >
                    URL Link
                  </button>
                  <button
                    type="button"
                    className={`toggle-btn ${videoInputType === 'file' ? 'active' : ''}`}
                    onClick={() => handleVideoTypeToggle('file')}
                    disabled={loading}
                  >
                    Upload File
                  </button>
                </div>
                
                {videoInputType === 'url' ? (
                  <input
                    type="url"
                    name="video"
                    value={formData.video}
                    onChange={handleChange}
                    placeholder="https://youtube.com/... or https://vimeo.com/..."
                    disabled={loading}
                  />
                ) : (
                  <input
                    type="file"
                    name="videoFile"
                    onChange={handleChange}
                    accept="video/*"
                    disabled={loading}
                  />
                )}
                {errors.video && <span className="error">{errors.video}</span>}
              </div>
            </div>
          </div>

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
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}