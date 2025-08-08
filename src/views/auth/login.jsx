import { NavLink } from 'react-router-dom';
import { Card, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import logoDark from 'assets/images/logo-dark.svg';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';

export default function SignIn1() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate('/');

    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };


  return (
    <div className="auth-wrapper">
      <div className="auth-content text-center">
        <Card className="borderless">
          <Row className="align-items-center text-center">
            <Col>
              <Card.Body className="card-body">
                <h1 className="mb-4 fw-bold text-primary" style={{ fontSize: '2rem', letterSpacing: '1px' }}>
                  FacturaPro
                </h1>

                <h4 className="mb-3 f-w-400">Signin</h4>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FeatherIcon icon="mail" />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <FeatherIcon icon="lock" />
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </InputGroup>
                
                <Button className="btn btn-block btn-primary mb-4" onClick={handleLogin}>Signin</Button>
                
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}
