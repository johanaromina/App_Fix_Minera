import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const LoadingSpinner: React.FC = () => {
  return (
    <Container fluid className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row>
        <Col className="text-center">
          <div className="spinner-custom mx-auto mb-3"></div>
          <h5 className="text-muted">Cargando...</h5>
        </Col>
      </Row>
    </Container>
  );
};

export default LoadingSpinner;
