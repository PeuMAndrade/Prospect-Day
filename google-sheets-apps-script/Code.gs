const SHEET_NAME = 'Dados';
const DEFAULT_GOAL = 30;

// Colunas fixas (0-based): O=14 (nome), P=15 (pontuacao), Q=16 (reunioes)
const COL_NOME = 14;
const COL_PONTUACAO = 15;
const COL_REUNIOES = 16;

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

  // Pula a linha de cabeçalho (linha 1) e processa as demais
  const dataRows = values.slice(1).filter(row => row.some(cell => cell !== ''));

  const participants = dataRows
    .map((row, index) => {
      const nome = String(row[COL_NOME] || '').trim();
      const pontuacao = Number(row[COL_PONTUACAO]) || 0;
      const reunioes = Number(row[COL_REUNIOES]) || 0;

      return {
        id: String(index + 1),
        nome: nome || 'Sem Nome',
        pontuacao: pontuacao,
        reunioes_marcadas: reunioes,
      };
    })
    .sort((a, b) => b.pontuacao - a.pontuacao)
    .map((participant, index) => ({
      ...participant,
      rank: index + 1,
    }));

  const totalMeetings = participants.reduce(
    (acc, curr) => acc + curr.reunioes_marcadas,
    0,
  );

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

function escapeCsv(value) {
  const text = String(value ?? '');

  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}
