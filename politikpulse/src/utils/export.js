import * as XLSX from 'xlsx'
import { questions } from '../data/questions'
import { getFrequencies, getMean, getMedian, getStdDev } from './statistics'

// ─── Hilfsfunktion: Download triggern ────────────────────────────────────────

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function getOptionLabel(questionId, value) {
  const q = questions.find(q => q.id === questionId)
  if (!q) return value
  if (q.typ === 'likert') return `${value}`
  return q.optionen[value] ?? value
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

export function exportCSV(responses) {
  const BOM = '\ufeff' // UTF-8 BOM für Excel-Kompatibilität

  const headers = [
    'Zeitstempel',
    ...questions.map(q => `F${q.nummer}: ${q.bereichKurz}`)
  ]

  const rows = responses.map(r => [
    r.timestamp ? new Date(r.timestamp).toLocaleString('de-DE') : '',
    ...questions.map(q => getOptionLabel(q.id, r[q.id]))
  ])

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    .join('\n')

  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
  downloadBlob(blob, `politikpulse-rohdaten-${dateStamp()}.csv`)
}

// ─── Excel Export (XLSX) ──────────────────────────────────────────────────────

export function exportXLSX(responses) {
  const wb = XLSX.utils.book_new()

  // Sheet 1: Rohdaten
  const rohdatenHeaders = [
    'Zeitstempel',
    ...questions.map(q => `F${q.nummer}: ${q.bereichKurz}`)
  ]
  const rohdatenRows = responses.map(r => [
    r.timestamp ? new Date(r.timestamp).toLocaleString('de-DE') : '',
    ...questions.map(q => getOptionLabel(q.id, r[q.id]))
  ])
  const wsRohdaten = XLSX.utils.aoa_to_sheet([rohdatenHeaders, ...rohdatenRows])
  wsRohdaten['!cols'] = [{ wch: 22 }, ...questions.map(() => ({ wch: 40 }))]
  XLSX.utils.book_append_sheet(wb, wsRohdaten, 'Rohdaten')

  // Sheet 2: Häufigkeiten
  const freqRows = [['Frage', 'Antwortoption', 'Absolut', 'Prozent (%)']]
  for (const q of questions) {
    if (q.typ === 'nominal') {
      const freq = getFrequencies(responses, q.id, q.optionen)
      for (const f of freq) {
        freqRows.push([`F${q.nummer}: ${q.text.slice(0, 60)}…`, f.label, f.count, f.percent])
      }
      freqRows.push(['', '', '', ''])
    }
  }
  const wsFreq = XLSX.utils.aoa_to_sheet(freqRows)
  wsFreq['!cols'] = [{ wch: 65 }, { wch: 55 }, { wch: 12 }, { wch: 14 }]
  XLSX.utils.book_append_sheet(wb, wsFreq, 'Häufigkeiten')

  // Sheet 3: Likert-Statistik (F2)
  const q2 = questions.find(q => q.typ === 'likert')
  if (q2) {
    const statsRows = [
      ['Frage', `F2: ${q2.text}`],
      ['Zitat', q2.zitat || ''],
      [''],
      ['Kennwert', 'Wert'],
      ['Mittelwert', getMean(responses, 'q2')],
      ['Median', getMedian(responses, 'q2')],
      ['Standardabweichung', getStdDev(responses, 'q2')],
      ['N (gültig)', responses.filter(r => r.q2 !== null).length],
      [''],
      ['Skalenwert', 'Häufigkeit', 'Prozent (%)'],
      ...([1, 2, 3, 4, 5].map(v => {
        const count = responses.filter(r => r.q2 === v).length
        const pct = responses.length > 0 ? Math.round((count / responses.length) * 1000) / 10 : 0
        return [q2.optionen[v - 1], count, pct]
      }))
    ]
    const wsStats = XLSX.utils.aoa_to_sheet(statsRows)
    wsStats['!cols'] = [{ wch: 35 }, { wch: 20 }, { wch: 14 }]
    XLSX.utils.book_append_sheet(wb, wsStats, 'Likert-Statistik')
  }

  XLSX.writeFile(wb, `politikpulse-auswertung-${dateStamp()}.xlsx`)
}

// ─── PDF Export ────────────────────────────────────────────────────────────────

export async function exportPDF(responses) {
  const { default: jsPDF } = await import('jspdf')
  await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 15

  // ── Deckblatt
  doc.setFillColor(15, 23, 42)
  doc.rect(0, 0, pageW, 50, 'F')
  doc.setTextColor(245, 158, 11)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('PolitikPulse', margin, 22)
  doc.setFontSize(11)
  doc.setTextColor(148, 163, 184)
  doc.setFont('helvetica', 'normal')
  doc.text('Anonyme politische Meinungsumfrage – Auswertungsbericht', margin, 31)
  doc.text(`Erstellt am ${new Date().toLocaleDateString('de-DE')} | N = ${responses.length} Teilnehmer`, margin, 39)

  doc.setTextColor(30, 41, 59)

  let y = 62

  // ── Für jede nominale Frage eine Tabelle
  for (const q of questions) {
    if (y > 240) { doc.addPage(); y = 20 }

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(100, 116, 139)
    doc.text(`FRAGE ${q.nummer} – ${q.bereichKurz.toUpperCase()}`, margin, y)
    y += 5

    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    const textLines = doc.splitTextToSize(q.text, pageW - 2 * margin)
    doc.text(textLines, margin, y)
    y += textLines.length * 5 + 2

    if (q.zitat) {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(71, 85, 105)
      const zitatLines = doc.splitTextToSize(q.zitat, pageW - 2 * margin - 6)
      doc.text(zitatLines, margin + 4, y)
      y += zitatLines.length * 4 + 3
    }

    if (q.typ === 'likert') {
      const mean    = getMean(responses, q.id)
      const median  = getMedian(responses, q.id)
      const stddev  = getStdDev(responses, q.id)
      const n       = responses.filter(r => r[q.id] !== null).length

      doc.autoTable({
        startY: y,
        head: [['Kennwert', 'Wert']],
        body: [
          ['Mittelwert (M)', mean !== null ? mean.toFixed(2) : '–'],
          ['Median (Mdn)',   median !== null ? median.toFixed(2) : '–'],
          ['Standardabweichung (SD)', stddev !== null ? stddev.toFixed(2) : '–'],
          ['N (gültig)', n],
        ],
        margin: { left: margin },
        tableWidth: 80,
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [241, 245, 249] },
      })
      y = doc.lastAutoTable.finalY + 4

      const dist = [1, 2, 3, 4, 5].map(v => {
        const count = responses.filter(r => r[q.id] === v).length
        const pct = n > 0 ? ((count / n) * 100).toFixed(1) : '0.0'
        return [q.optionen[v - 1], count, `${pct} %`]
      })
      doc.autoTable({
        startY: y,
        head: [['Antwortoption', 'n', '%']],
        body: dist,
        margin: { left: margin },
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [241, 245, 249] },
        columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
      })
    } else {
      const freq = getFrequencies(responses, q.id, q.optionen)
      doc.autoTable({
        startY: y,
        head: [['Antwortoption', 'n', '%']],
        body: freq.map(f => [f.label, f.count, `${f.percent.toFixed(1)} %`]),
        margin: { left: margin },
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [241, 245, 249] },
        columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
      })
    }

    y = doc.lastAutoTable.finalY + 10
  }

  // ── Fußzeile
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text(
      `PolitikPulse – Seite ${i} von ${pageCount}`,
      pageW / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    )
  }

  doc.save(`politikpulse-bericht-${dateStamp()}.pdf`)
}

// ─── Hilfsfunktion ─────────────────────────────────────────────────────────────

function dateStamp() {
  return new Date().toISOString().slice(0, 10)
}
