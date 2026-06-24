import { APPS_SCRIPT_URL } from '../config'

/**
 * Umfrageantwort an Google Apps Script übermitteln.
 * Verwendet mode: 'no-cors' um Preflight-Probleme mit Apps Script zu vermeiden.
 */
export async function submitResponse(answers) {
  if (!APPS_SCRIPT_URL) {
    console.warn('[PolitikPulse] Keine Apps Script URL konfiguriert – Antwort wird lokal verworfen.')
    // Im Demo-Modus trotzdem erfolgreich simulieren
    await new Promise(r => setTimeout(r, 600))
    return { success: true, demo: true }
  }

  const payload = {
    timestamp: new Date().toISOString(),
    q1: answers.q1 ?? null,
    q2: answers.q2 ?? null,
    q3: answers.q3 ?? null,
    q4: answers.q4 ?? null,
    q5: answers.q5 ?? null,
    q6: answers.q6 ?? null,
    q7: answers.q7 ?? null,
    q8: answers.q8 ?? null,
  }

  // no-cors: Antwort nicht lesbar, aber Daten werden übertragen
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
  })

  return { success: true }
}

/**
 * Alle Antworten vom Google Apps Script abrufen.
 */
export async function fetchResponses() {
  if (!APPS_SCRIPT_URL) {
    console.warn('[PolitikPulse] Keine Apps Script URL – zeige Demo-Daten.')
    return generateDemoData()
  }

  const response = await fetch(`${APPS_SCRIPT_URL}?action=getData`, {
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const json = await response.json()
  return json.responses || []
}

/**
 * Demo-Daten für die Vorschau ohne Backend.
 * Repräsentiert eine realistische Verteilung für eine Schulklasse.
 */
function generateDemoData() {
  const n = 47
  const templates = [
    { q1: 2, q2: 3, q3: 0, q4: 0, q5: 0, q6: 1, q7: 0, q8: 2 },
    { q1: 2, q2: 2, q3: 0, q4: 0, q5: 1, q6: 1, q7: 0, q8: 0 },
    { q1: 1, q2: 4, q3: 1, q4: 1, q5: 0, q6: 0, q7: 1, q8: 1 },
    { q1: 0, q2: 3, q3: 0, q4: 0, q5: 2, q6: 0, q7: 2, q8: 0 },
    { q1: 2, q2: 2, q3: 0, q4: 1, q5: 2, q6: 1, q7: 0, q8: 4 },
    { q1: 3, q2: 3, q3: 1, q4: 0, q5: 1, q6: 1, q7: 1, q8: 8 },
    { q1: 2, q2: 1, q3: 0, q4: 0, q5: 0, q6: 1, q7: 0, q8: 2 },
    { q1: 1, q2: 4, q3: 2, q4: 1, q5: 0, q6: 0, q7: 2, q8: 3 },
    { q1: 0, q2: 5, q3: 1, q4: 1, q5: 0, q6: 0, q7: 1, q8: 1 },
    { q1: 2, q2: 2, q3: 0, q4: 0, q5: 1, q6: 1, q7: 0, q8: 2 },
  ]

  return Array.from({ length: n }, (_, i) => ({
    timestamp: new Date(Date.now() - Math.random() * 5 * 24 * 3600 * 1000).toISOString(),
    ...templates[i % templates.length],
    // leichte Variation
    q2: Math.max(1, Math.min(5, (templates[i % templates.length].q2 + (Math.random() > 0.7 ? 1 : 0)))),
  }))
}
