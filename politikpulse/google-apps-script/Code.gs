/**
 * PolitikPulse – Google Apps Script Backend
 * ==========================================
 * 
 * EINRICHTUNG:
 * 1. Öffne dein Google Sheet (oder erstelle ein neues)
 * 2. Erweiterungen → Apps Script
 * 3. Diesen Code in Code.gs einfügen (alten Code ersetzen)
 * 4. Speichern (Strg+S)
 * 5. Bereitstellen → Neue Bereitstellung
 *    - Typ: Web-App
 *    - Ausführen als: Ich (deine Google-Konto)
 *    - Wer hat Zugriff: Jeder
 * 6. Bereitstellen → URL kopieren
 * 7. URL in deine .env-Datei eintragen: VITE_APPS_SCRIPT_URL=<URL>
 * 
 * WICHTIG: Bei jeder Code-Änderung muss eine neue Bereitstellung erstellt werden!
 */

const SHEET_NAME = 'Antworten';

// ─── POST: Umfrageantwort speichern ──────────────────────────────────────────

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    
    // Kopfzeile erstellen falls leer
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Zeitstempel', 'F1_Medienkanal', 'F2_Chancengleichheit',
        'F3_Rentenversicherung', 'F4_Klimaschutz', 'F5_EU',
        'F6_Aussenpolitik', 'F7_AfD', 'F8_Wahlabsicht'
      ]);
      
      // Kopfzeile formatieren
      const headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setBackground('#0f172a');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    
    // Antwort speichern
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      sanitizeValue(data.q1),
      sanitizeValue(data.q2),
      sanitizeValue(data.q3),
      sanitizeValue(data.q4),
      sanitizeValue(data.q5),
      sanitizeValue(data.q6),
      sanitizeValue(data.q7),
      sanitizeValue(data.q8),
    ]);
    
    return createJsonResponse({ success: true, message: 'Antwort gespeichert.' });
    
  } catch (err) {
    console.error('doPost Fehler:', err);
    return createJsonResponse({ success: false, error: err.message });
  }
}

// ─── GET: Daten abrufen ───────────────────────────────────────────────────────

function doGet(e) {
  const action = e.parameter && e.parameter.action;
  
  if (action === 'getData') {
    return getAllResponses();
  }
  
  // Healthcheck
  return createJsonResponse({
    status: 'ok',
    app: 'PolitikPulse',
    version: '1.0',
    timestamp: new Date().toISOString(),
    totalResponses: getTotalCount(),
  });
}

// ─── Hilfsfunktionen ──────────────────────────────────────────────────────────

function getAllResponses() {
  try {
    const sheet = getOrCreateSheet();
    const lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return createJsonResponse({ responses: [], total: 0 });
    }
    
    // Daten ohne Kopfzeile abrufen
    const dataRange = sheet.getRange(2, 1, lastRow - 1, 9);
    const rows = dataRange.getValues();
    
    const responses = rows
      .filter(row => row[0] !== '') // Leere Zeilen überspringen
      .map(row => ({
        timestamp: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
        q1: parseValue(row[1]),
        q2: parseValue(row[2]),
        q3: parseValue(row[3]),
        q4: parseValue(row[4]),
        q5: parseValue(row[5]),
        q6: parseValue(row[6]),
        q7: parseValue(row[7]),
        q8: parseValue(row[8]),
      }));
    
    return createJsonResponse({ responses, total: responses.length });
    
  } catch (err) {
    console.error('getAllResponses Fehler:', err);
    return createJsonResponse({ responses: [], error: err.message });
  }
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

function getTotalCount() {
  try {
    const sheet = getOrCreateSheet();
    const lastRow = sheet.getLastRow();
    return Math.max(0, lastRow - 1); // Kopfzeile abziehen
  } catch (e) {
    return 0;
  }
}

function sanitizeValue(val) {
  // Nur Zahlen und null zulassen (keine Strings)
  if (val === null || val === undefined) return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
}

function parseValue(val) {
  if (val === '' || val === null || val === undefined) return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
}

function createJsonResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ─── Test-Funktion (im Apps Script Editor ausführen) ─────────────────────────

function testSetup() {
  const sheet = getOrCreateSheet();
  Logger.log('Sheet gefunden: ' + sheet.getName());
  Logger.log('Zeilen: ' + sheet.getLastRow());
  Logger.log('✅ Setup OK');
}
