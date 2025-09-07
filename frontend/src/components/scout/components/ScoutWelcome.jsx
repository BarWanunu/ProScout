import { Button, Row, Col, Container } from "react-bootstrap";
import scoutImage from "../../../assets/scout.jpeg";

export default function ScoutWelcome() {
  return (
    <Container className="my-4">
      <Row className="align-items-center">
        <Col xs="auto">
          <img
            src={scoutImage}
            alt="Scout"
            className="rounded-circle"
            style={{ width: "90px", height: "90px", objectFit: "cover" }}
          />
        </Col>

        <Col>
          <h4 className="mb-0 text-white">Welcome, John Doe</h4>
          <h6 className="mt-2">Explore and discover new talents. Become the best scout using ProScout.</h6>
        </Col>

        <Col xs="auto">
          <Button variant="primary">Open Messages</Button>
        </Col>
      </Row>
    </Container>
  );
}
