// src/components/Quiz/QuizRouter.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Timer from './Timer';
import QuestionPage from './QuestionPage';
import Results from './Results';
import ReviewWrong from './ReviewWrong';
import questionsData from '../../data/questions.json';
import { getUserById, updateUser } from '../../utils/storage';

const TOTAL_SECONDS = 180;
const PASS_THRESHOLD = 8;


// this is very tiring to do
export default function QuizRouter({ userId }) {
    const navigate = useNavigate();
    const [questions] = useState(questionsData);
    const [answers, setAnswers] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [running, setRunning] = useState(true);
    const [locked, setLocked] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [lastScore, setLastScore] = useState(null);
    const [showReview, setShowReview] = useState(false);

    // this is to restet the quiz state when userid changes
    useEffect(() => {
        setAnswers({});
        setCurrentIndex(0);
        setRunning(true);
        setLocked(false);
        setShowResults(false);
        setShowReview(false);
    }, [userId]);

    function handleSelect(qid, optIndex) {
    setAnswers(prev => ({ ...prev, [qid]: optIndex }));
    }
    // loop through and count. determine score this way
    function computeScore(a) {
    let s = 0;
    questions.forEach(q => {
        const aIdx = a[q.id];
        if (typeof aIdx === 'number' && aIdx === q.correctIndex) s += 1;
    });
    return s;
    }

    // this is to stop the user from submitting twice. in a normal test this wouldnt happen but the option is there if i wanna recreate this with some other type of theme
    function finalizeAttempt() {
        if (locked) return;
        setLocked(true);
        setRunning(false);
        const score = computeScore(answers);
        setLastScore(score);
        setShowResults(true);

        // i dont know why i put in effort for this. I didnt need to do this but was fully convinced i did
        // this is to persist the user
        const user = getUserById(userId);
        if (user) {
            const attempt = { dateISO: new Date().toISOString(), score, answers };
            const updated = { ...user, attempts: [...(user.attempts || []), attempt] };
            updateUser(updated);
        }
    }

    // called when time is out
    function handleTimeout() {
        finalizeAttempt();
    }
    // called when quiz is pressed submiut
    function handleSubmitClick() {
        finalizeAttempt();
    }
    
    // thius resets everything for a new attempt
    function handleRetry() {
        setAnswers({});
        setCurrentIndex(0);
        setRunning(true);
        setLocked(false);
        setShowResults(false);
        setShowReview(false);
    }

    // this is hte check to see if the user passed
    const passed = lastScore !== null && lastScore >= PASS_THRESHOLD;

    return (
    <div className="quiz-router">
        <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
            <h4>Road Signs Quiz</h4>
            <p className="mb-0">10 questions — 3 minutes</p>
        </div>
        <Timer secondsTotal={TOTAL_SECONDS} running={running} onTimeout={handleTimeout} />
        </div>

        {!showResults && (
        <div>
            <QuestionPage
                q={questions[currentIndex]}
                index={currentIndex}
                selected={answers[questions[currentIndex].id]}
                onSelect={handleSelect}
                disabled={locked}
            />

            <div className="d-flex justify-content-between mt-3">
            <div>
                <button
                    className="btn btn-outline-secondary me-2"
                    onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                    disabled={currentIndex === 0 || locked}
                >
                Previous
                </button>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
                    disabled={currentIndex === questions.length - 1 || locked}
                >
                Next
                </button>
            </div>

            <div>
                <button className="btn btn-success" onClick={handleSubmitClick} disabled={locked}>
                Submit Quiz
                </button>
            </div>
            </div>
        </div>
        )}

        {showResults && (
        <div className="mt-3">
            <Results
                score={lastScore}
                total={questions.length}
                passed={passed}
                onRetry={handleRetry}
                onReview={() => setShowReview(true)}
            />
            {showReview && <ReviewWrong questions={questions} answers={answers} onClose={() => setShowReview(false)} />}
            {/*these are morte navigation buttons */}
            {!passed && (
            <div className="mt-3">
                <button className="btn btn-link" onClick={() => navigate('/profile')}>View attempt history</button>
            </div>
            )}
            {passed && (
            <div className="mt-3">
                <button className="btn btn-primary" onClick={() => navigate('/profile')}>Go to profile</button>
            </div>
            )}
        </div>
        )}
    </div>
    );
}