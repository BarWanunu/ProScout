import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange(filters);
    }
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="player-profile-box p-4">
      <div className="row g-3">
        <div className="col-md-4">
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
        <div className="col-md-4">
          <input
            type="text"
            name="club"
            className="form-control"
            placeholder="Club"
            value={filters.club}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="nationality"
            className="form-control"
            placeholder="Nationality"
            value={filters.nationality}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-md-6">
          <input
            type="number"
            name="ageMin"
            className="form-control"
            placeholder="Min Age"
            value={filters.ageMin}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6">
          <input
            type="number"
            name="ageMax"
            className="form-control"
            placeholder="Max Age"
            value={filters.ageMax}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-md-6">
          <input
            type="number"
            name="heightMin"
            className="form-control"
            placeholder="Min Height (cm)"
            value={filters.heightMin}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6">
          <input
            type="number"
            name="heightMax"
            className="form-control"
            placeholder="Max Height (cm)"
            value={filters.heightMax}
            onChange={handleInputChange}
          />
        </div>

        <div className="col-md-6">
          <input
            type="number"
            name="weightMin"
            className="form-control"
            placeholder="Min Weight (kg)"
            value={filters.weightMin}
            onChange={handleInputChange}
          />
        </div>
        <div className="col-md-6">
          <input
            type="number"
            name="weightMax"
            className="form-control"
            placeholder="Max Weight (kg)"
            value={filters.weightMax}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
}
