import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import html2pdf from 'html2pdf.js';

const statusColors = {
  payée: 'success',
  'en retard': 'danger',
  envoyée: 'primary',
  brouillon: 'secondary',
};

const InvoiceDetails = () => {
  const { getToken } = useAuth();
  let token = getToken();
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rest, setRest] = useState(0);

  const formatter = new Intl.NumberFormat('fr-TN', {
    style: 'currency',
    currency: 'TND',
  });

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/invoice/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setInvoice(res.data);
        const totalPaid = res.data.paiements.reduce((sum, p) => sum + p.montant, 0);
        setRest(res.data.totalTTC - totalPaid);
      } catch (err) {
        console.error("Erreur de récupération :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleSend = async () => {
    if (invoice.statut === "brouillon") {
      await api.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/invoice/${id}`, {
        statut: 'envoyée',
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Facture envoyée avec succès !");
      navigate(`/invoices`);
    } else {
      alert("Cette facture est déjà envoyée !");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette facture ?");
    if (confirmed) {
      try {
        await api.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/invoice/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert("Facture supprimée avec succès.");
        navigate("/invoices");
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        alert("Échec de la suppression de la facture.");
      }
    }
  };

  const handlePdf = () => {
    const element = document.querySelector('#invoice');
    html2pdf()
      .set({
        margin: 0,
        filename: `${invoice.numero}_facture.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      })
      .from(element)
      .save();
  };

  if (loading) return <div className="text-center mt-5">Chargement...</div>;
  if (!invoice) return <div className="text-center text-danger mt-5">Facture introuvable</div>;

  return (
    <div className="container mt-4">
      <button className="mt-4 btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
        ← Retour
      </button>
      <div className='d-flex justify-content-end mb-3'>
        {invoice.statut === "brouillon" && (
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => navigate(`/invoice/edit/${id}`)}
          >
            ✏️ Modifier
          </button>
        )}
        <button className="btn btn-outline-danger" onClick={handleDelete}>
          🗑️ Supprimer
        </button>
      </div>

      <div className="card shadow border-0" id="invoice">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h4>
              <i className="material-icons-two-tone text-primary me-2">request_quote</i>
              Facture #{invoice.numero}
            </h4>
            <span className={`badge bg-${statusColors[invoice.statut] || 'secondary'}`}>
              {invoice.statut}
            </span>
          </div>
        </div>

        <div className="card-body">
          <h5 className="text-muted mb-3">👤 Informations sur le client</h5>
          <p><strong>Nom:</strong> {invoice.clientId?.nom || 'N/A'}</p>
          <p><strong>Prénom:</strong> {invoice.clientId?.prenom || 'N/A'}</p>
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
                    <td>{formatter.format(prod.prixUnitaire)}</td>
                    <td>{prod.tva}%</td>
                    <td>
                      {formatter.format(
                        prod.quantite * prod.prixUnitaire * (1 + prod.tva / 100)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-end">
            <p><strong>Total HT :</strong> {formatter.format(invoice.totalHT)}</p>
            <p><strong>TVA :</strong> {formatter.format(invoice.tva)}</p>
            <h5><strong>Total TTC :</strong> {formatter.format(invoice.totalTTC)}</h5>
          </div>

          <hr />

          <h5 className="text-muted mb-3">💳 Paiements</h5>
          {invoice.paiements && invoice.paiements.length > 0 ? (
            <ul className="list-group mb-3">
              {invoice.paiements.map((paiement, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>Date :</strong> {new Date(paiement.date).toLocaleDateString()}<br />
                    <strong>Moyen :</strong> {paiement.moyen}
                  </div>
                  <span className="fw-bold text-success">
                    {formatter.format(paiement.montant)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">Aucun paiement enregistré.</p>
          )}

          <hr />

          <h5 className="text-muted mb-3">💰 Reste à payer</h5>
          <div className={`alert ${rest > 0 ? 'alert-warning' : 'alert-success'}`}>
            {rest > 0 ? (
              <span>Il reste <strong>{formatter.format(rest)}</strong> à payer.</span>
            ) : (
              <span className="fw-bold">Cette facture est entièrement payée ✅</span>
            )}
          </div>

          <hr />
          <div className="d-flex justify-content-end mt-5">
            <div style={{ textAlign: 'right' }}>
              <h5 className="mb-4">✍️ Signature</h5>
              <div
                style={{
                  borderTop: '1px solid #999',
                  width: '250px',
                  height: '80px',
                  paddingTop: '10px',
                  fontStyle: 'italic'
                }}
              >
                Signature du client
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="d-flex justify-content-between mb-2 mt-3">
        <button className="btn btn-success" onClick={handleSend}>Envoyer</button>
        <button className="btn btn-primary" onClick={handlePdf}>Export PDF</button>
      </div>
    </div>
  );
};

export default InvoiceDetails;
