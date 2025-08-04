import { useEffect, useState } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import FlatCard from 'components/Widgets/Statistic/FlatCard';
import api from '../../../utils/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    paidPercentage: 0,
    monthlyLabels: [],
    monthlyData: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clientsRes, invoicesRes, monthlyRes] = await Promise.all([
          api.get('http://localhost:3001/stats/clients'),
          api.get('http://localhost:3001/stats/invoices'),
          api.get('http://localhost:3001/stats/invoices/monthly')
        ]);

        setStats({
          totalClients: clientsRes.data.totalClients,
          totalInvoices: invoicesRes.data.totalInvoices,
          totalRevenue: invoicesRes.data.totalRevenue,
          paidPercentage: invoicesRes.data.paidPercentage,
          monthlyLabels: monthlyRes.data.labels,
          monthlyData: monthlyRes.data.data
        });
      } catch (err) {
        console.error('Erreur lors de la récupération des statistiques', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const monthlyChartOptions = {
    chart: { id: 'monthly-invoices' },
    xaxis: { categories: stats.monthlyLabels },
    title: { text: 'Évolution mensuelle des factures', align: 'center' },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: {
        columnWidth: '50%'
      }
    }
  };

  const monthlyChartSeries = [
    {
      name: 'Total TTC',
      data: stats.monthlyData
    }
  ];

  const formatter = new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND'
  });

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 fw-bold">📊 Tableau de bord Administrateur</h2>
      <Row className="mb-4">
        <Col md={6} xl={4}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <FlatCard
                params={{
                  title: 'Clients',
                  icon: 'group',
                  iconClass: 'text-primary mb-1',
                  value: stats.totalClients
                }}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={4}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <FlatCard
                params={{
                  title: 'Factures',
                  icon: 'receipt',
                  iconClass: 'text-primary mb-1',
                  value: stats.totalInvoices
                }}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} xl={4}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <FlatCard
                params={{
                  title: 'Chiffre d’affaires',
                  icon: 'attach_money',
                  iconClass: 'text-success mb-1',
                  value: formatter.format(stats.totalRevenue)
                }}
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
              <h2 className="text-success fw-bold">{stats.paidPercentage}%</h2>
              <p className="text-muted">Basé sur le nombre total de factures.</p>
              <Chart
                type="radialBar"
                series={[parseFloat(stats.paidPercentage)]}
                options={{
                  chart: { type: 'radialBar' },
                  labels: ['Payées'],
                  colors: ['#28a745']
                }}
                height={250}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={12} xl={6}>
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">📊 Factures par mois</h5>
            </Card.Header>
            <Card.Body>
              <Chart
                type="bar"
                height={350}
                options={monthlyChartOptions}
                series={monthlyChartSeries}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
