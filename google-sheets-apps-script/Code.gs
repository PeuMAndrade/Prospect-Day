const SHEET_NAME = 'Dados';
const DEFAULT_GOAL = 100;

function doGet(e) {
  const payload = buildPayloadFromSheet();
  const callback = e && e.parameter && e.parameter.callback;

  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${JSON.stringify(payload)})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function buildPayloadFromSheet() {
  const sheet = findDataSheet();

  if (!sheet) {
    throw new Error('Nenhuma aba com dados foi encontrada.');
  }

  const values = sheet.getDataRange().getValues();

  if (values.length < 2) {
    return {
      participants: [],
      totalMeetings: 0,
      goal: DEFAULT_GOAL,
      lastUpdated: new Date().toISOString(),
    };
  }

  const headers = values[0].map(value => String(value).trim().toLowerCase());
  const rows = values.slice(1).filter(row => row.some(cell => cell !== ''));

  const participants = rows.map((row, index) => {
    const record = rowToObject(headers, row);

    return {
      id: String(record.id || index + 1),
      nome: String(record.nome || 'Sem Nome'),
      pontuacao: Number(record.pontuacao) || 0,
      reunioes_marcadas: Number(record.reunioes_marcadas) || 0,
      reunioes_marcadas_nucleos_diferentes: Number(record.reunioes_marcadas_nucleos_diferentes) || 0,
      ligacoes_atendidas: Number(record.ligacoes_atendidas) || 0,
    };
  }).sort((a, b) => b.pontuacao - a.pontuacao).map((participant, index) => ({
    ...participant,
    rank: index + 1,
  }));

  const totalMeetings = participants.reduce((acc, curr) => acc + curr.reunioes_marcadas, 0);

  return {
    participants,
    totalMeetings,
    goal: DEFAULT_GOAL,
    lastUpdated: new Date().toISOString(),
  };
}

function findDataSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const preferredSheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (preferredSheet) {
    return preferredSheet;
  }

  const sheets = spreadsheet.getSheets();

  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i];
    if (sheet.getLastRow() > 0 && sheet.getLastColumn() > 0) {
      return sheet;
    }
  }

  return null;
}

function rowToObject(headers, row) {
  return headers.reduce((acc, header, index) => {
    if (!header) {
      return acc;
    }

    acc[header] = row[index];
    return acc;
  }, {});
}