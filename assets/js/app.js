'use strict';

/* ---------- CSV parsing (handles quoted fields with commas) ---------- */

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { field += c; }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((v) => v !== '')) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }

  const header = rows.shift().map((h) => h.trim());
  return rows
    .filter((r) => r.length && r.some((v) => v.trim() !== ''))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] || '').trim()])));
}

async function fetchCSV(path) {
  const res = await fetch(path);
  const text = await res.text();
  return parseCSV(text);
}

/* ---------- State ---------- */

const state = {
  jogos: [],
  categorias: [],
  aleatoriedades: { Personagem: [], Localizacao: [] },
  categoriaIndex: 0,
  jogoAtual: null,
  listaFiltro: 'Todas as Categorias',
  personagem: null,
  localAtual: null,
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function expandParticipantes(v) {
  if (!v) return '';
  return v.replace(/^(\d+)\+$/, '$1 ou +');
}

function jogosDaCategoria(categoria) {
  if (!categoria || categoria === 'Todas as Categorias') return state.jogos;
  return state.jogos.filter((j) => j.categoria === categoria);
}

/* ---------- Screen transitions (card-flip) ---------- */

const screensEl = document.getElementById('screens');
let activeScreen = null;

function goTo(id) {
  const next = document.getElementById(id);
  if (!next || next === activeScreen) return;
  const prev = activeScreen;

  if (prev) {
    prev.classList.add('is-leaving');
    prev.classList.remove('is-active');
  }
  next.classList.add('is-entering');
  requestAnimationFrame(() => {
    next.classList.add('is-active');
  });

  setTimeout(() => {
    if (prev) prev.classList.remove('is-leaving');
    next.classList.remove('is-entering');
  }, 520);

  activeScreen = next;
}

/* ---------- Render: categoria screen ---------- */

const categoryNameEl = document.getElementById('category-name');

function renderCategoria() {
  const cat = state.categorias[state.categoriaIndex];
  categoryNameEl.textContent = cat || '';
}

function stepCategoria(dir) {
  const n = state.categorias.length;
  if (!n) return;
  state.categoriaIndex = (state.categoriaIndex + dir + n) % n;
  renderCategoria();
}

/* ---------- Render: jogo card ---------- */

const gameTitleEl = document.getElementById('game-title');
const gameTagsEl = document.getElementById('game-tags');
const gameDescEl = document.getElementById('game-description');

function tagIcon(src, label) {
  return `<span class="tag"><img src="${src}" alt=""> ${label}</span>`;
}

function renderJogo(jogo) {
  state.jogoAtual = jogo;
  gameTitleEl.textContent = jogo.jogo;
  const tags = [];
  if (jogo.participantes) tags.push(tagIcon('assets/icons/tag-participantes.svg', expandParticipantes(jogo.participantes)));
  if (jogo.mediador === 'sim') tags.push(tagIcon('assets/icons/tag-mediador.svg', 'Mediador'));
  if (jogo.aquecimento === 'sim') tags.push(tagIcon('assets/icons/tag-aquecimento.svg', 'Aquecimento'));
  if (jogo.musica === 'sim') tags.push(tagIcon('assets/icons/tag-musica.svg', 'Música'));
  gameTagsEl.innerHTML = tags.join('');
  gameDescEl.textContent = jogo.descricao || 'Descrição desse jogo ainda não cadastrada.';
}

function sortearJogo(categoria) {
  const lista = jogosDaCategoria(categoria);
  if (!lista.length) return;
  renderJogo(pickRandom(lista));
}

/* ---------- Render: lista de jogos ---------- */

const categorySelectEl = document.getElementById('category-select');
const gameListEl = document.getElementById('game-list');

function fillCategorySelect() {
  categorySelectEl.innerHTML = ['Todas as Categorias', ...state.categorias]
    .map((c) => `<option value="${c}">${c}</option>`)
    .join('');
}

function renderLista() {
  const lista = jogosDaCategoria(state.listaFiltro);
  gameListEl.innerHTML = lista.map((jogo) => {
    const icons = [];
    if (jogo.aquecimento === 'sim') icons.push('<img src="assets/icons/tag-aquecimento.svg" alt="Aquecimento">');
    if (jogo.mediador === 'sim') icons.push('<img src="assets/icons/tag-mediador.svg" alt="Mediador">');
    if (jogo.musica === 'sim') icons.push('<img src="assets/icons/tag-musica.svg" alt="Música">');
    if (jogo.participantes) icons.push(`<span>${jogo.participantes}</span><img src="assets/icons/tag-participantes.svg" alt="Participantes">`);
    return `<li data-jogo="${jogo.jogo}"><span>${jogo.jogo}</span><span class="game-icons">${icons.join('')}</span></li>`;
  }).join('');
}

gameListEl.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  const jogo = state.jogos.find((j) => j.jogo === li.dataset.jogo);
  if (jogo) { renderJogo(jogo); goTo('screen-jogo'); }
});

categorySelectEl.addEventListener('change', () => {
  state.listaFiltro = categorySelectEl.value;
  renderLista();
});

document.getElementById('btn-aleatorio').addEventListener('click', () => {
  const lista = jogosDaCategoria(state.listaFiltro);
  if (!lista.length) return;
  renderJogo(pickRandom(lista));
  goTo('screen-jogo');
});

/* ---------- Dice overlay: personagem / local (independentes) ---------- */

const diceOverlay = document.getElementById('dice-overlay');
const btnLocal = document.getElementById('btn-local');
const btnPersonagem = document.getElementById('btn-personagem');

function rollLocal() {
  if (!state.aleatoriedades.Localizacao.length) return;
  state.localAtual = pickRandom(state.aleatoriedades.Localizacao);
  btnLocal.textContent = state.localAtual;
}
function rollPersonagem() {
  if (!state.aleatoriedades.Personagem.length) return;
  state.personagem = pickRandom(state.aleatoriedades.Personagem);
  btnPersonagem.textContent = state.personagem;
}

document.getElementById('dice-badge').addEventListener('click', (e) => {
  e.currentTarget.classList.add('is-rolling');
  setTimeout(() => e.currentTarget.classList.remove('is-rolling'), 500);
  diceOverlay.classList.add('is-open');
});
document.getElementById('dice-overlay-close').addEventListener('click', () => {
  diceOverlay.classList.remove('is-open');
});
btnLocal.addEventListener('click', rollLocal);
btnPersonagem.addEventListener('click', rollPersonagem);

/* ---------- Navigation wiring ---------- */

document.getElementById('btn-iniciar').addEventListener('click', () => goTo('screen-categoria'));
document.getElementById('btn-sortear-categoria').addEventListener('click', () => {
  sortearJogo(state.categorias[state.categoriaIndex]);
  goTo('screen-jogo');
});
document.getElementById('btn-lista').addEventListener('click', () => {
  state.listaFiltro = 'Todas as Categorias';
  categorySelectEl.value = state.listaFiltro;
  renderLista();
  goTo('screen-lista');
});
document.getElementById('cat-up').addEventListener('click', () => stepCategoria(-1));
document.getElementById('cat-down').addEventListener('click', () => stepCategoria(1));
document.getElementById('btn-resortear').addEventListener('click', () => {
  const cat = state.jogoAtual ? state.jogoAtual.categoria : state.categorias[state.categoriaIndex];
  sortearJogo(cat);
});
document.getElementById('btn-fechar-lista').addEventListener('click', () => goTo('screen-categoria'));

document.querySelectorAll('.js-go-home').forEach((el) => {
  el.addEventListener('click', () => goTo('screen-inicio'));
});

/* ---------- Boot ---------- */

async function boot() {
  const [jogos, aleatorio] = await Promise.all([
    fetchCSV('data/jogos.csv'),
    fetchCSV('data/aleatoriedades.csv'),
  ]);

  state.jogos = jogos;
  state.categorias = [...new Set(jogos.map((j) => j.categoria).filter(Boolean))];
  state.aleatoriedades.Personagem = aleatorio.map((r) => r.Personagem).filter(Boolean);
  state.aleatoriedades.Localizacao = aleatorio.map((r) => r.Localizacao).filter(Boolean);

  fillCategorySelect();
  renderCategoria();

  activeScreen = document.getElementById('screen-inicio');
  activeScreen.classList.add('is-active');
}

boot();
