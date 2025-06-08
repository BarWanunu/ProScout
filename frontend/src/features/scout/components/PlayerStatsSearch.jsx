import { useState, useEffect } from "react";

const statFields = [
  "goals",
  "assists",
  "yellow_cards",
  "red_cards",
  "passes_completed",
  "key_passes",
  "shots_on_target",
  "dribbles_attempted",
  "dribbles_success",
  "dribble_success_rate",
  "tackles",
  "interceptions",
  "duels",
  "duels_won",
  "rating",
];

export default function PlayerStatsSearch({ onFiltersChange }) {
  const [filters, setFilters] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  return (
    <div className="row g-3 mt-3">
      {statFields.map((field) => (
        <div className="col-md-4 text-black" key={field}>
          <label className="form-label text-capitalize">
            Min {field.replace(/_/g, " ")}
          </label>
          <input
            type="number"
            name={`min_${field}`}
            className="form-control"
            value={filters[`min_${field}`] || ""}
            onChange={handleChange}
            min={0}
          />
        </div>
      ))}
    </div>
  );
}
