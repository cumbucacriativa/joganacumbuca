const fs = require('fs');

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
  return rows
    .filter((r) => r.some((v) => v.trim() !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] || '').trim()])));
}

const jogosCSV = fs.readFileSync(__dirname + '/../data/jogos.csv', 'utf8');
const jogos = parseCSV(jogosCSV);
console.log(`Jogos carregados: ${jogos.length}`);
console.log('Categorias encontradas:', [...new Set(jogos.map(j => j.categoria))]);

const aleatCSV = fs.readFileSync(__dirname + '/../data/aleatoriedades.csv', 'utf8');
const aleat = parseCSV(aleatCSV);
console.log(`Aleatoriedades carregadas: ${aleat.length} linhas`);
