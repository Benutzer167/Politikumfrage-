/**
 * Statistische Auswertungsfunktionen für PolitikPulse
 */

/**
 * Absolute und relative Häufigkeiten für eine nominale Frage.
 * @param {Array} responses - Alle Antworten
 * @param {string} questionId - Fragen-ID (z.B. 'q1')
 * @param {Array<string>} optionen - Antworttexte
 * @returns {Array<{label, count, percent}>}
 */
export function getFrequencies(responses, questionId, optionen) {
  const counts = new Array(optionen.length).fill(0)

  for (const r of responses) {
    const val = r[questionId]
    if (val !== null && val !== undefined && val >= 0 && val < optionen.length) {
      counts[val]++
    }
  }

  const total = counts.reduce((a, b) => a + b, 0)

  return optionen.map((label, i) => ({
    label,
    count: counts[i],
    percent: total > 0 ? Math.round((counts[i] / total) * 1000) / 10 : 0,
  }))
}

/**
 * Arithmetisches Mittel (für Likert-Skala, Werte 1–5).
 */
export function getMean(responses, questionId) {
  const values = responses
    .map(r => r[questionId])
    .filter(v => v !== null && v !== undefined && !isNaN(v))

  if (values.length === 0) return null
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100
}

/**
 * Median.
 */
export function getMedian(responses, questionId) {
  const values = responses
    .map(r => r[questionId])
    .filter(v => v !== null && v !== undefined && !isNaN(v))
    .sort((a, b) => a - b)

  if (values.length === 0) return null
  const mid = Math.floor(values.length / 2)
  return values.length % 2 === 0
    ? (values[mid - 1] + values[mid]) / 2
    : values[mid]
}

/**
 * Standardabweichung (Stichprobe).
 */
export function getStdDev(responses, questionId) {
  const values = responses
    .map(r => r[questionId])
    .filter(v => v !== null && v !== undefined && !isNaN(v))

  if (values.length < 2) return null
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (values.length - 1)
  return Math.round(Math.sqrt(variance) * 100) / 100
}

/**
 * Häufigkeitsverteilung der Likert-Werte (1–5).
 */
export function getLikertDistribution(responses, questionId) {
  const dist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const r of responses) {
    const v = r[questionId]
    if (v >= 1 && v <= 5) dist[v]++
  }
  return dist
}

/**
 * Kreuztabelle zwischen zwei nominalen Variablen.
 * @returns {{ rowLabels, colLabels, matrix, rowTotals, colTotals, grandTotal }}
 */
export function getCrossTab(responses, rowQId, colQId, rowOptionen, colOptionen) {
  const matrix = Array.from({ length: rowOptionen.length }, () =>
    new Array(colOptionen.length).fill(0)
  )

  for (const r of responses) {
    const rowVal = r[rowQId]
    const colVal = r[colQId]
    if (
      rowVal !== null && rowVal !== undefined &&
      colVal !== null && colVal !== undefined &&
      rowVal >= 0 && rowVal < rowOptionen.length &&
      colVal >= 0 && colVal < colOptionen.length
    ) {
      matrix[rowVal][colVal]++
    }
  }

  const rowTotals = matrix.map(row => row.reduce((a, b) => a + b, 0))
  const colTotals = colOptionen.map((_, ci) => matrix.reduce((acc, row) => acc + row[ci], 0))
  const grandTotal = rowTotals.reduce((a, b) => a + b, 0)

  // Prozentanteile innerhalb jeder Zeile
  const matrixPercent = matrix.map((row, ri) =>
    row.map(cell => rowTotals[ri] > 0 ? Math.round((cell / rowTotals[ri]) * 1000) / 10 : 0)
  )

  return {
    rowLabels: rowOptionen,
    colLabels: colOptionen,
    matrix,
    matrixPercent,
    rowTotals,
    colTotals,
    grandTotal,
  }
}

/**
 * Anzahl gültiger Antworten für eine Frage.
 */
export function getValidCount(responses, questionId) {
  return responses.filter(r => r[questionId] !== null && r[questionId] !== undefined).length
}

/**
 * Letzte Teilnahme als Date-Objekt.
 */
export function getLastParticipation(responses) {
  if (!responses.length) return null
  const timestamps = responses
    .map(r => new Date(r.timestamp))
    .filter(d => !isNaN(d))
  if (!timestamps.length) return null
  return new Date(Math.max(...timestamps.map(d => d.getTime())))
}
