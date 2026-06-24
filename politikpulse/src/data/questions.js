/**
 * Fragebogen PolitikPulse
 * Antwortwerte sind 0-basierte Indizes der Optionen-Arrays.
 * Ausnahme: Frage 2 (Likert) speichert den tatsächlichen Skalenwert (1–5).
 */

export const questions = [
  {
    id: 'q1',
    nummer: 1,
    bereich: 'Politische Sozialisation und Mediennutzung',
    bereichKurz: 'Mediennutzung',
    typ: 'nominal',
    text: 'Über welchen Kanal informieren Sie sich primär über das tagesaktuelle politische Geschehen?',
    optionen: [
      'Rundfunk (Fernsehen, Radio, Mediathek, Podcast)',
      'Presseerzeugnisse (gedruckt oder digital)',
      'Soziale Medien',
      'Gespräche mit Familie, Freunden oder Lehrkräften',
      'Ich nutze keine Medien zur politischen Information',
    ],
  },
  {
    id: 'q2',
    nummer: 2,
    bereich: 'Struktur und Wandel der Gesellschaft',
    bereichKurz: 'Chancengleichheit',
    typ: 'likert',
    text: 'Bitte bewerten Sie folgende Aussage:',
    zitat: '„In Deutschland hängen die wirtschaftlichen und beruflichen Aufstiegschancen eines Menschen primär von der eigenen Leistung ab, unabhängig von der sozialen Herkunft."',
    optionen: [
      '1 – Stimme überhaupt nicht zu',
      '2 – Stimme eher nicht zu',
      '3 – Teils, teils',
      '4 – Stimme eher zu',
      '5 – Stimme voll und ganz zu',
    ],
    // Für Likert: Wert ist der Skalenwert (1–5), nicht der Index
    likerMin: 1,
    likertMax: 5,
  },
  {
    id: 'q3',
    nummer: 3,
    bereich: 'Struktur und Wandel der Gesellschaft',
    bereichKurz: 'Rentenversicherung',
    typ: 'nominal',
    text: 'Welcher grundlegende steuernde Eingriff sollte prioritär gewählt werden, um die Finanzierbarkeit der gesetzlichen Rentenversicherung langfristig zu sichern?',
    optionen: [
      'Erhöhung des Renteneintrittsalters',
      'Erhöhung der Rentenbeitragssätze',
      'Absenkung des Rentenniveaus',
    ],
  },
  {
    id: 'q4',
    nummer: 4,
    bereich: 'Konfliktlinien und internationale Politik',
    bereichKurz: 'Klimaschutz vs. Wirtschaft',
    typ: 'nominal',
    text: 'Bei politischen Abwägungen stehen sich oft ökologische und ökonomische Ziele gegenüber. Welcher Position stimmen Sie eher zu?',
    optionen: [
      'Maßnahmen zum Klimaschutz sollten auch dann priorisiert werden, wenn sie das Wirtschaftswachstum verlangsamen.',
      'Wirtschaftliche Stabilität sollte auch dann priorisiert werden, wenn dadurch die Umsetzung von Klimaschutzzielen verzögert wird.',
    ],
  },
  {
    id: 'q5',
    nummer: 5,
    bereich: 'Konfliktlinien und internationale Politik',
    bereichKurz: 'EU-Einstellung',
    typ: 'nominal',
    text: 'Welche Richtung sollte die Europäische Union bei der künftigen Kompetenzverteilung einschlagen?',
    optionen: [
      'Vertiefung',
      'Status Quo',
      'Renationalisierung',
    ],
  },
  {
    id: 'q6',
    nummer: 6,
    bereich: 'Konfliktlinien und internationale Politik',
    bereichKurz: 'Außenpolitik',
    typ: 'nominal',
    text: 'Auf welchen Schwerpunkt sollte sich die deutsche Außen- und Sicherheitspolitik angesichts globaler Krisen primär konzentrieren?',
    optionen: [
      'Ausbau militärischer Kapazitäten und Bündnisverteidigung',
      'Ausbau diplomatischer Instrumente und zivile Krisenprävention',
    ],
  },
  {
    id: 'q7',
    nummer: 7,
    bereich: 'Parteiensystem und Wahlabsicht',
    bereichKurz: 'Umgang mit der AfD',
    typ: 'nominal',
    text: 'Wie sollten die übrigen im Bundestag oder Landtag vertretenen Fraktionen im parlamentarischen Alltag mit der Fraktion der AfD umgehen?',
    optionen: [
      'Kooperationen und gemeinsame Abstimmungen grundsätzlich ausschließen',
      'Kooperationen und gemeinsame Abstimmungen bei inhaltlichen Übereinstimmungen im Einzelfall ermöglichen',
      'Kooperationen und Koalitionsbildungen wie mit jeder anderen Fraktion ermöglichen',
    ],
  },
  {
    id: 'q8',
    nummer: 8,
    bereich: 'Parteiensystem und Wahlabsicht',
    bereichKurz: 'Wahlabsicht',
    typ: 'nominal',
    text: 'Wenn am nächsten Sonntag Bundestagswahl wäre, welcher Partei würden Sie Ihre Zweitstimme geben?',
    optionen: [
      'CDU / CSU',
      'SPD',
      'Bündnis 90 / Die Grünen',
      'FDP',
      'AfD',
      'Die Linke',
      'BSW (Bündnis Sahra Wagenknecht)',
      'Eine andere Partei',
      'Ich bin unentschieden',
      'Ich würde nicht wählen / ungültig wählen',
    ],
  },
]

export const bereiche = [
  'Politische Sozialisation und Mediennutzung',
  'Struktur und Wandel der Gesellschaft',
  'Konfliktlinien und internationale Politik',
  'Parteiensystem und Wahlabsicht',
]
