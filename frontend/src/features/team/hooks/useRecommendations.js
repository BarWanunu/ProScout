import { useEffect, useMemo, useState } from "react";
import raw from "./__mock__/recommender.json" // mock data, replace with API later;

/**
 * Returns { players, loading }.
 * Filters are optional:
 *   { position, ageRange:[min,max], lineBreakingMin }
 */
export default function useRecommendations(filters = {}) {
  const [source, setSource] = useState([]);

  // mimic fetch-once
  useEffect(() => {
    setSource(raw); // replace with fetch("/api/recommend") later
  }, []);

  const result = useMemo(() => {
    const {
      position,
      ageRange       = [16, 40],
      lineBreakingMin = 0
    } = filters;

    return source.filter((p) => {
      const ageOk  = p.age >= ageRange[0] && p.age <= ageRange[1];
      const posOk  = !position || p.position === position;
      const lbOk   = p.lineBreaking >= lineBreakingMin;
      return ageOk && posOk && lbOk;
    });
  }, [source, filters]);

  return { players: result, loading: !source.length };
}
