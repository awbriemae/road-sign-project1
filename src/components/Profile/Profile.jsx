// src/components/Profile/Profile.jsx
import React, { useEffect, useState } from 'react';
import { getUserResults, getUserById } from '../../utils/storage';

const PASS_THRESHOLD = 8;

function PassFailBadge({ correctCount }) {
    const passed = correctCount >= PASS_THRESHOLD;
    return (
    <div
        style={{
        padding: '6px 10px',
        borderRadius: 6,
        background: passed ? '#d4edda' : '#f8d7da',
        color: passed ? '#155724' : '#721c24',
        border: `1px solid ${passed ? '#c3e6cb' : '#f5c6cb'}`,
        fontWeight: 600,
        display: 'inline-block',
        }}
    >
        {passed ? 'Pass' : 'Fail'}
    </div>
    );
}

export default function Profile({ userId }) {
    const [attempts, setAttempts] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
    if (!userId) {
        setAttempts([]);
        setUser(null);
        return;
    }
    setAttempts(getUserResults(userId) || []);
    const u = getUserById(userId);
    setUser(u || null);
    }, [userId]);

    return (
    <div style={{ padding: 16 }}>
        <h2>Profile</h2>

        {user ? (
        <div>
            <p><strong>Username:</strong> {user.username}</p>
        </div>
        ) : (
        <p>No user data</p>
        )}

        <h3 style={{ marginTop: 16 }}>Previous quiz attempts</h3>

        {attempts.length === 0 ? (
        <p>No attempts yet.</p>
        ) : (
        <ul className="list-group">
            {attempts.map(attempt => {
            const resultsArray = attempt.results || [];
            const correct = resultsArray.filter(r => r.correct).length;
            const total = resultsArray.length;
            return (
                <li key={attempt.id} className="list-group-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                    <div><strong>Date:</strong> {new Date(attempt.ts).toLocaleString()}</div>
                    <div><strong>Score:</strong> {correct} / {total}</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <PassFailBadge correctCount={correct} />
                    {attempt.savedBy ? (
                        <div style={{ fontSize: 12, color: '#6c757d' }}>By: {attempt.savedBy}</div>
                    ) : null}
                    </div>
                </div>
                </li>
            );
            })}
        </ul>
        )}
    </div>
    );
}