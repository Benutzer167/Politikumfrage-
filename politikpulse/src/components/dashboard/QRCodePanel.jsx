import { useState, useRef, useEffect } from 'react'

export default function QRCodePanel() {
  const [url, setUrl]         = useState(window.location.href.replace('#/dashboard', '#/').replace(/#.*/, '#/'))
  const [size, setSize]       = useState(256)
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    generateQR()
  }, [url, size])

  async function generateQR() {
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    try {
      const QRCode = (await import('qrcode')).default
      const dataUrl = await QRCode.toDataURL(url, {
        width: size,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
        errorCorrectionLevel: 'M',
      })
      setQrDataUrl(dataUrl)
    } catch (err) {
      setError('QR-Code konnte nicht generiert werden.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function downloadQR(forPrint = false) {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = forPrint ? 'politikpulse-qrcode-druck.png' : 'politikpulse-qrcode.png'
    link.click()
  }

  async function downloadPrintSheet() {
    const QRCode = (await import('qrcode')).default
    // Großes QR für Druck (600px)
    const printDataUrl = await QRCode.toDataURL(url, {
      width: 600,
      margin: 3,
      color: { dark: '#000000', light: '#ffffff' },
      errorCorrectionLevel: 'H', // Höchste Fehlerkorrektur für Druck
    })

    // HTML-Druckseite generieren
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8">
        <title>PolitikPulse – QR-Code</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: system-ui, sans-serif; background: #fff; }
          .page { width: 210mm; min-height: 297mm; padding: 20mm; display: flex; flex-direction: column; align-items: center; justify-content: center; }
          .logo { font-size: 28px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; margin-bottom: 4px; }
          .subtitle { font-size: 14px; color: #64748b; margin-bottom: 32px; }
          .qr-box { border: 3px solid #0f172a; border-radius: 16px; padding: 24px; display: inline-block; margin-bottom: 24px; }
          .qr-box img { display: block; width: 200px; height: 200px; }
          .instruction { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
          .url { font-size: 9px; color: #94a3b8; word-break: break-all; max-width: 200px; text-align: center; }
          .steps { margin-top: 24px; text-align: left; font-size: 12px; color: #475569; line-height: 1.8; }
          .privacy { margin-top: 24px; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; text-align: center; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="logo">🗳️ PolitikPulse</div>
          <div class="subtitle">Anonyme politische Meinungsumfrage</div>
          <div class="qr-box">
            <img src="${printDataUrl}" alt="QR-Code zur Umfrage" />
          </div>
          <div class="instruction">📱 QR-Code scannen & teilnehmen</div>
          <div class="url">${url}</div>
          <div class="steps">
            <strong>So funktioniert es:</strong><br>
            1. QR-Code mit der Kamera-App scannen<br>
            2. Umfrage im Browser öffnen<br>
            3. 8 Fragen beantworten (~2 Min.)<br>
            4. Absenden – fertig!
          </div>
          <div class="privacy">
            Diese Umfrage ist vollständig anonym. Es werden keine personenbezogenen Daten erhoben.
          </div>
        </div>
        <script>window.onload = () => window.print()</script>
      </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="space-y-6">
      {/* URL-Einstellung */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <h3 className="font-semibold text-slate-800 mb-4">Umfrage-URL</h3>
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://dein-github.github.io/politikpulse/#/"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={generateQR}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Aktualisieren
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Diese URL wird im QR-Code kodiert. Nach dem Deployment auf GitHub Pages hier die endgültige URL eintragen.
        </p>
      </div>

      {/* QR-Code Vorschau */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">QR-Code Vorschau</h3>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Größe:</span>
            {[128, 256, 512].map(s => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                  size === s ? 'bg-slate-800 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {s}px
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 items-center">
          {/* QR Bild */}
          <div className="flex-shrink-0">
            {loading ? (
              <div className="w-48 h-48 bg-slate-100 rounded-xl flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
              </div>
            ) : error ? (
              <div className="w-48 h-48 bg-red-50 rounded-xl flex items-center justify-center text-red-400 text-sm text-center px-4">
                {error}
              </div>
            ) : qrDataUrl ? (
              <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm inline-block">
                <img src={qrDataUrl} alt="QR-Code" className="block" style={{ width: Math.min(size, 200), height: Math.min(size, 200) }} />
              </div>
            ) : null}
          </div>

          {/* Download-Optionen */}
          <div className="space-y-3 flex-1">
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Lade den QR-Code herunter und drucke ihn aus oder projiziere ihn im Unterricht.
              Die druckoptimierte Version erzeugt ein vollständiges A4-Druckblatt mit Anleitung.
            </p>
            <button
              onClick={() => downloadQR(false)}
              disabled={!qrDataUrl}
              className="w-full flex items-center gap-3 px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors disabled:opacity-40 text-sm font-medium"
            >
              <span className="text-lg">💾</span>
              PNG herunterladen ({size}×{size}px)
            </button>
            <button
              onClick={downloadPrintSheet}
              disabled={!qrDataUrl}
              className="w-full flex items-center gap-3 px-4 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-40 text-sm font-medium shadow-lg shadow-amber-500/25"
            >
              <span className="text-lg">🖨️</span>
              Druckoptimiertes A4-Blatt öffnen
            </button>
          </div>
        </div>
      </div>

      {/* Tipps */}
      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
        <h4 className="font-semibold text-blue-800 mb-3 text-sm">💡 Tipps für den Unterricht</h4>
        <ul className="space-y-1.5 text-sm text-blue-700">
          <li>• QR-Code auf Tafel/Beamer projizieren oder als Zettel verteilen</li>
          <li>• Schüler*innen öffnen die Umfrage auf ihren Smartphones</li>
          <li>• Bearbeitungszeit ca. 2–3 Minuten</li>
          <li>• Ergebnisse erscheinen nach dem Abschicken automatisch im Dashboard</li>
          <li>• Seite aktualisieren, um neue Antworten zu laden</li>
        </ul>
      </div>
    </div>
  )
}
