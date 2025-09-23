import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

// This is a redirect component to point to the new search location
export default function PlayerSearchPanelLegacy() {
  useEffect(() => {
    console.warn("PlayerSearchPanel has been moved to @/components/search/PlayerSearchPanel");
  }, []);
  
  return (
    <div className="alert alert-warning">
      <h4>Component Moved</h4>
      <p>Please import PlayerSearchPanel from <code>@/components/search/PlayerSearchPanel</code></p>
    </div>
  );
}