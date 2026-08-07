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
  filmes: [],
  adjetivos: [],
  catIndex: 0,
  jogoAtual: null,
  filtroLista: TODAS,
};

const jogosDe = (cat) => (!cat || cat === TODAS ? state.jogos : state.jogos.filter((j) => j.categoria === cat));

/* ---------- Sacola: sorteia sem repetir até esgotar todas as opções ---------- */
/* Em vez de Math.random puro (que pode repetir a mesma coisa várias vezes seguidas
   ou demorar pra passar por tudo), cada "sacola" embaralha a lista inteira e vai
   tirando uma por uma; só reembaralha quando esvazia — e evita repetir de novo
   bem o último item tirado na emenda entre uma rodada e a próxima. Vale pra jogo,
   personagem e local, como pedido. */

function embaralhar(lista) {
  const copia = lista.slice();
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function criarSacola(itens) {
  let restantes = [];
  let ultimoTirado;
  return {
    tirar() {
      if (!itens.length) return undefined;
      if (!restantes.length) {
        restantes = embaralhar(itens);
        if (restantes.length > 1 && restantes[restantes.length - 1] === ultimoTirado) {
          [restantes[0], restantes[restantes.length - 1]] = [restantes[restantes.length - 1], restantes[0]];
        }
      }
      ultimoTirado = restantes.pop();
      return ultimoTirado;
    },
  };
}

// uma sacola de jogos por categoria/filtro (chave = nome da categoria ou "Todas as Categorias")
const sacolasDeJogos = new Map();
function tirarJogo(cat) {
  const chave = cat || TODAS;
  if (!sacolasDeJogos.has(chave)) sacolasDeJogos.set(chave, criarSacola(jogosDe(cat)));
  return sacolasDeJogos.get(chave).tirar();
}

let sacolaPersonagens = null;
let sacolaLocais = null;
let sacolaFilmes = null;
let sacolaAdjetivos = null;
const tirarPersonagem = () => {
  if (!sacolaPersonagens) sacolaPersonagens = criarSacola(state.personagens);
  return sacolaPersonagens.tirar();
};
const tirarLocal = () => {
  if (!sacolaLocais) sacolaLocais = criarSacola(state.locais);
  return sacolaLocais.tirar();
};
const tirarFilme = () => {
  if (!sacolaFilmes) sacolaFilmes = criarSacola(state.filmes);
  return sacolaFilmes.tirar();
};
const tirarAdjetivo = () => {
  if (!sacolaAdjetivos) sacolaAdjetivos = criarSacola(state.adjetivos);
  return sacolaAdjetivos.tirar();
};

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
const gameIdEl = document.getElementById('game-id');
const gameTitleEl = document.getElementById('game-title');
const gameTagsEl = document.getElementById('game-tags');
const gameDescEl = document.getElementById('game-description');

// "2+" no CSV é exibido como "2 ou +" na carta do jogo (como no design)
const expandirParticipantes = (v) => (v || '').replace(/^(\d+)\+$/, '$1 ou +');

function renderJogo(jogo) {
  state.jogoAtual = jogo;
  gameIdEl.textContent = jogo.id ? `#${jogo.id}` : '';
  gameTitleEl.textContent = jogo.jogo;

  const tags = [];
  if (jogo.participantes)
    tags.push(`<span class="tag"><img src="assets/img/tag-participantes.svg" alt="">${expandirParticipantes(jogo.participantes)}</span>`);
  if (jogo.mediador === 'sim')
    tags.push('<span class="tag"><img src="assets/img/tag-mediador.svg" alt="">Mediador</span>');
  if (jogo.aquecimento === 'sim')
    tags.push('<span class="tag"><img src="assets/img/tag-aquecimento.svg" alt="">Aquecimento</span>');
  if (jogo.musica === 'sim')
    tags.push('<span class="tag"><img src="assets/img/tag-musica.svg" alt="">Precisa de música</span>');
  gameTagsEl.innerHTML = tags.join('');

  gameDescEl.textContent = jogo.descricao || '';
  replay(gameBodyEl, 'is-swapping');
}

function sortearJogo(cat) {
  const jogo = tirarJogo(cat);
  if (jogo) renderJogo(jogo);
  return !!jogo;
}

/* ---------- Tela 4 — lista ---------- */

const selectEl = document.getElementById('category-select');
const listEl = document.getElementById('game-list');

// linha de jogo reutilizada tanto na lista por categoria quanto nos resultados da busca
function linhaDeJogo(j) {
  const icons = [];
  if (j.aquecimento === 'sim') icons.push('<img src="assets/img/tag-aquecimento.svg" alt="Aquecimento">');
  if (j.mediador === 'sim') icons.push('<img src="assets/img/tag-mediador.svg" alt="Mediador">');
  if (j.musica === 'sim') icons.push('<img src="assets/img/tag-musica.svg" alt="Precisa de música">');
  if (j.participantes) icons.push(`${j.participantes}<img src="assets/img/tag-participantes.svg" alt="Participantes">`);
  return `<li data-id="${j.id}"><span>${j.jogo}</span><span class="game-list__icons">${icons.join('')}</span></li>`;
}

function renderLista() {
  listEl.innerHTML = jogosDe(state.filtroLista).map(linhaDeJogo).join('');
}

function abrirJogoDaLinha(li) {
  const jogo = state.jogos.find((j) => j.id === li.dataset.id);
  if (jogo) { renderJogo(jogo); goTo('screen-jogo'); }
}

listEl.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (li) abrirJogoDaLinha(li);
});

selectEl.addEventListener('change', () => {
  state.filtroLista = selectEl.value;
  renderLista();
});

/* ---------- Busca por texto (jogo, categoria ou trecho da regra) ---------- */

const searchBadgeEl = document.getElementById('search-badge');
const searchOverlayEl = document.getElementById('search-overlay');
const searchInputEl = document.getElementById('search-input');
const searchResultsEl = document.getElementById('search-results');
const searchHintEl = document.getElementById('search-hint');

// tira acento pra "musica" achar "Música" também
const normalizar = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function renderBusca() {
  const termo = normalizar(searchInputEl.value.trim());
  searchHintEl.classList.toggle('is-hidden', termo.length > 0);

  if (!termo) { searchResultsEl.innerHTML = ''; return; }

  const achados = state.jogos.filter((j) =>
    j.id === termo.replace('#', '') ||
    normalizar(j.jogo).includes(termo) ||
    normalizar(j.categoria).includes(termo) ||
    normalizar(j.descricao).includes(termo));

  searchResultsEl.innerHTML = achados.length
    ? achados.map(linhaDeJogo).join('')
    : '<li class="search-overlay__empty">Nenhum jogo encontrado. Tenta outra palavra.</li>';
}

function abrirBusca() {
  closeOverlay(); // só um painel aberto por vez
  searchBadgeEl.classList.add('is-open');
  searchOverlayEl.classList.add('is-open');
  setTimeout(() => searchInputEl.focus(), 250);
}
function fecharBusca() {
  searchOverlayEl.classList.remove('is-open');
  searchBadgeEl.classList.remove('is-open');
  searchInputEl.value = '';
  renderBusca();
}

searchBadgeEl.addEventListener('click', abrirBusca);
document.getElementById('search-overlay-close').addEventListener('click', fecharBusca);
searchInputEl.addEventListener('input', renderBusca);
searchResultsEl.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-id]');
  if (!li) return;
  abrirJogoDaLinha(li);
  fecharBusca();
});

/* ---------- Overlay do dado: local e personagem, sorteios independentes ---------- */

const badgeEl = document.getElementById('dice-badge');
const overlayEl = document.getElementById('dice-overlay');
const btnLocal = document.getElementById('btn-local');
const btnPersonagem = document.getElementById('btn-personagem');
const btnFilme = document.getElementById('btn-filme');
const btnAdjetivo = document.getElementById('btn-adjetivo');

function openOverlay() {
  fecharBusca(); // só um painel aberto por vez
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
  const local = tirarLocal();
  if (!local) return;
  btnLocal.textContent = local;
  replay(btnLocal, 'is-swapping');
});
btnPersonagem.addEventListener('click', () => {
  const personagem = tirarPersonagem();
  if (!personagem) return;
  btnPersonagem.textContent = personagem;
  replay(btnPersonagem, 'is-swapping');
});
btnFilme.addEventListener('click', () => {
  const filme = tirarFilme();
  if (!filme) return;
  btnFilme.textContent = filme;
  replay(btnFilme, 'is-swapping');
});
btnAdjetivo.addEventListener('click', () => {
  const adjetivo = tirarAdjetivo();
  if (!adjetivo) return;
  btnAdjetivo.textContent = adjetivo;
  replay(btnAdjetivo, 'is-swapping');
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

/* ---------- Admin: senha (uma vez por sessão), cadastro e exclusão de jogo ---------- */
/* A senha aqui é só uma trava de conveniência no app — qualquer um vendo o código-fonte
   acha ela. A trava de verdade é no n8n: tanto o formulário de cadastro quanto o webhook
   de exclusão conferem a mesma senha do lado do servidor antes de gravar qualquer coisa
   no GitHub, então mesmo pulando essa tela ninguém escreve no jogos.csv sem a senha certa. */

const ADMIN_SENHA = '!admin123';
const ADD_FORM_URL = 'https://lava-automations-n8n.tgervl.easypanel.host/form/9b2cd1a6-7863-44ce-a7cf-7817164b12ed';
const DELETE_WEBHOOK_URL = 'https://lava-automations-n8n.tgervl.easypanel.host/webhook/4bd6eeb9-f48a-4bc7-891a-77d002b1e2f9/joga-na-cumbuca-excluir';

const admOk = () => sessionStorage.getItem('jncAdmin') === '1';
const admMarcarOk = () => sessionStorage.setItem('jncAdmin', '1');

const adminOverlayEl = document.getElementById('admin-overlay');
const adminInputEl = document.getElementById('admin-input');
const adminErroEl = document.getElementById('admin-erro');
let adminCallback = null;

function pedirSenha(aoConfirmar) {
  if (admOk()) { aoConfirmar(); return; }
  adminCallback = aoConfirmar;
  adminErroEl.classList.add('is-hidden');
  adminInputEl.value = '';
  adminOverlayEl.classList.add('is-open');
  setTimeout(() => adminInputEl.focus(), 250);
}
function fecharAdmin() {
  adminOverlayEl.classList.remove('is-open');
  adminCallback = null;
}

document.getElementById('admin-overlay-close').addEventListener('click', fecharAdmin);
document.getElementById('admin-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (adminInputEl.value === ADMIN_SENHA) {
    admMarcarOk();
    const cb = adminCallback;
    fecharAdmin();
    if (cb) cb();
  } else {
    adminErroEl.classList.remove('is-hidden');
    adminInputEl.value = '';
    adminInputEl.focus();
  }
});

document.getElementById('add-badge').addEventListener('click', (e) => {
  e.preventDefault();
  pedirSenha(() => window.open(ADD_FORM_URL, '_blank', 'noopener'));
});

const confirmOverlayEl = document.getElementById('confirm-overlay');
const confirmTextoEl = document.getElementById('confirm-texto');
let confirmCallback = null;

function pedirConfirmacao(texto, aoConfirmar) {
  confirmTextoEl.textContent = texto;
  confirmCallback = aoConfirmar;
  confirmOverlayEl.classList.add('is-open');
}
function fecharConfirmacao() {
  confirmOverlayEl.classList.remove('is-open');
  confirmCallback = null;
}
document.getElementById('confirm-sim').addEventListener('click', () => {
  const cb = confirmCallback;
  fecharConfirmacao();
  if (cb) cb();
});
document.getElementById('confirm-nao').addEventListener('click', fecharConfirmacao);

const btnExcluirEl = document.getElementById('btn-excluir-jogo');
btnExcluirEl.addEventListener('click', () => {
  if (!state.jogoAtual) return;
  pedirSenha(() => {
    pedirConfirmacao(`Excluir "${state.jogoAtual.jogo}" da lista? Some do app, mas fica registrado no histórico do GitHub.`, excluirJogoAtual);
  });
});

async function excluirJogoAtual() {
  const jogo = state.jogoAtual;
  if (!jogo) return;
  btnExcluirEl.disabled = true;
  try {
    const res = await fetch(DELETE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: jogo.id, senha: ADMIN_SENHA }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) {
      state.jogos = state.jogos.filter((j) => j.id !== jogo.id);
      state.categorias = [TODAS, ...new Set(state.jogos.map((j) => j.categoria).filter(Boolean))];
      selectEl.innerHTML = state.categorias.map((c) => `<option value="${c}">${c}</option>`).join('');
      sacolasDeJogos.clear();
      renderLista();
      goTo('screen-lista');
    } else {
      alert('Não consegui excluir agora. Tenta de novo em alguns segundos.');
    }
  } catch (err) {
    alert('Não consegui excluir agora — confere sua internet e tenta de novo.');
  } finally {
    btnExcluirEl.disabled = false;
  }
}

/* ---------- Rodapé: carrossel infinito (metade duplicada p/ loop sem emenda) ---------- */
/* Cada cartinha é clicável: "voa" até o centro, gira, e abre um jogo aleatório
   de TODAS as categorias — um easter egg sem função prática, só para dar vontade
   de clicar (por isso o balanço com frequência baixa em cada carta). */

const footerTrackEl = document.getElementById('footer-track');
let footerFlightBusy = false;

function buildFooter() {
  const half = 10;
  footerTrackEl.innerHTML = Array.from({ length: half * 2 }, (_, i) => {
    const delay = ((i * 37) % 97) / 10; // atraso pseudo-aleatório por carta, em segundos
    return `<button class="footer-card" type="button" aria-label="Sortear um jogo surpresa" style="--hop-delay:-${delay}s"><img src="assets/img/carta-rodape.svg" alt=""></button>`;
  }).join('');
}

footerTrackEl.addEventListener('click', (e) => {
  const card = e.target.closest('.footer-card');
  if (card) abrirCartaSurpresa(card);
});

function abrirCartaSurpresa(cardEl) {
  if (footerFlightBusy || !state.jogos.length) return;
  footerFlightBusy = true;

  // sorteia agora (de todas as categorias), pra já ter o conteúdo pronto quando a carta virar
  sortearJogo(TODAS);

  const startRect = cardEl.getBoundingClientRect();

  // mede onde a carta do jogo vai parar sem mostrar a troca de tela ainda
  const jogoScreen = document.getElementById('screen-jogo');
  const wasActive = activeScreen;
  jogoScreen.style.visibility = 'hidden';
  jogoScreen.classList.add('is-active');
  const endRect = jogoScreen.querySelector('.ticket-card').getBoundingClientRect();
  jogoScreen.classList.remove('is-active');
  jogoScreen.style.visibility = '';
  if (wasActive !== jogoScreen) wasActive.classList.add('is-active');

  footerTrackEl.classList.add('is-paused');

  const flight = document.createElement('img');
  flight.src = 'assets/img/carta-rodape.svg';
  flight.className = 'footer-flight';
  flight.style.left = startRect.left + 'px';
  flight.style.top = startRect.top + 'px';
  flight.style.width = startRect.width + 'px';
  flight.style.height = startRect.height + 'px';
  document.body.appendChild(flight);

  const dx = (endRect.left + endRect.width / 2) - (startRect.left + startRect.width / 2);
  const dy = (endRect.top + endRect.height / 2) - (startRect.top + startRect.height / 2);
  const sx = endRect.width / startRect.width;
  const sy = endRect.height / startRect.height;

  const anim = flight.animate([
    { transform: 'translate(0px,0px) scale(1,1) rotateY(0deg)', offset: 0 },
    { transform: `translate(${dx * .55}px, ${(dy * .55) - startRect.height * .25}px) scale(${1 + (sx - 1) * .55}, ${1 + (sy - 1) * .55}) rotateY(80deg)`, offset: .55 },
    { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy}) rotateY(90deg)`, offset: 1 },
  ], { duration: 560, easing: 'cubic-bezier(.3,0,.15,1)' });

  let landed = false;
  const pousar = () => {
    if (landed) return;
    landed = true;
    flight.remove();
    footerTrackEl.classList.remove('is-paused');

    // a carta voadora já girou até de perfil (90°) — a tela de jogo só completa o giro
    flipTimers.forEach(clearTimeout);
    flipTimers = [];
    wasActive.classList.remove('is-active', 'is-flip-out', 'is-flip-in');
    jogoScreen.classList.add('is-active', 'is-flip-in');
    activeScreen = jogoScreen;
    flipTimers.push(setTimeout(() => jogoScreen.classList.remove('is-flip-in'), IN_MS));

    footerFlightBusy = false;
  };
  // reforço: se a aba estiver em segundo plano (rAF pausado), garante o pouso mesmo assim
  anim.onfinish = pousar;
  setTimeout(pousar, 900);
}

/* ---------- Boot ---------- */

async function boot() {
  buildFooter();

  const [jogos, aleatorio] = await Promise.all([
    fetchCSV('data/jogos.csv'),
    fetchCSV('data/aleatoriedades.csv'),
  ]);

  // "visivel=não" é exclusão lógica (feita pelo formulário de admin) — nunca aparece no app
  state.jogos = jogos.filter((j) => j.visivel !== 'não');
  state.categorias = [TODAS, ...new Set(state.jogos.map((j) => j.categoria).filter(Boolean))];
  state.personagens = aleatorio.map((r) => r.Personagem).filter(Boolean);
  state.locais = aleatorio.map((r) => r.Localizacao).filter(Boolean);
  state.filmes = aleatorio.map((r) => r['Filme / Livro']).filter(Boolean);
  state.adjetivos = aleatorio.map((r) => r['Adjetivo / Característica']).filter(Boolean);

  selectEl.innerHTML = state.categorias.map((c) => `<option value="${c}">${c}</option>`).join('');
  renderCategoria();
  renderLista();
}

boot();
