import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UpdateInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // Fetch current invoice
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/invoice/${id}`);
        setInvoice(res.data);
      } catch (err) {
        console.error("Erreur de récupération de la facture :", err);
      }
    };

    // Fetch clients for select list
    const fetchClients = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/client`);
        setClients(res.data);
      } catch (err) {
        console.error("Erreur de récupération des clients :", err);
      }
    };

    fetchInvoice();
    fetchClients();
  }, [id]);

  const handleChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleProduitChange = (index, field, value) => {
    const newProduits = [...invoice.produits];
    newProduits[index][field] = field === 'description' ? value : Number(value);
    setInvoice({ ...invoice, produits: newProduits });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/invoice/${id}`, invoice);
      alert("✅ Facture mise à jour !");
      navigate(`/invoices/${id}`);
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  if (!invoice) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4">✏️ Modifier la Facture #{invoice.numero}</h3>
      <form onSubmit={handleUpdate}>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Client</label>
            <select
              className="form-select"
              name="clientId"
              value={invoice.clientId?._id || ''}
              onChange={(e) =>
                setInvoice({ ...invoice, clientId: e.target.value })
              }
            >
              <option value="">-- Choisir un client --</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.nom} - {client.email}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Date d'émission</label>
            <input
              type="date"
              className="form-control"
              name="dateEmission"
              value={invoice.dateEmission?.slice(0, 10)}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Date d'échéance</label>
            <input
              type="date"
              className="form-control"
              name="dateEcheance"
              value={invoice.dateEcheance?.slice(0, 10)}
              onChange={handleChange}
            />
          </div>
        </div>

        <h5 className="mt-4">🧾 Produits</h5>
        {invoice.produits.map((prod, index) => (
          <div className="row mb-2" key={index}>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={prod.description}
                onChange={(e) =>
                  handleProduitChange(index, 'description', e.target.value)
                }
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Quantité"
                value={prod.quantite}
                onChange={(e) =>
                  handleProduitChange(index, 'quantite', e.target.value)
                }
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control"
                placeholder="Prix unitaire"
                value={prod.prixUnitaire}
                onChange={(e) =>
                  handleProduitChange(index, 'prixUnitaire', e.target.value)
                }
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="TVA (%)"
                value={prod.tva}
                onChange={(e) =>
                  handleProduitChange(index, 'tva', e.target.value)
                }
              />
            </div>
          </div>
        ))}

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

        <button type="submit" className="btn btn-success">
          💾 Enregistrer les modifications
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate(-1)}
        >
          Annuler
        </button>
      </form>
    </div>
  );
};

export default UpdateInvoice;
