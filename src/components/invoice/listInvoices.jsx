import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
const statusColor = {
    payée: 'success',
    envoyée: 'primary',
    'en retard': 'danger',
    brouillon: 'secondary'
};

const ListInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios.get('http://localhost:3000/invoice/')
            .then((response) => {
                setInvoices(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des factures :', error);
                setLoading(false);
            });
    }, []);
    if (loading) return <p>Chargement des factures...</p>;

    return (
        <div className="container py-4">
            <h2 className="mt-4 mb-4 fw-bold">📄 Liste des factures</h2>
            <div className="row g-4">
                {invoices.map((invoice) => (
                    <div key={invoice._id} className="col-md-6">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h5 className="card-title mb-0">
                                        <i className="material-icons-two-tone me-2 text-primary">request_quote</i>
                                        {invoice.numero}
                                    </h5>
                                    <span className={`badge bg-${statusColor[invoice.statut]}`}>
                                        {invoice.statut}
                                    </span>
                                </div>

                                <p className="mb-1 text-muted">
                                    <strong>Client :</strong> {invoice.clientId?.nom || 'N/A'}
                                </p>

                                <div className="d-flex justify-content-between small">
                                    <div>
                                        <div>📅 Émission: {new Date(invoice.dateEmission).toLocaleDateString()}</div>
                                        <div>⏳ Échéance: {new Date(invoice.dateEcheance).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-end">
                                        <div>Total HT: {invoice.totalHT} DT</div>
                                        <div><strong>Total TTC: {invoice.totalTTC} DT</strong></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListInvoices;
