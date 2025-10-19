import React, { useEffect, useState } from 'react';

export default function Timer({ secondsTotal, running, onTimeout }) {
    // Here i set the setSec to update the count down
    const [secs, setSecs] = useState(secondsTotal);
    
    useEffect(() => {
    setSecs(secondsTotal);
    }, [secondsTotal]);
    // This starts a new effect when running or onTimeout changes otherwise it exits early
    useEffect(() => {
    if (!running) return;
    // This updates every 1000ms ( 1 second )
    const t = setInterval(() => {
        setSecs(prev => {
            // Here is a simple check if the timer reaches 1 or less seconds
        if (prev <= 1) {
            clearInterval(t);
            onTimeout();
            // and makes it 0
            return 0;
        }
        // otherwise i just decrement the timer
        return prev - 1;
        });
    }, 1000);
    // this is to prevent memory leaks lol
    return () => clearInterval(t);
    }, [running, onTimeout]);
    // formatting the time thank you internet for the help with this
    const mm = String(Math.floor(secs / 60)).padStart(2, '0');
    const ss = String(secs % 60).padStart(2, '0');
    
    return (
    <div className="timer">
        <span className="badge bg-danger">{mm}:{ss}</span>
    </div>
    );
}