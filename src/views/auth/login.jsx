import { NavLink } from 'react-router-dom';
import { Card, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import FeatherIcon from 'feather-icons-react';
import logoDark from 'assets/images/logo-dark.svg';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

export default function SignIn1() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post('/auth/login', { email, password }, { withCredentials: true });

      localStorage.setItem("token", res.data.accessToken);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-content text-center">
        <Card className="borderless">
          <Row className="align-items-center text-center">
            <Col>
              <Card.Body className="card-body">
                <img src={logoDark} alt="" className="img-fluid mb-4" />
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
                <Form.Group>
                  <Form.Check type="checkbox" className="text-left mb-4 mt-2" label="Save Credentials." defaultChecked />
                </Form.Group>
                <Button className="btn btn-block btn-primary mb-4" onClick={handleLogin}>Signin</Button>
                <p className="mb-2 text-muted">
                  Forgot password?{' '}
                  <NavLink to="#" className="f-w-400">
                    Reset
                  </NavLink>
                </p>
                <p className="mb-0 text-muted">
                  Don’t have an account?{' '}
                  <NavLink to="/register" className="f-w-400">
                    Signup
                  </NavLink>
                </p>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}
