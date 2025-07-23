import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate , useParams } from 'react-router-dom';
import api from '../../utils/axios';
const statusColor = {
    payée: 'success',
    envoyée: 'primary',
    'en retard': 'danger',
    brouillon: 'secondary'
};

const ListInvoicesByClient = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        dateEcheance: '',
        statut: '',
        totalTTC: ''
    });
    useEffect(() => {
        api.get(`/invoice/client/${id}`, { params: filters })
            .then((response) => {
                setInvoices(response.data);
                console.log(response);

                setLoading(false);
            })
            .catch((error) => {
                console.error('Erreur lors de la récupération des factures :', error);
                setLoading(false);
            });
    }, [filters]);
    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };
    if (loading) return <p>Chargement des factures...</p>;

    return (
        <div className="container py-4">
            <h2 className="mt-4 mb-4 fw-bold">📄 Liste des factures</h2>

            {/* Filter section */}
            <div className="row mb-3">
                <div className="col-md-3">
                    <input
                        type="text"
                        name="client"
                        className="form-control"
                        placeholder="Recherche par client"
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-2">
                    <input
                        type="date"
                        name="dateEcheance"
                        className="form-control"
                        onChange={handleChange}
                    />
                </div>
                <div className="col-md-2">
                    <select name="statut" className="form-control" onChange={handleChange}>
                        <option value="">Statut</option>
                        <option value="payée">Payée</option>
                        <option value="envoyée">Impayée</option>
                        <option value="en retard">En retard</option>
                    </select>
                </div>
                <div className="col-md-2">
                    <input
                        type="number"
                        name="totalTTC"
                        className="form-control"
                        placeholder="Montant "
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="row g-4">
                {invoices.map((invoice) => (
                    <div key={invoice._id}
                        className="col-md-6"
                        onClick={() => navigate(`/invoices/${invoice._id}`)}
                    >
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
                                    <strong>Client :</strong> {invoice.clientId?.nom || 'N/A'} {invoice.clientId?.prenom || 'N/A'}
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

export default ListInvoicesByClient;
