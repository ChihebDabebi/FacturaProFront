import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ListClients = () => {
    const { getToken } = useAuth();
    const token = getToken();
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await api.get('/user?role=client', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setClients(res.data);
            } catch (error) {
                console.error('Erreur lors du chargement des clients:', error);
            }
        };

        fetchClients();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Voulez-vous vraiment supprimer ce client ?')) {
            try {
                await api.delete(`/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setClients((prev) => prev.filter((client) => client._id !== id));
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
            }
        }
    };

    const filteredClients = clients.filter(
        (client) =>
            client.nom.toLowerCase().includes(search.toLowerCase()) ||
            client.prenom.toLowerCase().includes(search.toLowerCase()) ||
            client.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <h2 className="mb-4 fw-bold">Liste des Clients</h2>

            <input
                type="text"
                className="form-control mb-3"
                placeholder="Rechercher par nom, prénom ou email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table className="table table-bordered table-hover shadow-sm">
                <thead className="table-dark">
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th>Téléphone</th>
                        <th>Factures</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                            <tr key={client._id}>
                                <td>{client.nom}</td>
                                <td>{client.prenom}</td>
                                <td>{client.email}</td>
                                <td>{client.entreprise || '—'}</td>
                                <td>{client.telephone || '—'}</td>
                                <td className="text-center">
                                    <Link to={`/invoices/client/${client._id}`} className="text-decoration-none text-primary">
                                        <i className="bi bi-receipt" style={{ fontSize: '1.2rem', cursor: 'pointer' }}></i>
                                    </Link>
                                </td>
                                <td>
                                    <button
                                        className="btn  btn-sm me-2"
                                        onClick={() => navigate(`/user/edit/${client._id}`)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn  btn-sm"
                                        onClick={() => handleDelete(client._id)}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">Aucun client trouvé.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListClients;
