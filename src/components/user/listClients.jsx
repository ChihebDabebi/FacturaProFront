import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import { Link } from 'react-router-dom';

const ListClients = () => {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await api.get('/user?role=client');
                setClients(res.data);
            } catch (error) {
                console.error('Erreur lors du chargement des clients:', error);
            }
        };

        fetchClients();
    }, []);

    const filteredClients = clients.filter(
        (client) =>
            client.nom.toLowerCase().includes(search.toLowerCase()) ||
            client.prenom.toLowerCase().includes(search.toLowerCase()) ||
            client.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <h2 className="mb-4 fw-bold"> Liste des Clients</h2>

            <input
                type="text"
                className="form-control mb-3"
                placeholder=" Rechercher par nom, prénom ou email"
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
                                <Link to={`/invoices/client/${client._id}`} className="text-decoration-none text-primary">
                                    <i className="bi bi-receipt m-4 mt-2" style={{ fontSize: '1.2rem', cursor: 'pointer' }}></i>
                                </Link>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">Aucun client trouvé.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ListClients;
