import React from 'react'
import ReactDOM from 'react-dom/client'
import TodoApp from './TodoApp.jsx'
import './styles.css'

// Import the Polyfill and its default styling
import { polyfill } from "mobile-drag-drop";
import "mobile-drag-drop/default.css";

// Initialize the polyfill
polyfill({
  // This ensures it only runs on touch devices, leaving desktop alone
  forceApply: false 
});

// A necessary fix specifically for Apple devices (iOS Safari)
window.addEventListener('touchmove', function() {}, {passive: false});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TodoApp />
  </React.StrictMode>,
)