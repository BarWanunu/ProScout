import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const TrialsTab = ({ trials = [] }) => {
  // If trials data hasn't been loaded yet or is empty
  if (!trials.length) {
    return (
      <Container className="py-4">
        <Card className="shadow-sm p-4 text-center">
          <h4>No Trials Scheduled</h4>
          <p className="mb-4">You haven't scheduled any player trials yet.</p>
          <p>
            Trials help you evaluate players in person before making recruitment decisions.
            Schedule a trial with a player to test their skills and see if they're a good fit for your team.
          </p>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h4 className="mb-3">Upcoming Trials</h4>
          <p>Manage your scheduled player evaluations and trials</p>
        </Col>
      </Row>

      <Row>
        {trials.map((trial) => (
          <Col md={6} lg={4} key={trial.id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between">
                  <h5>{trial.player?.name || "Player Name"}</h5>
                  <span className={`badge ${getStatusBadgeClass(trial.status)}`}>
                    {trial.status}
                  </span>
                </div>
                <p className="text-muted mb-3">
                  {new Date(trial.date).toLocaleDateString()} at {trial.time}
                </p>

                <div className="mb-3">
                  <strong>Location:</strong> {trial.location}
                </div>

                {trial.notes && (
                  <div className="mb-3">
                    <strong>Notes:</strong>
                    <p className="small mb-0">{trial.notes}</p>
                  </div>
                )}
              </Card.Body>
              <Card.Footer className="bg-transparent d-flex justify-content-between">
                <button className="btn btn-sm btn-outline-primary">
                  Edit Details
                </button>
                <button className="btn btn-sm btn-danger">
                  Cancel Trial
                </button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

// Helper function to determine badge class based on status
const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'bg-success';
    case 'pending':
      return 'bg-warning text-dark';
    case 'cancelled':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
};

export default TrialsTab;