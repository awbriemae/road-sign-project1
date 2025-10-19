// src/components/Auth/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadUsers, saveUsers } from '../../utils/storage';

export default function SignUp({ onSignUp }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const navigate = useNavigate();

    function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    const users = loadUsers();
    if (!username || !password) {
        setErr('Please enter username and password');
        return;
    }
    if (users.find(u => u.username === username)) {
        setErr('Username already exists');
        return;
    }
    const id = `u_${Date.now()}`;
    const newUser = { id, username, password, attempts: [] };
    users.push(newUser);
    saveUsers(users);
    onSignUp(id);
    navigate('/quiz');
    }

    return (
    <div className="row justify-content-center">
        <div className="col-md-6">
        <h3>Sign up</h3>
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
            <button className="btn btn-primary" type="submit">Create account</button>
        </form>
        </div>
    </div>
    );
}