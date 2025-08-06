import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';

const UpdateInvoice = () => {
  const { getToken } = useAuth();
  const token = getToken();
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [totalHT, setTotalHT] = useState(0);
  const [tva, setTva] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, clientsRes] = await Promise.all([
          api.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/invoice/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/`, {
            params: { role: 'client' },
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setInvoice(invoiceRes.data);
        setClients(clientsRes.data);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!invoice) return;
    const totalHT = invoice.produits.reduce((sum, p) => sum + p.quantite * p.prixUnitaire, 0);
    const tva = invoice.produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire * p.tva / 100), 0);
    setTotalHT(totalHT);
    setTva(tva);
    setTotalTTC(totalHT + tva);
    setInvoice({ ...invoice, totalHT:totalHT, tva:tva, totalTTC:totalHT + tva });

  }, [invoice?.produits]);

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleProduitChange = (index, field, value) => {
    const updatedProduits = [...invoice.produits];
    updatedProduits[index][field] = field === 'description' ? value : Number(value);
    setInvoice({ ...invoice, produits: updatedProduits });
  };

  const addProduit = () => {
    setInvoice(prev => ({
      ...prev,
      produits: [...prev.produits, { description: '', quantite: 1, prixUnitaire: 0, tva: 0 }]
    }));
  };

  const removeProduit = (index) => {
    const newProduits = invoice.produits.filter((_, i) => i !== index);
    setInvoice({ ...invoice, produits: newProduits });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/invoice/${id}`, invoice, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Facture mise à jour avec succès');
      navigate('/invoices');
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      alert("❌ Échec de la mise à jour de la facture");
    }
  };

  if (!invoice) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 fw-bold">✏️ Modifier Facture #{invoice.numero}</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label>Client</label>
          <select
            className="form-select"
            required
            value={invoice.clientId?._id || invoice.clientId}
            onChange={e => setInvoice({ ...invoice, clientId: e.target.value })}
          >
            <option value="">-- Sélectionner un client --</option>
            {clients.map(c => (
              <option key={c._id} value={c._id}>
                {c.nom} {c.prenom} - {c.entreprise}
              </option>
            ))}
          </select>
        </div>

        <div className="row mb-3">
          <div className="col">
            <label>Date d’émission</label>
            <input
              type="date"
              className="form-control"
              required
              value={invoice.dateEmission?.slice(0, 10)}
              onChange={e => setInvoice({ ...invoice, dateEmission: e.target.value })}
            />
          </div>
          <div className="col">
            <label>Date d’échéance</label>
            <input
              type="date"
              className="form-control"
              required
              value={invoice.dateEcheance?.slice(0, 10)}
              onChange={e => setInvoice({ ...invoice, dateEcheance: e.target.value })}
            />
          </div>
        </div>

        <h5 className="mt-4 mb-2">📦 Produits</h5>
        {invoice.produits.map((prod, index) => (
          <div key={index} className="row g-2 mb-3 align-items-end border rounded p-3">
            <div className="col-md-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                value={prod.description}
                required
                onChange={e => handleProduitChange(index, 'description', e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">Quantité</label>
              <input
                type="number"
                className="form-control"
                min={1}
                value={prod.quantite}
                onChange={e => handleProduitChange(index, 'quantite', e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Prix unitaire (TND)</label>
              <input
                type="number"
                className="form-control"
                min={0}
                value={prod.prixUnitaire}
                onChange={e => handleProduitChange(index, 'prixUnitaire', e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">TVA (%)</label>
              <input
                type="number"
                className="form-control"
                min={0}
                value={prod.tva}
                onChange={e => handleProduitChange(index, 'tva', e.target.value)}
              />
            </div>
            <div className="col-md-2 text-end">
              {invoice.produits.length > 1 && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger mt-4"
                  onClick={() => removeProduit(index)}
                >
                  ❌ Supprimer
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="mb-3">
          <button type="button" className="btn btn-outline-primary" onClick={addProduit}>
            ➕ Ajouter un produit
          </button>
        </div>

        <hr />
        <h5 className="mb-3">💰 Récapitulatif</h5>
        <p><strong>Total HT:</strong> {totalHT.toFixed(2)} TND</p>
        <p><strong>TVA:</strong> {tva.toFixed(2)} TND</p>
        <h5><strong>Total TTC:</strong> {totalTTC.toFixed(2)} TND</h5>

        <div className="mb-3">
          <label className="form-label">Statut</label>
          <select
            className="form-select"
            name="statut"
            value={invoice.statut}
            onChange={handleChange}
          >
            <option value="brouillon">Brouillon</option>
            <option value="envoyée">Envoyée</option>
            <option value="payée">Payée</option>
            <option value="en retard">En retard</option>
          </select>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button type="submit" className="btn btn-success">💾 Enregistrer</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateInvoice;
