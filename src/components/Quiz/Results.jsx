// src/components/Quiz/Results.jsx
import React from 'react';

export default function Results({ score, total, passed, onRetry, onReview }) {
    return (
    <div>
        <h3>Results</h3>
        <p>Your score: <strong>{score}/{total}</strong></p>
        <p>{passed ? <span className="text-success">Pass</span> : <span className="text-danger">Fail</span>}</p>
        <div className="d-flex gap-2">
        <button className="btn btn-secondary" onClick={onReview}>Review wrong answers</button>
        {!passed && <button className="btn btn-primary" onClick={onRetry}>Retry Quiz</button>}
        </div>
    </div>
    );
}