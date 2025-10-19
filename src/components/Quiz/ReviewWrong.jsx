// src/components/Quiz/ReviewWrong.jsx
import React from 'react';

export default function ReviewWrong({ questions, answers, onClose }) {
    const wrong = questions.filter(q => {
    const a = answers[q.id];
    return typeof a !== 'number' || a !== q.correctIndex;
    });

    return (
    <div>
        <h4>Review Wrong Answers</h4>
        {wrong.length === 0 && <p>All correct. Well done.</p>}
        {wrong.map(q => (
        <div key={q.id} className="card mb-3">
            <div className="card-body">
            <h6>Question {q.id}</h6>
            <p>{q.text}</p>

            <div
                className="sign-image mb-2"
                style={{
                width: '100px',
                height: '100px',
                backgroundImage: "url('/sprites/road-signs-sprite.png')",
                backgroundPosition: q.spritePosition,
                backgroundSize: 'auto'
                }}
                role="img"
                aria-label={`Sign for question ${q.id}`}
            />

            <p><strong>Your answer:</strong> {typeof answers[q.id] === 'number' ? q.options[answers[q.id]] : 'No answer'}</p>
            <p><strong>Correct answer:</strong> {q.options[q.correctIndex]}</p>
            </div>
        </div>
        ))}
        <button className="btn btn-secondary" onClick={onClose}>Close review</button>
    </div>
    );
}