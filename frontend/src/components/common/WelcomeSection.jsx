import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import scoutDefaultImage from "../../assets/scout.jpeg";
import "./WelcomeSection.css";

export default function WelcomeSection({ 
  user, 
  userType = "scout", // "scout", "team", "player"
  imageStyle = "circle", // "circle" or "square"
}) {
  // Default values based on user type
  const defaults = {
    scout: {
      image: scoutDefaultImage,
      subtitle: "Explore and discover new talents. Become the best scout using ProScout.",
      imgShape: "rounded-circle",
    },
    team: {
      image: scoutDefaultImage,
      subtitle: "Build and strengthen your team. Find the right players with ProScout.",
      imgShape: "rounded",
    },
    player: {
      image: scoutDefaultImage,
      subtitle: "Showcase your skills and get discovered. Take your career to the next level with ProScout.",
      imgShape: "rounded-circle",
    }
  };
  
  // Determine which default values to use
  const currentDefaults = defaults[userType] || defaults.scout;
  
  // Determine name/display based on user type
  let displayName = "";
  if (user) {
    switch (userType) {
      case "scout":
        displayName = user.first_name ? `${user.first_name} ${user.last_name || ""}`.trim() : "";
        break;
      case "team":
        displayName = user.team_name || "";
        break;
      case "player":
        displayName = user.name || "";
        break;
      default:
        displayName = "";
    }
  }

  // Add comma only if there's a name to display
  const welcomeSuffix = displayName ? `, ${displayName}` : "";
  
  // Determine profile image
  const profileImage = user?.image || user?.logo || user?.photo
    ? (user.image || user.logo || user.photo).startsWith('http')
      ? (user.image || user.logo || user.photo)
      : `${import.meta.env.VITE_API_BASE_URL}/${user.image || user.logo}`
    : currentDefaults.image;

  // Image shape class based on user type or override
  const imageShapeClass = imageStyle === "circle" ? "rounded-circle" : "rounded";

  return (
    <div className="welcome-section-container">
      <Row className="align-items-center">
        <Col xs="auto" className="pe-4">
          <img
            src={profileImage}
            alt={`${userType} Profile`}
            className={imageShapeClass}
          />
        </Col>

        <Col>
          <h4 className="text-white">Welcome{welcomeSuffix}</h4>
          <h6>
            {currentDefaults.subtitle}
          </h6>
        </Col>

        <Col xs="auto">
          <Button 
            variant="primary" 
            size="lg" 
            className="px-4 py-2"
          >
            Open Messages
          </Button>
        </Col>
      </Row>
    </div>
  );
}