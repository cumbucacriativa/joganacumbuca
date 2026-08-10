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

const toDelete = new Set(['52', '36', '53', '82', '48', '30']);

let filtered = rows.filter(r => !toDelete.has(String(r.id)));

filtered = filtered.map(r => {
  const idStr = String(r.id);

  if (idStr === '42') {
    // 42: mudar o nome para 1 2 3 4
    r.jogo = "1 2 3 4";
    r.descricao = "Todos andam pelo espaço. Quando o mediador diz 1, os atores devem congelar e permanecer em pé; no 2, ficam no plano médio; no 3, deitados; no 4, devem pular. Se alguém fizer errado, é eliminado e o jogo segue.";
  }

  if (idStr === '43') {
    // 43: mudar o nome para "Momento Oscar" sem o "do"
    r.jogo = "Momento Oscar";
  }

  if (idStr === '69') {
    // 69: Tirar informação que 2 primeiros saem de cena -> eles congelam
    r.descricao = "Uma cena dramática acontece no palco. A qualquer momento, el mediador bate palma e grita 'Comercial!'. Os atores da cena congelam e outros dois atores entram para apresentar um comercial de TV rápido de um produto inventado, voltando à cena principal em seguida.".replace('el mediador', 'o mediador');
  }

  if (idStr === '32') {
    // 32: Adicionar informação pra quando o quadrado der a volta a cena que tinha sido feita antes deve voltar, e na terceira girada todas as cenas devem ter um fim
    r.descricao = "Quatro atores se posicionam formando um quadrado no palco. Os dois da frente encenam. Quando o mediador grita 'Gira!', todos giram 90 graus para a direita e a nova dupla da frente inicia uma nova cena. Quando o quadrado der a volta completa, a cena que tinha sido iniciada antes deve voltar exatamente de onde parou. Na terceira girada, todas as cenas devem ter um fim.";
  }

  if (idStr === '56') {
    // 56: Mude o nome para "Corpo que fala"
    r.jogo = "Corpo que fala";
  }

  if (idStr === '64') {
    // 64: Muda pra Passado, presente, futuro e nova descrição
    r.jogo = "Passado, presente, futuro";
    r.descricao = "Divida o palco em 3 pedaços, onde cada pedaço representa uma linha temporal: passado, presente e futuro. O mediador escolhe qual tempo deve começar. Um ator vai até o pedaço que representa esse tempo e faz uma pose/imagem. Depois, dois atores devem preencher os outros dois pedaços e congelarem pensando em passado, presente e futuro. O mediador faz um sinal e o ator começa uma cena a partir da sua imagem e termina na pose do presente, e o mesmo segue até o futuro.";
  }

  if (idStr === '66') {
    // 66: Muda o nome para "Objeto Imaginado"
    r.jogo = "Objeto Imaginado";
  }

  if (idStr === '13') {
    // 13: muda o titulo para Gêmeos Siameses
    r.jogo = "Gêmeos Siameses";
  }

  if (idStr === '27') {
    // 27: Muda o nome para Estilos
    r.jogo = "Estilos";
  }

  return r;
});

// Re-ordenar por ID numérico
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
console.log('jogos.csv atualizado com sucesso na Rodada 3!');
