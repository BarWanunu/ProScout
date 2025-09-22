import { Button, Row, Col, Container } from "react-bootstrap";
import scoutImage from "../../../assets/scout.jpeg";

export default function ScoutWelcome({ scout }) {
  const name = scout?.first_name ? `${scout.first_name} ${scout.last_name}` : "";
  const welcome = name === "" ? "" : `, ${name}`

  const profilePic = scout?.image
    ? scout.image.startsWith('http')
      ? scout.image   
      : `${import.meta.env.VITE_API_BASE_URL}/${scout.image}`   
    : scoutImage;

  return (
    <Container className="my-4">
      <Row className="align-items-center">
        <Col xs="auto">
          <img
            src={profilePic}
            alt="Scout"
            className="rounded-circle"
            style={{ width: "90px", height: "90px", objectFit: "cover" }}
          />
        </Col>

        <Col>
          
          <h4 className="mb-0 text-white">Welcome{welcome}</h4>
          <h6 className="mt-2">
            Explore and discover new talents. Become the best scout using
            ProScout.
          </h6>
        </Col>

        <Col xs="auto">
          <Button variant="primary">Open Messages</Button>
        </Col>
      </Row>
    </Container>
  );
}
