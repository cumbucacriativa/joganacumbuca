const fs = require('fs');
const path = require('path');

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

const jogosCSV = fs.readFileSync(path.join(__dirname, '../data/jogos.csv'), 'utf8');
const { header, rows } = parseCSV(jogosCSV);

console.log('Headers:', header);
console.log(`Total de jogos no CSV: ${rows.length}`);
console.log('Categorias:', [...new Set(rows.map(r => r.categoria))]);

// Verificar os jogos editados
const id25 = rows.find(r => r.id === '25');
const id54 = rows.find(r => r.id === '54');
const id33 = rows.find(r => r.id === '33');
const id50 = rows.find(r => r.id === '50');
const id42 = rows.find(r => r.id === '42');
const id32 = rows.find(r => r.id === '32');
const novoTelefone = rows.find(r => r.jogo === 'Telefone Sem Fio');

console.log('\n--- VERIFICAÇÃO DOS EDITADOS ---');
console.log('ID 25 (Mímica Total):', id25 ? id25.descricao : 'não encontrado');
console.log('ID 54 (Cena do Crime):', id54 ? `${id54.jogo} (${id54.participantes}) - ${id54.descricao.substring(0, 60)}...` : 'não encontrado');
console.log('ID 33 (Quem bate à porta?):', id33 ? `${id33.jogo} (${id33.categoria}) - ${id33.descricao.substring(0, 60)}...` : 'não encontrado');
console.log('ID 50 (Roteiro de Dublagem):', id50 ? id50.descricao : 'não encontrado');
console.log('ID 42 (Aquecimento posições):', id42 ? `${id42.jogo} (${id42.categoria}, aquecimento: ${id42.aquecimento})` : 'não encontrado');
console.log('ID 32 (Gira a Roda):', id32 ? id32.descricao.substring(0, 60) : 'não encontrado');
console.log('Novo Telefone Sem Fio:', novoTelefone ? `ID ${novoTelefone.id} - ${novoTelefone.jogo}` : 'não encontrado');
