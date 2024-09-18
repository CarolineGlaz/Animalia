import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSession } from '../SessionContext'

const AdminPage = () => {
    const { session } = useSession();

    console.log(session)

    if (!session.isLogged || !session.user || !session.user.roles.includes('ROLE_ADMIN')) {
        return <Navigate to="/" />
    }

    return (
        <div>
            <h1>Admin Page</h1>
        </div>
    )
}

export default AdminPage
