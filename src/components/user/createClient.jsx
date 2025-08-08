import { useState } from 'react';
import axios from 'axios';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
export default function CreateClient() {
  const navigate = useNavigate();
  const {getToken} = useAuth();
  const token = getToken();
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    telephone: '',
    adresse: '',
    entreprise: '',
    role: 'client'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        role: 'client'
      };

      await api.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/user/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessage('✅ Client créé avec succès !');
      setForm({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        telephone: '',
        adresse: '',
        entreprise: '',
        role: 'client'

      });
      setTimeout(() => navigate('/users'), 1500);
    } catch (err) {
      console.error(err);
      setMessage('❌ Erreur lors de la création du client.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Créer un Client</h2>
      {message && <div className="alert alert-info mt-2">{message}</div>}
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Nom</label>
            <input type="text" name="nom" className="form-control" required value={form.nom} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Prénom</label>
            <input type="text" name="prenom" className="form-control" value={form.prenom} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Rôle</label>
            <input
              type="text"
              name="role"
              className="form-control"
              value="client"
              disabled
            />
          </div>
          <div className="col-md-6 mb-3">
            <label>Email</label>
            <input type="email" name="email" className="form-control" required value={form.email} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Mot de passe</label>
            <input type="password" name="password" className="form-control" required value={form.password} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Téléphone</label>
            <input type="text" name="telephone" className="form-control" value={form.telephone} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Adresse</label>
            <input type="text" name="adresse" className="form-control" value={form.adresse} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label>Entreprise</label>
            <input type="text" name="entreprise" className="form-control" value={form.entreprise} onChange={handleChange} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Créer</button>
      </form>
    </div>
  );
}
