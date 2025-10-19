import React, { useEffect, useState } from 'react';

export default function Timer({ secondsTotal, running, onTimeout }) {
    const [secs, setSecs] = useState(secondsTotal);

    useEffect(() => {
    setSecs(secondsTotal);
    }, [secondsTotal]);

    useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
        setSecs(prev => {
        if (prev <= 1) {
            clearInterval(t);
            onTimeout();
            return 0;
        }
        return prev - 1;
        });
    }, 1000);
    return () => clearInterval(t);
    }, [running, onTimeout]);

    const mm = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');

    return (
    <div className="timer">
        <span className="badge bg-danger">{mm}:{ss}</span>
    </div>
    );
}