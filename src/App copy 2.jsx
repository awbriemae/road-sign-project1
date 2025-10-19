import React, { useState } from 'react';

export default function App() {
  const [n, setN] = useState(0);
  return (
    <div style={{padding:20}}>
      <h1>Hook test</h1>
      <p>Counter: {n}</p>
      <button onClick={() => setN(c => c + 1)}>Increment</button>
    </div>
  );
}