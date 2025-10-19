// src/components/Quiz/Results.jsx
import React from 'react';

// This is used to show the results of the test
// This takes in all those arguments - I think they are called props.
// Need to learn react more lol
export default function Results({ score, total, passed, onRetry, onReview }) {
    return (
    <div>
        <h3>Results</h3>
        <p>Your score: <strong>{score}/{total}</strong></p>
        
        {/* 
        This is a conditional check, if true it does the first part,
        if false it does the second,
        I used this format a lot for game dev.
        */}
        <p>{passed ? <span className="text-success">Pass</span> : <span className="text-danger">Fail</span>}</p>
        <div className="d-flex gap-2">
        <button className="btn btn-secondary" onClick={onReview}>Review wrong answers</button>
        {!passed && <button className="btn btn-primary" onClick={onRetry}>Retry Quiz</button>}
        </div>
    </div>
    );
}