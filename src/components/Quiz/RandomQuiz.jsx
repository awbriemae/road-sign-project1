
import React, { useMemo, useState } from 'react';
import './Quiz.css';

/*
Variables:
- questions: array of { id, text, image, options, correctIndex } <- this is fromt he questions.json
- maxQuestions: optional maximum number of questions to ask <- there is a fall back so you can ask all questions
- onFinish: callback called with results array when quiz finishes <- need this for telling user
*/

export default function RandomQuiz({ questions = [], maxQuestions, onFinish }) {
    const total = Array.isArray(questions) ? questions.length : 0;

    // Hooks must be called unconditionally <- many errors because of this thing
    const [seed, setSeed] = useState(0);

    const order = useMemo(() => {
    if (!Array.isArray(questions) || questions.length === 0) return [];
    const indices = questions.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return typeof maxQuestions === 'number'
        ? indices.slice(0, Math.min(maxQuestions, indices.length))
        : indices;
    }, [questions, maxQuestions, seed]);

    const [pos, setPos] = useState(0);
    const [answers, setAnswers] = useState([]);

    // Just in case I forgot to write questions... which would be missing the whole point
    if (total === 0) {
    return <div className="rq-container">No questions available.</div>;
    }

    const currentIndex = order[pos];
    const currentQuestion = questions[currentIndex];

    function handleSelect(selectedIndex) {
    const correct = selectedIndex === currentQuestion.correctIndex;
    const answerRecord = {
        questionId: currentQuestion.id ?? currentIndex,
        selectedIndex,
        correct,
    };

    setAnswers(prev => {
        const nextAnswers = [...prev, answerRecord];
        const nextPos = pos + 1;

        if (nextPos >= order.length) {
        // Here we finished -> call onFinish with final answers
        if (typeof onFinish === 'function') {
            onFinish(nextAnswers);
        }
        setPos(nextPos);
        } else {
        setPos(nextPos);
        }

        return nextAnswers;
    });
    }

    // If no more questions exist
    if (pos >= order.length) {
    const totalAsked = answers.length;
    const correctCount = answers.filter(a => a.correct).length;

    return (
        <div className="rq-container rq-finished">
        <h3>Quiz finished</h3>
        <p>
            You answered <strong>{correctCount}</strong> out of <strong>{totalAsked}</strong> correctly.
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
            <button
            className="btn btn-primary"
            onClick={() => {
                // Restart locally -> clear answers, reset the position, and reshuffle by incrementing seed
                // Fun fact! Minecraft is how I learnt what seeds are! 
                setAnswers([]);
                setPos(0);
                setSeed(s => s + 1);
            }}
            >
            Restart
            </button>
            </div>
        </div>
    );
    }

    function handleSelectLocal(selectedIndex) {
    const correct = selectedIndex === currentQuestion.correctIndex;
    const answerRecord = {
    questionId: currentQuestion.id ?? null,
    questionIndex: currentIndex,            // numeric index into questions[]
    questionText: currentQuestion.text,
    selectedIndex,
    correct,
    };

    setAnswers(prev => {
    const nextAnswers = [...prev, answerRecord];
    return nextAnswers;
    });

    setPos(p => p + 1);
}

    // Render the current question
    // One small issue which i could easily fix but would be annoying is that you can view images
    // in another window which shows you the file. I could rename the files so you cant see the answers.
    // But I don't think its too important for this project.
    return (
    <div className="rq-container">
        <h4 className="rq-header">Question {pos + 1} of {order.length}</h4>

        <div className="rq-question">
        <p>{currentQuestion.text}</p>

        {currentQuestion.image && (
            <div className="rq-image-wrap">
            <img
                className="rq-image"
                src={currentQuestion.image}
                alt={`question ${pos + 1}`}
            />
            </div>
        )}
        </div>  
        
        <div className="rq-options">
        {currentQuestion.options.map((opt, i) => (
            <button
            key={i}
            onClick={() => handleSelect(i)}
            className="rq-option-btn"
            type="button"
            >
            {opt}
            </button>
        ))}
        </div>
    </div>
    );
}