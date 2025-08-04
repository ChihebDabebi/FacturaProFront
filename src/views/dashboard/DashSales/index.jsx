import { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import FlatCard from 'components/Widgets/Statistic/FlatCard';
import api from '../../../utils/axios';

export default function DashSales() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    paidPercentage: 0,
    monthlyLabels: [],
    monthlyData: []
  });

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
      }
    };

    fetchStats();
  }, []);

  const monthlyChartOptions = {
    chart: { id: 'invoices-by-month' },
    xaxis: { categories: stats.monthlyLabels },
    dataLabels: { enabled: false },
    title: { text: 'Factures par mois', align: 'center' }
  };

  const monthlyChartSeries = [{ name: 'Total TTC', data: stats.monthlyData }];

  return (
    <Row>
      <Col md={12} xl={6}>
        <Card className="flat-card">
          <div className="row-table">
            <Card.Body className="col-sm-6 br">
              <FlatCard params={{ title: 'Clients', iconClass: 'text-primary mb-1', icon: 'group', value: stats.totalClients }} />
            </Card.Body>
            <Card.Body className="col-sm-6 br">
              <FlatCard params={{ title: 'Factures', iconClass: 'text-primary mb-1', icon: 'receipt', value: stats.totalInvoices }} />
            </Card.Body>
            <Card.Body className="col-sm-6 br">
              <FlatCard params={{ title: 'Chiffre d’affaires', iconClass: 'text-primary mb-1', icon: 'attach_money', value: stats.totalRevenue.toFixed(2) + ' TND' }} />
            </Card.Body>
          </div>
        </Card>

        <Card className="mt-4">
          <Card.Body className="pb-0">
            <h2 className="m-0">{stats.paidPercentage}%</h2>
            <span className="text-primary">Factures payées</span>
            <p className="mb-3 mt-3">Pourcentage des factures marquées comme payées.</p>
            <Chart type="radialBar" series={[parseFloat(stats.paidPercentage)]} options={{
              chart: { type: 'radialBar' },
              labels: ['Payées']
            }} />
          </Card.Body>
        </Card>
      </Col>

      <Col md={12} xl={6}>
        <Card>
          <Card.Header>
            <h5>Factures par mois</h5>
          </Card.Header>
          <Card.Body>
            <Chart type="bar" options={monthlyChartOptions} series={monthlyChartSeries} height={350} />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
