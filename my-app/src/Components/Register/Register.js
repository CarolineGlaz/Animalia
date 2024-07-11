import React, { useState } from 'react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [errors, setErrors] = useState([]);
    const [flashErrors, setFlashErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ici vous pouvez ajouter la logique pour gérer la soumission du formulaire
        // Par exemple, en envoyant une requête HTTP à votre backend

        // Exemple de gestion des erreurs
        const newErrors = [];
        if (!email) {
            newErrors.push('Email is required');
        }
        if (!password) {
            newErrors.push('Password is required');
        }
        if (!agreeTerms) {
            newErrors.push('You must agree to the terms');
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
        } else {
            // Logic to submit the form data
            console.log('Form submitted', { email, password, agreeTerms });
        }
    };

    return (
        <div>
            <h1>Enregistre</h1>
            {flashErrors.map((error, index) => (
                <div key={index} className="alert alert-danger" role="alert">
                    {error}
                </div>
            ))}
            {errors.length > 0 && (
                <div className="alert alert-danger" role="alert">
                    {errors.map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="agreeTerms"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="agreeTerms">
                        Agree to terms
                    </label>
                </div>
                <button type="submit" className="btn btn-primary">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
