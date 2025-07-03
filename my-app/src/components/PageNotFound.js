import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { AlertTriangle } from 'lucide-react';

const PageNotFound = () => (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <Container>
            <Row className="justify-content-center">
                <Col md={8} className="text-center">
                    <AlertTriangle className="text-warning mb-4" size={64} />
                    <h1 className="display-1 fw-bold">404</h1>
                    <p className="h2">Page Not Found</p>
                    <p className="lead text-muted mb-4">
                        Sorry, the page you are looking for does not exist.
                    </p>
                    <Button as={Link} to="/manage" variant="primary">
                        Go to Dashboard
                    </Button>
                </Col>
            </Row>
        </Container>
    </div>
);

export default PageNotFound;