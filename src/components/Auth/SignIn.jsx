// src/components/Auth/SignIn.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadUsers } from '../../utils/storage';

export default function SignIn({ onSignIn }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    const users = loadUsers();
    const u = users.find(x => x.username === username && x.password === password);
    if (!u) {
        setErr('Invalid username or password');
        return;
    }
    onSignIn(u.id);
    navigate('/quiz');
    }

    return (
    <div className="row justify-content-center">
        <div className="col-md-6">
        <h3>Sign in</h3>
        <form onSubmit={handleSubmit}>
            {err && <div className="alert alert-danger">{err}</div>}
            <div className="mb-3">
            <label className="form-label">Username</label>
            <input className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className="d-flex justify-content-between align-items-center">
            <button className="btn btn-primary" type="submit">Sign in</button>
            <Link to="/signup">Create account</Link>
            </div>
        </form>
        </div>
    </div>
    );
}