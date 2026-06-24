// PolitikPulse Konfiguration
// Trage deine Google Apps Script URL in die .env-Datei ein (siehe .env.example)

export const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

export const SURVEY_TITLE = 'PolitikPulse'
export const SURVEY_SUBTITLE = 'Anonyme politische Meinungsumfrage'

// Farben für die Parteien (F8 – Wahlabsicht)
export const PARTY_COLORS = {
  0: '#000000', // CDU/CSU
  1: '#E3000F', // SPD
  2: '#1FA12D', // Grüne
  3: '#FFED00', // FDP
  4: '#009EE0', // AfD
  5: '#BE3075', // Linke
  6: '#5A2170', // BSW
  7: '#94a3b8', // Andere
  8: '#cbd5e1', // Unentschieden
  9: '#e2e8f0', // Nichtwähler
}

// Chart-Farbpalette für allgemeine Diagramme
export const CHART_COLORS = [
  '#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#14b8a6',
]

export const CHART_COLORS_ALPHA = [
  'rgba(59,130,246,0.8)',  'rgba(245,158,11,0.8)',  'rgba(16,185,129,0.8)',
  'rgba(239,68,68,0.8)',   'rgba(139,92,246,0.8)',  'rgba(6,182,212,0.8)',
  'rgba(249,115,22,0.8)',  'rgba(132,204,22,0.8)',  'rgba(236,72,153,0.8)',
  'rgba(20,184,166,0.8)',
]
