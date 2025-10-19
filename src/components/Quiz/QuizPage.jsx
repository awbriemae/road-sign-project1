// src/components/Quiz/QuizPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import questions from '../../data/questions.json';
import RandomQuiz from './RandomQuiz';
import { saveUserResults } from '../../utils/storage';
import './Quiz.css';

const PASS_THRESHOLD = 8;

export default function QuizPage({ userId }) {
    const [results, setResults] = useState(null);
    const [quizKey, setQuizKey] = useState(0);
    const [reviewMode, setReviewMode] = useState(false);
    const navigate = useNavigate();

    function handleFinish(res) {
    if (userId) {
        const saved = saveUserResults(userId, res);
        setResults({ savedRecord: saved, answers: res });
    } else {
        setResults({ savedRecord: null, answers: res });
    }
    setReviewMode(false);
    }

    function handleRestart() {
    setResults(null);
    setQuizKey(k => k + 1);
    setReviewMode(false);
    }

    function getWrongAnswers() {
    if (!results?.answers) return [];
    // This is some weird thing I had to fight to make work. It maps the id for the questions
    const map = new Map();
    for (const a of results.answers) {
    if (a.correct) continue;
    const qId = String(a.questionId);
    if (!map.has(qId)) {
        const q = questions.find(
        qu => String(qu.id ?? '') === qId || questions.indexOf(qu) === Number(qId)
        );
        map.set(qId, { question: q, answer: a });
    }
    }
    return Array.from(map.values());
}

    function PassFailBadge({ correctCount }) {
    const passed = correctCount >= PASS_THRESHOLD;
    return (
        <div className={`qp-badge ${passed ? 'qp-pass' : 'qp-fail'}`}>
        {passed ? 'Pass' : 'Fail'}
        </div>
    );
    }

    // Results thing
    if (results) {
    const answersArray = results.answers || [];
    const correctCount = answersArray.filter(r => r.correct).length;
    const total = answersArray.length;
    const savedTs = results.savedRecord?.ts;
    const wrong = getWrongAnswers();

    return (
        <div className="qp-container">
        <h3 className="qp-title">Quiz finished</h3>

        <p className="qp-summary">
            You answered <strong>{correctCount}</strong> out of <strong>{total}</strong> correctly.
        </p>

        <div className="qp-meta">
            <PassFailBadge correctCount={correctCount} />
            <div className="qp-pass-info">Passing score: <strong>{PASS_THRESHOLD}</strong></div>
            {savedTs && <div className="qp-saved">Saved: {new Date(savedTs).toLocaleString()}</div>}
        </div>

        <div className="qp-actions">
            <button onClick={handleRestart} className="btn btn-primary">Restart Quiz</button>
            <button onClick={() => navigate('/profile')} className="btn btn-outline-secondary">Go to Profile</button>
            <button onClick={() => setReviewMode(m => !m)} className="btn btn-secondary">
            {reviewMode ? 'Hide Review' : `Review Wrong Answers (${wrong.length})`}
            </button>
        </div>

        {reviewMode && (
            <div className="qp-review">
            <h4 className="qp-review-title">Review Wrong Answers</h4>
            {wrong.length === 0 ? (
                <div className="qp-no-wrongs">No incorrect answers to review. Well done.</div>
            ) : (
                <ul className="qp-review-list">
                {wrong.map((item, idx) => {
                    const q = item.question;
                    const a = item.answer;
                    const userChoice = q?.options?.[a.selectedIndex] ?? String(a.selectedIndex);
                    const correctChoice = q?.options?.[q?.correctIndex] ?? String(q?.correctIndex);
                    return (
                    <li key={idx} className="qp-review-item">
                        <div className="qp-review-left">
                        <div className="qp-question-text">{q?.text ?? 'Question not found'}</div>
                        {q?.image && (
                            <div className="qp-image-wrap">
                            <img src={q.image} alt="question" className="qp-image" />
                            </div>
                        )}
                        </div>

                        <div className="qp-review-right">
                        <div className="qp-user-answer">
                            <div className="qp-label">Your answer</div>
                            <div className="qp-answer qp-answer-wrong">{userChoice}</div>
                        </div>

                        <div className="qp-correct-answer">
                            <div className="qp-label">Correct answer</div>
                            <div className="qp-answer qp-answer-correct">{correctChoice}</div>
                        </div>
                        </div>
                    </li>
                    );
                })}
                </ul>
            )}
            </div>
        )}
        </div>
    );
    }

  // Quiz running view
    return (
    <div className="qp-container">
        <RandomQuiz key={quizKey} questions={questions} maxQuestions={10} onFinish={handleFinish} />
    </div>
    );
}