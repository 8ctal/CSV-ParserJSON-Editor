// client/src/App.js
import React from 'react';
import FileUpload from './components/FileUpload.jsx';
import './App.css';

function App() {
    return (
        <div className="App">
            <h1>File Upload and Parsing in Node.js</h1>
            <FileUpload />
        </div>
    );
}

export default App;