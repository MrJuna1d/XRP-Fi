import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// REMOVE StrictMode if you are debugging Vanta.js issues:
createRoot(document.getElementById('root')).render(
  <App />
)
