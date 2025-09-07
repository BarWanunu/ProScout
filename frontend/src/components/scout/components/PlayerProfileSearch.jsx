import { useState, useEffect } from "react";
import "../styles/PlayerSearch.css";

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
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (onFiltersChange) onFiltersChange(filters);
  }, [filters, onFiltersChange]);

return (
    <div className="row row-cols-1 row-cols-md-3 g-3 mt-3">
      {/* כל שדה = col */}
      <div className="col">
        <label className="form-label text-black">Position</label>
        <select
          name="position"
          className="form-select"
          value={filters.position}
          onChange={handleInputChange}
        >
          <option value="">Select Position</option>
          {positions.map((pos) => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </div>

      <div className="col">
        <label className="form-label text-black">Club</label>
        <input
          type="text"
          name="club"
          className="form-control"
          value={filters.club}
          onChange={handleInputChange}
        />
      </div>

      <div className="col">
        <label className="form-label text-black">Nationality</label>
        <input
          type="text"
          name="nationality"
          className="form-control"
          value={filters.nationality}
          onChange={handleInputChange}
        />
      </div>

      <div className="col">
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

      <div className="col">
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

      <div className="col">
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

      <div className="col">
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

      <div className="col">
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

      <div className="col">
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
);
}
