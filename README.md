# 🗳️ PolitikPulse

**Anonyme politische Meinungsumfrage für den Politikunterricht**

[![GitHub Pages](https://img.shields.io/badge/Hosting-GitHub%20Pages-blue?logo=github)](https://pages.github.com)
[![React](https://img.shields.io/badge/Frontend-React%2018-61dafb?logo=react)](https://react.dev)
[![Kosten](https://img.shields.io/badge/Betriebskosten-0%20€-green)](.)

---

## 📋 Überblick

PolitikPulse ist eine webbasierte Umfrageplattform für den Politikunterricht. Schülerinnen und Schüler scannen einen QR-Code und beantworten 8 politische Fragen anonym auf ihrem Smartphone. Die Ergebnisse werden automatisch in Google Sheets gespeichert und im Dashboard ausgewertet.

**Funktionen:**
- 📱 QR-Code-basierter Zugang, keine App-Installation nötig
- 🔒 Vollständig anonym – keine personenbezogenen Daten
- 📊 Automatische Auswertung mit Balken- und Kreisdiagrammen
- ⊞ Kreuztabellen (z.B. Wahlabsicht × Mediennutzung)
- 📄 Export als CSV, Excel (.xlsx) und PDF
- 💶 Betriebskosten: 0 €

---

## 🚀 Schnellstart

### Voraussetzungen

- [Node.js](https://nodejs.org) ≥ 18
- [Git](https://git-scm.com)
- Ein Google-Konto (für Google Sheets)
- Ein GitHub-Konto (für GitHub Pages)

---

## ⚙️ Schritt-für-Schritt-Einrichtung

### 1. Repository einrichten

```bash
# Repository klonen oder neues erstellen
git clone https://github.com/DEIN-USERNAME/politikpulse.git
cd politikpulse

# Abhängigkeiten installieren
npm install
```

### 2. Google Sheets & Apps Script einrichten

1. Öffne [Google Sheets](https://sheets.google.com) und erstelle eine neue Tabelle
2. Gib der Tabelle den Namen `PolitikPulse – Antworten`
3. Öffne **Erweiterungen → Apps Script**
4. Ersetze den gesamten Code in `Code.gs` durch den Inhalt aus `google-apps-script/Code.gs`
5. Speichere (Strg+S) und führe `testSetup` aus, um die Verbindung zu testen
6. Klicke auf **Bereitstellen → Neue Bereitstellung**:
   - Typ: **Web-App**
   - Beschreibung: `PolitikPulse v1`
   - Ausführen als: **Ich** (dein Google-Konto)
   - Wer hat Zugriff: **Jeder**
7. Bestätige die Berechtigungen und kopiere die **Web-App-URL**

### 3. Umgebungsvariablen konfigurieren

```bash
# .env-Datei erstellen
cp .env.example .env
```

Öffne `.env` und trage die Apps Script URL ein:

```
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/DEINE_SCRIPT_ID/exec
```

> ⚠️ Die `.env`-Datei **niemals** in Git einchecken! Sie ist bereits in `.gitignore` eingetragen.

### 4. Lokal testen

```bash
npm run dev
# → http://localhost:5173/politikpulse/
```

Öffne `http://localhost:5173/politikpulse/` für die Umfrage und  
`http://localhost:5173/politikpulse/#/dashboard` für das Dashboard.

### 5. Auf GitHub Pages deployen

#### 5a. Repository-Name anpassen

Öffne `vite.config.js` und passe den `base`-Pfad an deinen Repository-Namen an:

```javascript
// Beispiel: Wenn dein Repo 'meine-umfrage' heißt:
base: '/meine-umfrage/',
```

#### 5b. GitHub Pages aktivieren

1. Pushe dein Repository auf GitHub
2. Gehe zu **Settings → Pages**
3. Source: **GitHub Actions** (oder `gh-pages` Branch)

#### 5c. Mit gh-pages deployen

```bash
npm run deploy
```

Das Skript baut das Projekt und veröffentlicht es auf GitHub Pages.  
Deine Umfrage ist dann erreichbar unter:  
`https://DEIN-USERNAME.github.io/politikpulse/`

---

## 🗳️ Fragebogen

| Nr. | Bereich | Thema | Typ |
|-----|---------|-------|-----|
| F1 | Politische Sozialisation | Mediennutzung | Nominal |
| F2 | Gesellschaft | Chancengleichheit | Likert (1–5) |
| F3 | Gesellschaft | Rentenversicherung | Nominal |
| F4 | Konfliktlinien | Klimaschutz vs. Wirtschaft | Nominal |
| F5 | Internationale Politik | EU-Einstellung | Nominal |
| F6 | Internationale Politik | Außenpolitik | Nominal |
| F7 | Parteiensystem | Umgang mit der AfD | Nominal |
| F8 | Parteiensystem | Wahlabsicht | Nominal |

---

## 📊 Dashboard

Das Dashboard ist unter `/#/dashboard` erreichbar und enthält:

| Tab | Inhalt |
|-----|--------|
| **Übersicht** | Gesamtstatistik, Rücklaufquote, Systemstatus |
| **Fragen** | Einzelauswertung jeder Frage (Balken/Kreis + Tabelle) |
| **Kreuztabellen** | Analyse von Zusammenhängen zwischen Variablen |
| **QR-Code** | QR-Code generieren, herunterladen und drucken |
| **Export** | CSV, Excel (.xlsx), PDF-Bericht |

---

## 🏗️ Technische Architektur

```
politikpulse/
├── src/
│   ├── data/questions.js          ← Fragebogen-Daten
│   ├── pages/
│   │   ├── SurveyPage.jsx         ← Umfrage-Flow
│   │   ├── ThankYouPage.jsx       ← Bestätigungsseite
│   │   └── DashboardPage.jsx      ← Dashboard mit Tabs
│   ├── components/
│   │   ├── survey/                ← QuestionCard, ProgressBar
│   │   └── dashboard/             ← Charts, Kreuztabellen, QR, Export
│   └── utils/
│       ├── api.js                 ← Google Apps Script Anbindung
│       ├── statistics.js          ← Statistische Auswertung
│       └── export.js              ← CSV/XLSX/PDF-Export
└── google-apps-script/
    └── Code.gs                    ← Backend (in Google Apps Script einfügen)
```

**Tech-Stack:**

| Schicht | Technologie |
|---------|------------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 (HashRouter) |
| Charts | Chart.js 4 + react-chartjs-2 |
| QR-Code | qrcode |
| Export | xlsx + jsPDF + jspdf-autotable |
| Backend | Google Apps Script |
| Datenbank | Google Sheets |
| Hosting | GitHub Pages |
| **Kosten** | **0 €** |

---

## 🔒 Datenschutz

- Es werden **keine personenbezogenen Daten** erhoben
- Keine Registrierung, keine Anmeldung
- Keine Freitextfelder
- Gespeichert werden nur: Antwortwerte (numerische Indizes) und Zeitstempel
- Keine IP-Adressen oder Geräte-IDs werden gespeichert

---

## 🛠️ Häufige Probleme

### QR-Code funktioniert nicht
→ Stelle sicher, dass die GitHub Pages URL korrekt im QR-Code-Panel eingetragen ist.

### Dashboard zeigt "Demo-Modus"
→ Die `.env`-Datei fehlt oder die `VITE_APPS_SCRIPT_URL` ist nicht gesetzt.

### Antworten werden nicht gespeichert
→ Prüfe, ob das Apps Script korrekt deployed wurde (Zugriffsrecht: „Jeder").  
→ Bei jeder Änderung am Script muss eine **neue Bereitstellung** erstellt werden.

### Korrektur nach Änderung am Script
→ **Bereitstellen → Bereitstellungen verwalten → Bearbeiten → Neue Version**

### CORS-Fehler im Dashboard
→ Stelle sicher, dass das Apps Script als „Web-App" mit Zugriff „Jeder" deployed ist.

---

## 📚 Lizenz

MIT License – frei für den Schulunterricht verwendbar.

---

*PolitikPulse – Entwickelt für den Politikunterricht · Version 1.0*
