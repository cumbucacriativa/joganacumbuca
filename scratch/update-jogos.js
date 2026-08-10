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

const toDeleteIds = new Set([
  70, 1, 37, 60, 57, 59, 81, 45, 80, 84, 76, 79, 62, 73, 85, 38, 61, 49, 65, 83, 46, 72, 55, 71
].map(String));

console.log(`Original rows count: ${rows.length}`);

// Filtrar as exclusões
let filtered = rows.filter(r => !toDeleteIds.has(String(r.id)));
console.log(`Rows count after deletion: ${filtered.length}`);

// Editar jogos específicos por ID
filtered = filtered.map(r => {
  const idStr = String(r.id);

  if (idStr === '25') {
    // Mímica Total: Adicionar informação sobre público definir o tema
    r.descricao = "Uma dupla improvisa uma cena completa baseada em um contexto sorteado ou definido pela plateia, sem emitir uma única palavra ou som. Toda a história, conflito, reação e uso de objetos cênicos devem ser comunicados exclusivamente através de mímica corporal e expressões faciais.";
  }

  if (idStr === '54') {
    // Cena Invertida -> Cena do Crime
    r.jogo = "Cena do Crime";
    r.categoria = "Grupos";
    r.participantes = "4+";
    r.mediador = "sim";
    r.aquecimento = "não";
    r.musica = "não";
    r.descricao = "4 atores ou mais: 1 dos atores é o investigador e os outros 3 (ou mais) são as vítimas. Em uma contagem, os atores que interpretam as vítimas devem ficar estáticos na posição em que morreram. O mediador dá o sinal e o investigador analisa as mortes de acordo com as posições dos corpos, chegando a conclusões cômicas até o momento em que declara que já sabe o que aconteceu. Ele então segue para o canto do palco e começa a narrar o que ocorreu enquanto os atores encenam a história.";
  }

  if (idStr === '33') {
    // A Maçaneta -> Quem bate à porta?
    r.jogo = "Quem bate à porta?";
    r.categoria = "Todos";
    r.participantes = "2+";
    r.mediador = "não";
    r.aquecimento = "não";
    r.musica = "não";
    r.descricao = "Cada ator deve fazer uma cena onde chega em frente a um local e bate à porta. Deve ficar explícito qual personagem ou arquétipo o ator está fazendo apenas durante o seu trajeto até bater à porta. A outra metade dos participantes faz o mesmo movimento, mas interpretando a reação ao abrir a porta. Opcional: montar filas aleatórias onde quem bate à porta encontra quem abre a porta, iniciando a partir daí uma cena com diálogo e conclusão.";
  }

  if (idStr === '50') {
    // Roteiro de Dublagem: Remover menção de microfone
    r.descricao = "Dois atores movimentam a boca no palco sem emitir som algum. Do lado de fora da cena, outros dois participantes fazem todas as vozes e falas em tempo real, precisando sincronizar a fala com os lábios e gestos dos atores de frente.";
  }

  if (idStr === '42') {
    // Em Pé Sentado e Deitado -> Jogo de aquecimento
    r.categoria = "Todos";
    r.participantes = "3+";
    r.mediador = "sim";
    r.aquecimento = "sim";
    r.musica = "não";
    r.descricao = "Jogo de aquecimento em que todos andam pelo espaço. Sempre que o mediador der um sinal, todos congelam em uma das três posições: em pé, sentado ou deitado. Das três posições, o número de atores em cada status deve ser PAR. Quem estiver em uma posição com contagem ÍMPAR é eliminado, até restarem os últimos vencedores. Dica: comece adicionando os status aos poucos, primeiro só em pé e sentado, e depois adicione o deitado.";
  }

  if (idStr === '32') {
    // Gira a Roda: Trocar forming por formando
    r.descricao = r.descricao.replace('forming', 'formando');
  }

  return r;
});

// Encontrar o maior ID para continuar sequencialmente se necessário, ou gerar novo item
const nextId = Math.max(...rows.map(r => parseInt(r.id, 10) || 0)) + 1;

// Adicionar novo jogo: Telefone Sem Fio
filtered.push({
  id: String(nextId),
  jogo: "Telefone Sem Fio",
  categoria: "Todos",
  participantes: "3+",
  mediador: "sim",
  aquecimento: "não",
  musica: "não",
  descricao: "Coloque todos os atores fora do palco sem ver nem ouvir a cena. Chame dois atores: um deve fazer uma pequena cena improvisada para o outro. O ator que assistiu memoriza a cena e o primeiro sai do palco. Entra o próximo ator que estava fora, e quem assistiu reproduz a cena para ele, assim sucessivamente. Ao final, todos apresentam em sequência suas versões da cena para ver as diferenças e detalhes que foram se perdendo pelo caminho.",
  visivel: "sim"
});

console.log(`Final rows count: ${filtered.length}`);

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
console.log('jogos.csv atualizado com sucesso!');
