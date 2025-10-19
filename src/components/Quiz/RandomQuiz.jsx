
import React, { useMemo, useState } from 'react';
import './Quiz.css';


export default function RandomQuiz({ questions = [], maxQuestions, onFinish }) {
    // creating an array if theres more than 0 questions <- incase i forgot to write questions :D
    const total = Array.isArray(questions) ? questions.length : 0;

    // Hooks must be called unconditionally <- many errors because of this thing
    // This is where i use seed which is really cool stuff for randomising. Thank you minecraft for teaching me well
    const [seed, setSeed] = useState(0);
    // remember the order otherwise its wasting time 
    const order = useMemo(() => {
    if (!Array.isArray(questions) || questions.length === 0) return [];
    const indices = questions.map((_, i) => i);
    // shuffle the order of indices
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    // if maxquestions is set the shuiffled list is limited ot that number
    // otherwise its just the whoel list
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

    // current question
    const currentIndex = order[pos];
    const currentQuestion = questions[currentIndex];

    // Here it checks if the option picked is correct
    function handleSelect(selectedIndex) {
    const correct = selectedIndex === currentQuestion.correctIndex;
    const answerRecord = {
        questionId: currentQuestion.id ?? currentIndex,
        selectedIndex,
        correct,
        // ^ here i create a record of the users answer ( this will be used later ;] )
    };

    // Sets the answers and moves on
    // calls onFinish when.... finish...ed
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

    // creates an object to store users response
    // ripping myt hair out :DDDDD
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
    
    // Thinking about it now i think it shouldve been done but now its too late. I am so sorry.
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