// src/pages/Unauthorized.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/dashboard'); // or navigate('/login') if user is unauthenticated
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center">
        <div className="display-1 fw-bold text-danger mb-4">🚫 403</div>
        <h1 className="mb-3 fw-semibold">Accès refusé</h1>
        <p className="text-muted mb-4">
          Vous n'avez pas l'autorisation pour accéder à cette page.
        </p>
        <Button variant="primary" onClick={handleGoBack}>
          Retour au tableau de bord
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
