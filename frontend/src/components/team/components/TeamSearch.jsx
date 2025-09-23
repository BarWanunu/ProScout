import React, { useEffect } from "react";
import { TeamSearch as NewTeamSearch } from "@/components/search";
import '../styles/TeamSearch.css';

// This is a redirect component to point to the new search location
export default function TeamSearch() {
  useEffect(() => {
    console.warn("TeamSearch has been moved to @/components/search/TeamSearch");
  }, []);
  
  return <NewTeamSearch />;
}