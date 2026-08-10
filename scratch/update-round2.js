const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../data/jogos.csv');
const rawCSV = fs.readFileSync(csvPath, 'utf8');

function parseCSV(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((v) => v !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }

  const header = rows.shift().map((h) => h.trim());
  return {
    header,
    rows: rows
      .filter((r) => r.some((v) => v.trim() !== ''))
      .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] || '').trim()])))
  };
}

const { header, rows } = parseCSV(rawCSV);

// Remover ID 44
let filtered = rows.filter(r => String(r.id) !== '44');

// Adicionar / atualizar ID 38 (Uma verdade duas mentiras)
const index38 = filtered.findIndex(r => String(r.id) === '38');
const novo38 = {
  id: "38",
  jogo: "Uma verdade duas mentiras",
  categoria: "Duplas",
  participantes: "2+",
  mediador: "sim",
  aquecimento: "não",
  musica: "não",
  descricao: "3 duplas vão pegar do mediador ou de alguém da plateia 3 fatos, sendo 2 verdades e 1 mentira. Cada dupla deve fazer uma pequena cena de cada um dos fatos e a plateia deve decidir qual é verdade e qual é mentira.",
  visivel: "sim"
};

if (index38 >= 0) {
  filtered[index38] = novo38;
} else {
  filtered.push(novo38);
}

// Ordenar por ID numérico para manter o CSV organizado
filtered.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));

let csvOutput = header.join(',') + '\n';
for (const r of filtered) {
  const rowCols = header.map(h => {
    let val = r[h] || '';
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      val = `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  });
  csvOutput += rowCols.join(',') + '\n';
}

fs.writeFileSync(csvPath, csvOutput, 'utf8');
console.log('jogos.csv atualizado com sucesso! ID 38 adicionado e ID 44 removido.');
