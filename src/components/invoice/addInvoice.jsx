// src/pages/AddInvoice.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { set } from 'lodash-es';

const AddInvoice = () => {
  const [clients, setClients] = useState([]);
  const [invoice, setInvoice] = useState({
    clientId: '',
    dateEmission: '',
    dateEcheance: '',
    produits: [{ description: '', quantite: 1, prixUnitaire: 0, tva: 0 }],
  });
  const [totalHT, setTotalHT] = useState(0);
  const [tva, setTva] = useState(0);
    const [totalTTC, setTotalTTC] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/client/')
      .then(res => setClients(res.data))
      .catch(err => console.error("Erreur chargement clients:", err));
  }, []);

  useEffect(() => {
    const totalHT = invoice.produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire), 0);
    const tva = invoice.produits.reduce((sum, p) => sum + (p.quantite * p.prixUnitaire * p.tva / 100), 0);
    const totalTTC = totalHT + tva;
    setTotalHT(totalHT);
    setTva(tva);
    setTotalTTC(totalTTC);
  }, [invoice.produits]);

  const handleProduitChange = (index, field, value) => {
    const newProduits = [...invoice.produits];
    newProduits[index][field] = field === 'description' ? value : Number(value);
    setInvoice({ ...invoice, produits: newProduits });
  };

  const addProduit = () => {
    setInvoice(prev => ({
      ...prev,
      produits: [...prev.produits, { description: '', quantite: 1, prixUnitaire: 0, tva: 0 }],
    }));
  };

  const removeProduit = (index) => {
    const newProduits = invoice.produits.filter((_, i) => i !== index);
    setInvoice({ ...invoice, produits: newProduits });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/invoice', invoice);
      alert('Facture ajoutée avec succès !');
      navigate('/invoices');
    } catch (err) {
      console.error("Erreur ajout facture :", err);
      alert("Échec de l'ajout de la facture");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 fw-bold">➕ Nouvelle Facture</h2>
      <form onSubmit={handleSubmit}> 
        <div className="mb-3">
          <label>Client</label>
          <select
            className="form-select"
            required
            value={invoice.clientId}
            onChange={e => setInvoice({ ...invoice, clientId: e.target.value })}
          >
            <option value="">-- Sélectionner un client --</option>
            {clients.map(c => (
              <option key={c._id} value={c._id}>
                {c.nom} - {c.entreprise}
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
              value={invoice.dateEmission}
              onChange={e => setInvoice({ ...invoice, dateEmission: e.target.value })}
            />
          </div>
          <div className="col">
            <label>Date d’échéance</label>
            <input
              type="date"
              className="form-control"
              required
              value={invoice.dateEcheance}
              onChange={e => setInvoice({ ...invoice, dateEcheance: e.target.value })}
            />
          </div>
        </div>

        <h5 className="mt-4 mb-2">📦 Produits</h5>
        {invoice.produits.map((prod, index) => (
          <div key={index} className="row g-2 mb-2 align-items-center">
            <div className="col-3">
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={prod.description}
                required
                onChange={e => handleProduitChange(index, 'description', e.target.value)}
              />
            </div>
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Quantité"
                min={1}
                value={prod.quantite}
                onChange={e => handleProduitChange(index, 'quantite', e.target.value)}
              />
            </div>
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="Prix unitaire"
                min={0}
                value={prod.prixUnitaire}
                onChange={e => handleProduitChange(index, 'prixUnitaire', e.target.value)}
              />
            </div>
            <div className="col">
              <input
                type="number"
                className="form-control"
                placeholder="TVA (%)"
                min={0}
                value={prod.tva}
                onChange={e => handleProduitChange(index, 'tva', e.target.value)}
              />
            </div>
            <div className="col-auto">
              {invoice.produits.length > 1 && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeProduit(index)}
                >
                  ❌
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

        <div className="text-end mt-4">
          <button type="submit" className="btn btn-success">
            Enregistrer la facture ✅
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddInvoice;
