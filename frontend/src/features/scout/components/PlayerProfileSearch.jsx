import { useState } from "react";
import "../styles/PlayerProfileSearch.css";

export default function PlayerProfileSearch({ onFiltersChange }) {
  const positions = ["Goalkeeper", "Defender", "Midfielder", "Attacker"];

  const [filters, setFilters] = useState({
    position: "",
    club: "",
    nationality: "",
    ageMin: "",
    ageMax: "",
    heightMin: "",
    heightMax: "",
    weightMin: "",
    weightMax: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value };
    setFilters(updated);
    if (onFiltersChange) onFiltersChange(updated);
  };

  return (
    <div className="player-stats-box p-4"> {/* תואם לקופסה של סטטיסטיקות */}
      <div className="row g-3">
        {/* Position */}
        <div className="col-md-4">
          <label className="form-label text-black">Position</label>
          <select
            name="position"
            className="form-select"
            value={filters.position}
            onChange={handleInputChange}
          >
            <option value="">Select Position</option>
            {positions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>
        </div>

        {/* Club */}
        <div className="col-md-4">
          <label className="form-label text-black">Club</label>
          <input
            type="text"
            name="club"
            className="form-control"
            value={filters.club}
            onChange={handleInputChange}
          />
        </div>

        {/* Nationality */}
        <div className="col-md-4">
          <label className="form-label text-black">Nationality</label>
          <input
            type="text"
            name="nationality"
            className="form-control"
            value={filters.nationality}
            onChange={handleInputChange}
          />
        </div>

        {/* Age */}
        <div className="col-md-6">
          <label className="form-label text-black">Min Age</label>
          <input
            type="number"
            name="ageMin"
            className="form-control"
            value={filters.ageMin}
            onChange={handleInputChange}
            min={0}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-black">Max Age</label>
          <input
            type="number"
            name="ageMax"
            className="form-control"
            value={filters.ageMax}
            onChange={handleInputChange}
            min={0}
          />
        </div>

        {/* Height */}
        <div className="col-md-6">
          <label className="form-label text-black">Min Height (cm)</label>
          <input
            type="number"
            name="heightMin"
            className="form-control"
            value={filters.heightMin}
            onChange={handleInputChange}
            min={0}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-black">Max Height (cm)</label>
          <input
            type="number"
            name="heightMax"
            className="form-control"
            value={filters.heightMax}
            onChange={handleInputChange}
            min={0}
          />
        </div>

        {/* Weight */}
        <div className="col-md-6">
          <label className="form-label text-black">Min Weight (kg)</label>
          <input
            type="number"
            name="weightMin"
            className="form-control"
            value={filters.weightMin}
            onChange={handleInputChange}
            min={0}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label text-black">Max Weight (kg)</label>
          <input
            type="number"
            name="weightMax"
            className="form-control"
            value={filters.weightMax}
            onChange={handleInputChange}
            min={0}
          />
        </div>
      </div>
    </div>
  );
}
