import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import FlatCard from 'components/Widgets/Statistic/FlatCard';
import api from '../../../utils/axios';
import { useAuth } from '../../../context/AuthContext';

const Dashboard = () => {
  const { user, getToken } = useAuth();
  const token = getToken();

  const [adminStats, setAdminStats] = useState({
    totalClients: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    paidPercentage: 0,
    monthlyLabels: [],
    monthlyData: []
  });
  const [clientStats, setClientStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatter = new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (user?.role === 'admin') {
          const [clientsRes, invoicesRes, monthlyRes] = await Promise.all([
            api.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/stats/clients`),
            api.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/stats/invoices`),
            api.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/stats/invoices/monthly`)
          ]);

          setAdminStats({
            totalClients: clientsRes.data.totalClients,
            totalInvoices: invoicesRes.data.totalInvoices,
            totalRevenue: invoicesRes.data.totalRevenue,
            paidPercentage: invoicesRes.data.paidPercentage,
            monthlyLabels: monthlyRes.data.labels,
            monthlyData: monthlyRes.data.data
          });
        } else {
          const res = await api.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/stats/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setClientStats(res.data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (user?.role === 'admin') {
    const monthlyChartOptions = {
      chart: { id: 'monthly-invoices' },
      xaxis: { categories: adminStats.monthlyLabels },
      title: { text: 'Évolution mensuelle des factures', align: 'center' },
      dataLabels: { enabled: false },
      plotOptions: { bar: { columnWidth: '50%' } }
    };

    const monthlyChartSeries = [
      {
        name: 'Total TTC',
        data: adminStats.monthlyData
      }
    ];

    return (
      <div className="container mt-4">
        <h2 className="mb-4 fw-bold">📊 Tableau de bord Administrateur</h2>
        <Row className="mb-4">
          <Col md={6} xl={4}>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <FlatCard
                  params={{ title: 'Clients', icon: 'group', iconClass: 'text-primary mb-1', value: adminStats.totalClients }}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} xl={4}>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <FlatCard
                  params={{ title: 'Factures', icon: 'receipt', iconClass: 'text-primary mb-1', value: adminStats.totalInvoices }}
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} xl={4}>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <FlatCard
                  params={{ title: 'Chiffre d’affaires', icon: 'attach_money', iconClass: 'text-success mb-1', value: formatter.format(adminStats.totalRevenue) }}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12} xl={6}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-2">📈 Pourcentage de factures payées</h5>
                <h2 className="text-success fw-bold">{adminStats.paidPercentage}%</h2>
                <p className="text-muted">Basé sur le nombre total de factures.</p>
                <Chart type="radialBar" series={[parseFloat(adminStats.paidPercentage)]} options={{ chart: { type: 'radialBar' }, labels: ['Payées'], colors: ['#28a745'] }} height={250} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={12} xl={6}>
            <Card className="shadow-sm">
              <Card.Header><h5 className="mb-0">📊 Factures par mois</h5></Card.Header>
              <Card.Body>
                <Chart type="bar" height={350} options={monthlyChartOptions} series={monthlyChartSeries} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  } else {
    return (
      <div className="container mt-4">
        <div className="mb-4 p-4 bg-light rounded shadow-sm border">
          <h2 className="fw-bold">👋 Bienvenue, {user?.prenom || user?.nom || 'Client'} !</h2>
          <p className="text-muted fs-5 mb-1">
            Voici <strong>Factura Pro</strong>, votre plateforme de gestion de factures moderne.
          </p>
          <p className="text-muted mb-0">
            Consultez vos paiements, suivez les échéances, et restez toujours à jour !
          </p>
        </div>

        <h3 className="mb-4">📊 Vos Statistiques</h3>
        <Row>
          <Col md={6} lg={4}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>Total des factures</Card.Title>
                <Card.Text className="fw-bold fs-4">{clientStats.totalInvoices}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>Factures payées</Card.Title>
                <Card.Text className="fw-bold fs-5">
                  {clientStats.paidInvoicesCount} / {clientStats.totalInvoices} ({clientStats.paidPercentage}%)
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>Reste à payer</Card.Title>
                <Card.Text className="fw-bold text-warning fs-4">
                  {formatter.format(clientStats.outstandingBalance)}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>Factures en retard</Card.Title>
                <Card.Text className="fw-bold text-danger fs-4">{clientStats.overdueCount}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="mb-3 shadow-sm">
              <Card.Body>
                <Card.Title>Prochaine échéance</Card.Title>
                <Card.Text className="fw-bold text-primary fs-5">
                  {clientStats.nextDueDate ? new Date(clientStats.nextDueDate).toLocaleDateString() : 'Aucune'}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
};

export default Dashboard;
