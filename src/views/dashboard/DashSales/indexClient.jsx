import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import api from '../../../utils/axios';
import { useAuth } from '../../../context/AuthContext';

const ClientStats = () => {
  const { user, getToken } = useAuth();
  const token = getToken();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatter = new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/stats/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques du client :", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center text-danger mt-4">Aucune statistique disponible.</div>;
  }

  return (
    <div className="container mt-4">
      {/* 🌟 Welcome Section */}
      <div className="mb-4 p-4 bg-light rounded shadow-sm border">
        <h2 className="fw-bold">👋 Bienvenue, {user?.prenom || user?.nom || 'Client'} !</h2>
        <p className="text-muted fs-5 mb-1">
          Voici <strong>Factura Pro</strong>, votre plateforme de gestion de factures moderne.
        </p>
        <p className="text-muted mb-0">
          Consultez vos paiements, suivez les échéances, et restez toujours à jour !
        </p>
      </div>

      {/* 📊 Stats */}
      <h3 className="mb-4">📊 Vos Statistiques</h3>
      <Row>
        <Col md={6} lg={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>Total des factures</Card.Title>
              <Card.Text className="fw-bold fs-4">{stats.totalInvoices}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>Factures payées</Card.Title>
              <Card.Text className="fw-bold fs-5">
                {stats.paidInvoicesCount} / {stats.totalInvoices} ({stats.paidPercentage}%)
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>Reste à payer</Card.Title>
              <Card.Text className="fw-bold text-warning fs-4">
                {formatter.format(stats.outstandingBalance)}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>Factures en retard</Card.Title>
              <Card.Text className="fw-bold text-danger fs-4">{stats.overdueCount}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <Card.Title>Prochaine échéance</Card.Title>
              <Card.Text className="fw-bold text-primary fs-5">
                {stats.nextDueDate
                  ? new Date(stats.nextDueDate).toLocaleDateString()
                  : 'Aucune'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ClientStats;
