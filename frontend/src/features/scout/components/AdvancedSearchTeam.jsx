
export default function AdvancedSearchTeam({ league, setLeague, country, setCountry, formation, setFormation }) {
  return (
    <div className="advanced-team-fields">
      <div className="field-group">
        <label>League</label>
        <select value={league} onChange={(e) => setLeague(e.target.value)}>
          <option value="">Select League</option>
          <option value="Bundesliga">Bundesliga</option>
          <option value="La Liga">La Liga</option>
          <option value="Ligue 1">Ligue 1</option>
          <option value="Premier League">Premier League</option>
          <option value="Serie A">Serie A</option>
        </select>
      </div>

      <div className="field-group">
        <label>Country</label>
        <input
          type="text"
          placeholder="Enter country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>

      <div className="field-group">
        <label>Formation</label>
        <select value={formation} onChange={(e) => setFormation(e.target.value)}>
          <option value="">Select Formation</option>
          <option>4-3-3</option>
          <option>4-4-2</option>
          <option>3-5-2</option>
          <option>4-1-4-1</option>
          <option>3-4-1-2</option>
          <option>4-1-2-1-2</option>
          <option>4-2-3-1</option>
          <option>3-4-2-1</option>
        </select>
      </div>
    </div>
  );
}
