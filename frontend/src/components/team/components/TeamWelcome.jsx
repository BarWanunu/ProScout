import { Button, Row, Col, Container } from "react-bootstrap";
import "../styles/TeamWelcome.css";
import teamDefaultImage from '../../../assets/scout.jpeg'

export default function TeamWelcome({ team }) {
  const teamName = team?.team_name || "";
  
  // Check if the team has a logo, otherwise use default
  const teamLogo = team?.logo
    ? team.logo.startsWith('http')
      ? team.logo   
      : `${import.meta.env.VITE_API_BASE_URL}/${team.logo}`   
    : teamDefaultImage;

  return (
    <Container className="team-welcome-container">
      <Row className="align-items-center">
        <Col xs="auto">
          <img
            src={teamLogo}
            alt={teamName || "Team"}
            className="rounded"
            style={{ width: "90px", height: "90px", objectFit: "cover" }}
          />
        </Col>

        <Col>
          <h4 className="mb-0 text-white">Welcome, {teamName}</h4>
          <h6 className="mt-2">
            Build and strengthen your team. Find the right players with ProScout.
          </h6>
        </Col>

        <Col xs="auto">
          <Button variant="primary">Open Messages</Button>
        </Col>
      </Row>
    </Container>
  );
}