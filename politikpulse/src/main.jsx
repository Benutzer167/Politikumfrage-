import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'
import App from './App.jsx'
import './index.css'

// Chart.js global registration
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
)

// Chart.js globale Defaults
ChartJS.defaults.font.family = "'DM Sans', system-ui, sans-serif"
ChartJS.defaults.color = '#64748b'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
