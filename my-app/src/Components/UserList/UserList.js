import React from 'react';

const UserList = ({ users, edit, onDelete }) => (
  <ul>
    {users.map((utilisateur) => (
      <li key={utilisateur.id}>
        {utilisateur.nom} {utilisateur.prenom} ({utilisateur.email})
        <button onClick={() => edit(utilisateur)}>Modifier</button>
        <button onClick={() => onDelete(utilisateur.id)}>Supprimer</button>
      </li>
    ))}
  </ul>
);

export default UserList;
