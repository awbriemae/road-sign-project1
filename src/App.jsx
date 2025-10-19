// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import QuizRouter from './components/Quiz/QuizRouter';
import Profile from './components/Profile/Profile';
import Header from './components/Common/Header';
import { getCurrentUserId, clearCurrentUser, setCurrentUserId } from './utils/storage';
import QuizPage from './components/Quiz/QuizPage';

export default function App() {
  const [userId, setUserIdState] = useState(getCurrentUserId());

  function handleSignIn(id) {
    setCurrentUserId(id);
    setUserIdState(id);
  }

  function handleSignOut() {
    clearCurrentUser();
    setUserIdState(null);
  }

  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'current_user') setUserIdState(getCurrentUserId());
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);


  return (
    <>
      <Header userId={userId} onSignOut={handleSignOut} />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={userId ? <Navigate to="/quiz" /> : <Navigate to="/signin" />} />
          <Route path="/signin" element={<SignIn onSignIn={handleSignIn} />} />
          <Route path="/signup" element={<SignUp onSignUp={handleSignIn} />} />
          <Route path="/quiz" element={userId ? <QuizPage userId={userId} /> : <Navigate to="/signin" />} />
          <Route path="/profile" element={userId ? <Profile userId={userId} /> : <Navigate to="/signin" />} />
        </Routes>
      </div>
    </>
  );
}