// src/pages/InvoiceDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const statusColors = {
    payée: 'success',
    'en retard': 'danger',
    envoyée: 'primary',
    brouillon: 'secondary',
};

const InvoiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/invoice/${id}`);
                setInvoice(res.data);
            } catch (err) {
                console.error("Erreur de récupération :", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoice();
    }, [id]);

    if (loading) return <div className="text-center mt-5">Chargement...</div>;
    if (!invoice) return <div className="text-center text-danger mt-5">Facture introuvable</div>;

    return (
        <div className="container mt-4">
            <button className="mt-4 btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
                ← Retour
            </button>

            <div className="card shadow border-0">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4>
                        <i className="material-icons-two-tone text-primary me-2">request_quote</i>
                        Facture #{invoice.numero}
                    </h4>
                    <span className={`badge bg-${statusColors[invoice.statut] || 'secondary'}`}>
                        {invoice.statut}
                    </span>
                </div>

                <div className="card-body">
                    <h5 className="text-muted mb-3">👤 Informations sur le client</h5>
                    <p><strong>Nom:</strong> {invoice.clientId?.nom || 'N/A'}</p>
                    <p><strong>Email:</strong> {invoice.clientId?.email || 'N/A'}</p>
                    <p><strong>Entreprise:</strong> {invoice.clientId?.entreprise || 'N/A'}</p>


                    <hr />
                    <h5 className="text-muted mb-3">🧾 Détails de la facture</h5>
                    <p><strong>Date d’émission:</strong> {new Date(invoice.dateEmission).toLocaleDateString()}</p>
                    <p><strong>Date d’échéance:</strong> {new Date(invoice.dateEcheance).toLocaleDateString()}</p>

                    <hr />
                    <h5 className="text-muted mb-3">📦 Produits</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Description</th>
                                    <th>Quantité</th>
                                    <th>Prix Unitaire</th>
                                    <th>TVA (%)</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.produits.map((prod, index) => (
                                    <tr key={index}>
                                        <td>{prod.description}</td>
                                        <td>{prod.quantite}</td>
                                        <td>{prod.prixUnitaire} DT</td>
                                        <td>{prod.tva}%</td>
                                        <td>{(prod.quantite * prod.prixUnitaire * (1 + prod.tva / 100)).toFixed(2)} DT</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 text-end">
                        <p><strong>Total HT :</strong> {invoice.totalHT.toFixed(2)} DT</p>
                        <p><strong>TVA :</strong> {invoice.tva.toFixed(2)} DT</p>
                        <h5><strong>Total TTC :</strong> {invoice.totalTTC.toFixed(2)} DT</h5>
                    </div>

                    <hr />
                    <h5 className="text-muted mb-3">💳 Paiements</h5>
                    {invoice.paiements && invoice.paiements.length > 0 ? (
                        <ul className="list-group">
                            {invoice.paiements.map((paiement, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Date :</strong> {new Date(paiement.date).toLocaleDateString()}<br />
                                        <strong>Moyen :</strong> {paiement.moyen}
                                    </div>
                                    <span className="fw-bold text-success">{paiement.montant} DT</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-muted">Aucun paiement enregistré.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetails;
