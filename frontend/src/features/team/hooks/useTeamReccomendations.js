import { useState, useEffect } from "react";

export default function useTeamRecommendations({ position, age, lineBreaking }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    // TODO replace with real fetch(`/api/recommend?pos=${position}&ageMin=${age[0]}&ageMax=${age[1]}`)
    import("./__mock__/recommender.json").then(m => {
      setList(
        m.default.filter(p =>
          p.position === position &&
          p.age >= age[0] && p.age <= age[1] &&
          p.lineBreaking >= lineBreaking
        )
      );
    });
  }, [position, age, lineBreaking]);

  return list;
}
