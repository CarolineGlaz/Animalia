import React from 'react'

const UserForm = ({ UserData, setUserData, onSubmit, userSuccessMessage, editUser, setEditUser }) => {
  const handleChange = (element) => {
    const { name, value } = element.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (element) => {
    element.preventDefault()
    const userToSend = { ...UserData }
    onSubmit(userToSend)
  }

  return (
    <div>
      <h2>{editUser ? 'Modifier un utilisateur' : 'Ajouter un utilisateur'}</h2>
      {userSuccessMessage && <p>{userSuccessMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" value={UserData.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" value={UserData.password} onChange={handleChange} placeholder="Mot de passe" required />
        <input type="text" name="nom" value={UserData.nom} onChange={handleChange} placeholder="Nom" required />
        <input type="text" name="prenom" value={UserData.prenom} onChange={handleChange} placeholder="Prénom" required />
        <input type="text" name="adresse" value={UserData.adresse} onChange={handleChange} placeholder="Adresse" required />
        <button type="submit">{editUser ? 'Mettre à jour' : 'Ajouter'}</button>
        {editUser && <button type="button" onClick={() => setEditUser(null)}>Annuler</button>}
      </form>
    </div>
  )
}

export default UserForm
