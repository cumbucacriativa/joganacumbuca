'use strict';

const TODAS = 'Todas as Categorias';

/* ---------- CSV (suporta campos entre aspas com vírgula) ---------- */

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

const fetchCSV = (p) => fetch(p).then((r) => r.text()).then(parseCSV);

/* ---------- Estado ---------- */

const state = {
  jogos: [],
  categorias: [TODAS],
  personagens: [],
  locais: [],
  catIndex: 0,
  jogoAtual: null,
  filtroLista: TODAS,
};

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const jogosDe = (cat) => (!cat || cat === TODAS ? state.jogos : state.jogos.filter((j) => j.categoria === cat));

function replay(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

/* ---------- Troca de tela: carta gira pra sair, outra gira pra entrar ---------- */

const OUT_MS = 260, IN_MS = 340;
let activeScreen = document.getElementById('screen-inicio');
let flipTimers = [];

function goTo(id) {
  const next = document.getElementById(id);
  if (!next || next === activeScreen) return;

  // um toque novo durante um giro em andamento redireciona, nunca é descartado
  flipTimers.forEach(clearTimeout);
  flipTimers = [];
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('is-flip-out', 'is-flip-in'));

  const prev = activeScreen;
  prev.classList.add('is-flip-out');

  flipTimers.push(setTimeout(() => {
    prev.classList.remove('is-active', 'is-flip-out');
    next.classList.add('is-active', 'is-flip-in');
    activeScreen = next;
    flipTimers.push(setTimeout(() => next.classList.remove('is-flip-in'), IN_MS));
  }, OUT_MS));
}

/* ---------- Tela 2 — categorias ---------- */

const categoryNameEl = document.getElementById('category-name');

function renderCategoria() {
  const cat = state.categorias[state.catIndex];
  categoryNameEl.textContent = cat;
  // "TRIOS" cabe nos 55px do design; nomes longos precisam encolher
  categoryNameEl.classList.toggle('is-longa', cat.length > 8);
  replay(categoryNameEl, 'is-swapping');
}

function stepCategoria(dir) {
  const n = state.categorias.length;
  if (n < 2) return;
  state.catIndex = (state.catIndex + dir + n) % n;
  renderCategoria();
}

/* ---------- Tela 3 — carta do jogo ---------- */

const gameBodyEl = document.getElementById('game-card-body');
const gameTitleEl = document.getElementById('game-title');
const gameTagsEl = document.getElementById('game-tags');
const gameDescEl = document.getElementById('game-description');

// "2+" no CSV é exibido como "2 ou +" na carta do jogo (como no design)
const expandirParticipantes = (v) => (v || '').replace(/^(\d+)\+$/, '$1 ou +');

function renderJogo(jogo) {
  state.jogoAtual = jogo;
  gameTitleEl.textContent = jogo.jogo;

  const tags = [];
  if (jogo.participantes)
    tags.push(`<span class="tag"><img src="assets/img/tag-participantes.svg" alt="">${expandirParticipantes(jogo.participantes)}</span>`);
  if (jogo.mediador === 'sim')
    tags.push('<span class="tag"><img src="assets/img/tag-mediador.svg" alt="">Mediador</span>');
  if (jogo.aquecimento === 'sim')
    tags.push('<span class="tag"><img src="assets/img/tag-aquecimento.svg" alt="">Aquecimento</span>');
  gameTagsEl.innerHTML = tags.join('');

  gameDescEl.textContent = jogo.descricao || '';
  replay(gameBodyEl, 'is-swapping');
}

function sortearJogo(cat) {
  const lista = jogosDe(cat);
  if (lista.length) renderJogo(pick(lista));
  return lista.length > 0;
}

/* ---------- Tela 4 — lista ---------- */

const selectEl = document.getElementById('category-select');
const listEl = document.getElementById('game-list');

function renderLista() {
  listEl.innerHTML = jogosDe(state.filtroLista).map((j) => {
    const icons = [];
    if (j.aquecimento === 'sim') icons.push('<img src="assets/img/tag-aquecimento.svg" alt="Aquecimento">');
    if (j.mediador === 'sim') icons.push('<img src="assets/img/tag-mediador.svg" alt="Mediador">');
    if (j.participantes) icons.push(`${j.participantes}<img src="assets/img/tag-participantes.svg" alt="Participantes">`);
    return `<li data-jogo="${j.jogo}"><span>${j.jogo}</span><span class="game-list__icons">${icons.join('')}</span></li>`;
  }).join('');
}

listEl.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;
  const jogo = state.jogos.find((j) => j.jogo === li.dataset.jogo);
  if (jogo) { renderJogo(jogo); goTo('screen-jogo'); }
});

selectEl.addEventListener('change', () => {
  state.filtroLista = selectEl.value;
  renderLista();
});

/* ---------- Overlay do dado: local e personagem, sorteios independentes ---------- */

const badgeEl = document.getElementById('dice-badge');
const overlayEl = document.getElementById('dice-overlay');
const btnLocal = document.getElementById('btn-local');
const btnPersonagem = document.getElementById('btn-personagem');

function openOverlay() {
  replay(badgeEl, 'is-rolling');
  setTimeout(() => {
    badgeEl.classList.add('is-open');
    overlayEl.classList.add('is-open');
  }, 300);
}
function closeOverlay() {
  overlayEl.classList.remove('is-open');
  setTimeout(() => badgeEl.classList.remove('is-open', 'is-rolling'), 300);
}

badgeEl.addEventListener('click', openOverlay);
document.getElementById('dice-overlay-close').addEventListener('click', closeOverlay);

btnLocal.addEventListener('click', () => {
  if (!state.locais.length) return;
  btnLocal.textContent = pick(state.locais);
  replay(btnLocal, 'is-swapping');
});
btnPersonagem.addEventListener('click', () => {
  if (!state.personagens.length) return;
  btnPersonagem.textContent = pick(state.personagens);
  replay(btnPersonagem, 'is-swapping');
});

/* ---------- Navegação ---------- */

document.getElementById('btn-iniciar').addEventListener('click', () => goTo('screen-categoria'));

document.getElementById('btn-sortear').addEventListener('click', () => {
  if (sortearJogo(state.categorias[state.catIndex])) goTo('screen-jogo');
});

document.getElementById('btn-lista').addEventListener('click', () => {
  state.filtroLista = state.categorias[state.catIndex];
  selectEl.value = state.filtroLista;
  renderLista();
  goTo('screen-lista');
});

document.getElementById('cat-up').addEventListener('click', () => stepCategoria(-1));
document.getElementById('cat-down').addEventListener('click', () => stepCategoria(1));

document.getElementById('btn-resortear').addEventListener('click', () => {
  sortearJogo(state.jogoAtual ? state.jogoAtual.categoria : state.categorias[state.catIndex]);
});

// "+ OPÇÕES" volta para a lista de jogos
document.getElementById('btn-opcoes').addEventListener('click', () => {
  state.filtroLista = state.jogoAtual ? state.jogoAtual.categoria : TODAS;
  selectEl.value = state.filtroLista;
  renderLista();
  goTo('screen-lista');
});

document.getElementById('btn-aleatorio').addEventListener('click', () => {
  if (sortearJogo(state.filtroLista)) goTo('screen-jogo');
});

document.getElementById('btn-fechar-lista').addEventListener('click', () => goTo('screen-categoria'));

/* ---------- Rodapé: carrossel infinito (metade duplicada p/ loop sem emenda) ---------- */

function buildFooter() {
  const track = document.getElementById('footer-track');
  const half = 10;
  track.innerHTML = Array.from({ length: half * 2 },
    () => '<img src="assets/img/carta-rodape.svg" alt="">').join('');
}

/* ---------- Boot ---------- */

async function boot() {
  buildFooter();

  const [jogos, aleatorio] = await Promise.all([
    fetchCSV('data/jogos.csv'),
    fetchCSV('data/aleatoriedades.csv'),
  ]);

  state.jogos = jogos;
  state.categorias = [TODAS, ...new Set(jogos.map((j) => j.categoria).filter(Boolean))];
  state.personagens = aleatorio.map((r) => r.Personagem).filter(Boolean);
  state.locais = aleatorio.map((r) => r.Localizacao).filter(Boolean);

  selectEl.innerHTML = state.categorias.map((c) => `<option value="${c}">${c}</option>`).join('');
  renderCategoria();
  renderLista();
}

boot();
