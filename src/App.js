import React from 'react';
import './App.css';
import Converter from './components/converter/converter';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Unit Conversions
      </header>
      <Converter />
    </div>
  );
}

export default App;
