// src/components/Quiz/ReviewWrong.jsx
import React from 'react';


export default function ReviewWrong({ questions, answers, onClose }) {
    // Here the "q" is a question and I am cycling through them and checking their "a"
    const wrong = questions.filter(q => {
    // The "a" is the q.id
    const a = answers[q.id];
    // Includes the question if its not a correct index ( also if its not answered as i had this code when the site required you to click "confirm" )
    return typeof a !== 'number' || a !== q.correctIndex;
    });

    return (
    <div>
        <h4>Review Wrong Answers</h4>
        {wrong.length === 0 && <p>All correct. Well done.</p>}
        {/* Here I iterate through each wrong question and use bootstrap to generate a card for each one*/}
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
                backgroundSize: 'auto'
                }}
                role="img"
                aria-label={`Sign for question ${q.id}`}
            />
            {/* Here I show what the user answered and then the correct answer ( Once again old code that was there for "no answer")*/}
            <p><strong>Your answer:</strong> {typeof answers[q.id] === 'number' ? q.options[answers[q.id]] : 'No answer'}</p>
            <p><strong>Correct answer:</strong> {q.options[q.correctIndex]}</p>
            </div>
        </div>
        ))}
        <button className="btn btn-secondary" onClick={onClose}>Close review</button>
    </div>
    );
}