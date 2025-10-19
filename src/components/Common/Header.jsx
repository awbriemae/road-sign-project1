// src/components/Common/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header({ userId, onSignOut }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    function signOut() {
    if (typeof onSignOut === 'function') onSignOut();
    setOpen(false);
    navigate('/signin');
    }

    function closeAndNavigate(path) {
    setOpen(false);
    navigate(path);
    }

    return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
        <Link className="navbar-brand" to="/" onClick={() => setOpen(false)}>Road Sign Quiz</Link>

        <button
            className="navbar-toggler"
            type="button"
            aria-controls="mainNavbar"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen(o => !o)}
        >
            <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`} id="mainNavbar">
            <ul className="navbar-nav ms-auto align-items-center">
            {userId ? (
                <>
                <li className="nav-item">
                    <Link className="nav-link" to="/quiz" onClick={() => setOpen(false)}>Quiz</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/profile" onClick={() => setOpen(false)}>Profile</Link>
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-outline-secondary ms-2"
                    onClick={signOut}
                    type="button"
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/signin" onClick={() => setOpen(false)}>Sign in</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/signup" onClick={() => setOpen(false)}>Sign up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}