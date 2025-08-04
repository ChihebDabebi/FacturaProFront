import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

export default function UpdateClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    entreprise: '',
    role: 'client'
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await api.get(`http://localhost:3001/user/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error(err);
        setMessage('❌ Erreur lors de la récupération du client.');
      }
    };

    fetchClient();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`http://localhost:3001/user/${id}`, form);
      setMessage('✅ Client mis à jour avec succès !');
      setTimeout(() => navigate('/users'), 1500); 
    } catch (err) {
      console.error(err);
      setMessage('❌ Erreur lors de la mise à jour du client.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Modifier le Client</h2>
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
            <input type="text" name="role" className="form-control" value="client" disabled />
          </div>
          <div className="col-md-6 mb-3">
            <label>Email</label>
            <input type="email" name="email" className="form-control" required value={form.email} onChange={handleChange} />
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
        <button type="submit" className="btn btn-success">Mettre à jour</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>Annuler</button>
      </form>
    </div>
  );
}
