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

// Alterar ID 25
const index25 = rows.findIndex(r => String(r.id) === '25');
if (index25 >= 0) {
  rows[index25].jogo = "Mímica";
  rows[index25].categoria = "Grupos";
  rows[index25].participantes = "4+";
  rows[index25].mediador = "sim";
  rows[index25].aquecimento = "não";
  rows[index25].musica = "não";
  rows[index25].descricao = "O mediador escolhe um tema (objeto, filme ou afim). Os grupos decidem quem vai começar. O grupo da vez escolhe uma pessoa da outra equipe para fazer a mímica de algo dentro do tema e diz o segredo apenas para ela. Essa pessoa faz a mímica para o seu próprio grupo: se acertarem em 1 minuto, ganham 1 ponto. As equipes se alternam sem repetir quem faz a mímica até que todos tenham ido uma vez, reiniciando a fila em seguida.";
}

// Adicionar Objeto Mímico
const nextId = Math.max(...rows.map(r => parseInt(r.id, 10) || 0)) + 1;

rows.push({
  id: String(nextId),
  jogo: "Objeto Mímico",
  categoria: "Grupos",
  participantes: "4+",
  mediador: "sim",
  aquecimento: "não",
  musica: "não",
  descricao: "Em grupos, cada equipe recebe um objeto do mediador e deve representar esse objeto unindo todos os participantes do grupo, usando movimentos e sons (desde que não sejam palavras). Sempre que alguém acertar o objeto, o grupo que fez a mímica ganha 2 pontos e a equipe que acertou ganha 1 ponto.",
  visivel: "sim"
});

// Re-ordenar por ID numérico
rows.sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10));

let csvOutput = header.join(',') + '\n';
for (const r of rows) {
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
console.log('jogos.csv atualizado com sucesso na Rodada 4!');
