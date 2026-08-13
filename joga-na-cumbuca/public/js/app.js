(function() {
  'use strict';

  const wpData = window.JNC_WP_DATA || {};
  let games = wpData.jogos || [];
  let prompts = wpData.prompts || { personagens: [], locais: [], filmes: [], adjetivos: [], frases: [] };

  const state = {
    jogos: games,
    catIndex: 0,
    jogoAtual: null,
    contexto: 'Todas as Categorias',
    categorias: ['Todas as Categorias', 'Aquecimento'],
    personagens: [],
    locais: [],
    filmes: [],
    adjetivos: [],
    frases: [],
  };

  document.addEventListener('DOMContentLoaded', function() {
    if (!state.jogos.length && wpData.rest_url) {
      fetchDataFromAPI();
    } else {
      initApp();
    }
  });

  function fetchDataFromAPI() {
    Promise.all([
      fetch(wpData.rest_url + 'jogos').then(r => r.json()),
      fetch(wpData.rest_url + 'aleatoriedades').then(r => r.json())
    ]).then(([jRes, pRes]) => {
      if (jRes.jogos) state.jogos = jRes.jogos;
      if (pRes.prompts) prompts = pRes.prompts;
      initApp();
    }).catch(err => {
      console.error('Erro ao carregar dados do Joga na Cumbuca:', err);
    });
  }

  function initApp() {
    setupCategories();
    setupPrompts();
    initUIEvents();
    renderCategoria();
  }

  function setupCategories() {
    const reais = [...new Set(state.jogos.map(j => j.categoria).filter(Boolean))];
    const temAquecimento = state.jogos.some(j => j.aquecimento === 'sim');
    state.categorias = ['Todas as Categorias', ...(temAquecimento ? ['Aquecimento'] : []), ...reais];

    const selectEl = document.getElementById('category-select');
    if (selectEl) {
      selectEl.innerHTML = state.categorias.map(c => `<option value="${c}">${c}</option>`).join('');
    }
  }

  function setupPrompts() {
    state.personagens = (prompts.personagens || []).map(p => p.text);
    state.locais = (prompts.locais || []).map(p => p.text);
    state.filmes = (prompts.filmes || []).map(p => p.text);
    state.adjetivos = (prompts.adjetivos || []).map(p => p.text);
    state.frases = (prompts.frases || []).map(p => p.text);
  }

  function renderCategoria() {
    const catNameEl = document.getElementById('category-name');
    if (catNameEl) {
      catNameEl.textContent = state.categorias[state.catIndex] || 'Todas as Categorias';
    }
  }

  function sortearJogo(cat) {
    let lista = state.jogos;
    if (cat === 'Aquecimento') {
      lista = state.jogos.filter(j => j.aquecimento === 'sim');
    } else if (cat && cat !== 'Todas as Categorias') {
      lista = state.jogos.filter(j => j.categoria === cat);
    }

    if (!lista.length) lista = state.jogos;
    if (!lista.length) return;

    const idx = Math.floor(Math.random() * lista.length);
    state.jogoAtual = lista[idx];

    const titleEl = document.getElementById('game-title');
    const idEl = document.getElementById('game-id');
    const tagsEl = document.getElementById('game-tags');
    const descEl = document.getElementById('game-description');

    if (titleEl) titleEl.textContent = state.jogoAtual.jogo;
    if (idEl) idEl.textContent = '#' + state.jogoAtual.id;
    if (descEl) descEl.textContent = state.jogoAtual.descricao;

    if (tagsEl) {
      tagsEl.innerHTML = `
        <span class="tag"><img src="${wpData.url || ''}public/assets/tag-participantes.svg" alt=""> ${state.jogoAtual.participantes}</span>
        ${state.jogoAtual.mediador === 'sim' ? `<span class="tag"><img src="${wpData.url || ''}public/assets/tag-mediador.svg" alt=""> Mediador</span>` : ''}
        ${state.jogoAtual.aquecimento === 'sim' ? `<span class="tag"><img src="${wpData.url || ''}public/assets/tag-aquecimento.svg" alt=""> Aquecimento</span>` : ''}
        ${state.jogoAtual.musica === 'sim' ? `<span class="tag"><img src="${wpData.url || ''}public/assets/tag-musica.svg" alt=""> Música</span>` : ''}
      `;
    }
  }

  function sortearPrompt(tipo) {
    let list = [];
    if (tipo === 'personagem') list = state.personagens;
    else if (tipo === 'local') list = state.locais;
    else if (tipo === 'filme') list = state.filmes;
    else if (tipo === 'adjetivo') list = state.adjetivos;
    else if (tipo === 'frase') list = state.frases;

    if (!list.length) return '-';
    return list[Math.floor(Math.random() * list.length)];
  }

  function initUIEvents() {
    // Iniciar
    document.getElementById('btn-iniciar')?.addEventListener('click', () => switchScreen('screen-categoria'));

    // Categorias Nav
    document.getElementById('cat-up')?.addEventListener('click', () => {
      state.catIndex = (state.catIndex - 1 + state.categorias.length) % state.categorias.length;
      renderCategoria();
    });
    document.getElementById('cat-down')?.addEventListener('click', () => {
      state.catIndex = (state.catIndex + 1) % state.categorias.length;
      renderCategoria();
    });

    document.getElementById('btn-sortear')?.addEventListener('click', () => {
      sortearJogo(state.categorias[state.catIndex]);
      switchScreen('screen-jogo');
    });

    document.getElementById('btn-lista')?.addEventListener('click', () => {
      renderLista();
      switchScreen('screen-lista');
    });

    document.getElementById('btn-resortear')?.addEventListener('click', () => {
      sortearJogo(state.categorias[state.catIndex]);
    });

    // Excluir Jogo via REST API do WordPress
    document.getElementById('btn-excluir-jogo')?.addEventListener('click', () => {
      if (!state.jogoAtual) return;
      if (!confirm('Deseja excluir o jogo "' + state.jogoAtual.jogo + '" do banco do WordPress?')) return;

      fetch(wpData.rest_url + 'jogos/' + state.jogoAtual.id, {
        method: 'DELETE',
        headers: { 'X-WP-Nonce': wpData.nonce }
      }).then(r => r.json()).then(res => {
        if (res.status === 'success') {
          alert('Jogo excluído com sucesso!');
          state.jogos = state.jogos.filter(j => String(j.id) !== String(state.jogoAtual.id));
          setupCategories();
          switchScreen('screen-categoria');
        } else {
          alert('Erro ao excluir jogo: ' + (res.message || 'Permissão negada'));
        }
      }).catch(() => alert('Erro de rede ao excluir jogo'));
    });

    // Drawer de opções / Dado
    const diceBadge = document.getElementById('dice-badge');
    const diceOverlay = document.getElementById('dice-overlay');
    const diceBackdrop = document.getElementById('dice-backdrop');
    const diceClose = document.getElementById('dice-overlay-close');

    const toggleDice = (open) => {
      if (open) {
        sortearTodasOpcoes();
        diceOverlay?.classList.add('is-open');
        diceBackdrop?.classList.add('is-open');
      } else {
        diceOverlay?.classList.remove('is-open');
        diceBackdrop?.classList.remove('is-open');
      }
    };

    diceBadge?.addEventListener('click', () => toggleDice(true));
    diceClose?.addEventListener('click', () => toggleDice(false));
    diceBackdrop?.addEventListener('click', () => toggleDice(false));

    document.getElementById('btn-sortear-tudo')?.addEventListener('click', sortearTodasOpcoes);
    document.getElementById('btn-local')?.addEventListener('click', () => updatePromptBtn('btn-local', 'local'));
    document.getElementById('btn-personagem')?.addEventListener('click', () => updatePromptBtn('btn-personagem', 'personagem'));
    document.getElementById('btn-filme')?.addEventListener('click', () => updatePromptBtn('btn-filme', 'filme'));
    document.getElementById('btn-adjetivo')?.addEventListener('click', () => updatePromptBtn('btn-adjetivo', 'adjetivo'));
    document.getElementById('btn-frase')?.addEventListener('click', () => updatePromptBtn('btn-frase', 'frase'));

    // Busca
    const searchBadge = document.getElementById('search-badge');
    const searchOverlay = document.getElementById('search-overlay');
    const searchClose = document.getElementById('search-overlay-close');
    const searchInput = document.getElementById('search-input');

    const toggleSearch = (open) => {
      if (open) {
        searchOverlay?.classList.add('is-open');
        searchInput?.focus();
      } else {
        searchOverlay?.classList.remove('is-open');
      }
    };

    searchBadge?.addEventListener('click', () => toggleSearch(true));
    searchClose?.addEventListener('click', () => toggleSearch(false));

    searchInput?.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });

    document.getElementById('btn-fechar-lista')?.addEventListener('click', () => switchScreen('screen-categoria'));
    document.getElementById('btn-aleatorio')?.addEventListener('click', () => {
      sortearJogo('Todas as Categorias');
      switchScreen('screen-jogo');
    });
  }

  function sortearTodasOpcoes() {
    updatePromptBtn('btn-local', 'local');
    updatePromptBtn('btn-personagem', 'personagem');
    updatePromptBtn('btn-filme', 'filme');
    updatePromptBtn('btn-adjetivo', 'adjetivo');
    updatePromptBtn('btn-frase', 'frase');
  }

  function updatePromptBtn(btnId, tipo) {
    const btn = document.getElementById(btnId);
    if (btn) btn.textContent = sortearPrompt(tipo);
  }

  function renderLista() {
    const listEl = document.getElementById('game-list');
    if (!listEl) return;
    listEl.innerHTML = state.jogos.map(g => `
      <li data-id="${g.id}">
        <span>${g.jogo}</span>
        <span class="game-list__icons">
          ${g.aquecimento === 'sim' ? '⚡' : ''}
          ${g.mediador === 'sim' ? '🎤' : ''}
          ${g.musica === 'sim' ? '🎵' : ''}
        </span>
      </li>
    `).join('');

    listEl.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        const id = li.getAttribute('data-id');
        const game = state.jogos.find(j => String(j.id) === String(id));
        if (game) {
          state.jogoAtual = game;
          const titleEl = document.getElementById('game-title');
          const idEl = document.getElementById('game-id');
          const descEl = document.getElementById('game-description');
          if (titleEl) titleEl.textContent = game.jogo;
          if (idEl) idEl.textContent = '#' + game.id;
          if (descEl) descEl.textContent = game.descricao;
          switchScreen('screen-jogo');
        }
      });
    });
  }

  function renderSearchResults(q) {
    const resEl = document.getElementById('search-results');
    if (!resEl) return;
    const query = (q || '').toLowerCase();
    if (!query) {
      resEl.innerHTML = '';
      return;
    }

    const filtered = state.jogos.filter(g =>
      (g.jogo || '').toLowerCase().includes(query) || (g.descricao || '').toLowerCase().includes(query)
    );

    if (!filtered.length) {
      resEl.innerHTML = '<li class="search-overlay__empty">Nenhum jogo encontrado.</li>';
      return;
    }

    resEl.innerHTML = filtered.map(g => `
      <li data-id="${g.id}">
        <span>${g.jogo} (${g.categoria})</span>
      </li>
    `).join('');

    resEl.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        const id = li.getAttribute('data-id');
        const game = state.jogos.find(j => String(j.id) === String(id));
        if (game) {
          state.jogoAtual = game;
          const titleEl = document.getElementById('game-title');
          const idEl = document.getElementById('game-id');
          const descEl = document.getElementById('game-description');
          if (titleEl) titleEl.textContent = game.jogo;
          if (idEl) idEl.textContent = '#' + game.id;
          if (descEl) descEl.textContent = game.descricao;
          document.getElementById('search-overlay')?.classList.remove('is-open');
          switchScreen('screen-jogo');
        }
      });
    });
  }

  function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('is-active'));
    document.getElementById(screenId)?.classList.add('is-active');
  }

})();
