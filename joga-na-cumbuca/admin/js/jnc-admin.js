(function($) {
  'use strict';

  const DATA = window.JNC_ADMIN_DATA || {};
  let games = DATA.jogos || [];
  let prompts = DATA.prompts || { personagens: [], locais: [], filmes: [], adjetivos: [], frases: [] };
  let currentSubTab = 'frases';

  $(document).ready(function() {
    initGamesView();
    initPromptsView();
    initImportView();
  });

  /* ─────────────── GESTÃO DE JOGOS ─────────────── */

  function initGamesView() {
    if (!$('#jncGamesGrid').length) return;

    populateCategories();
    renderGames();

    // Filtros e Busca
    $('#jncSearchGame, #jncFilterCategory').on('input change', function() {
      renderGames();
    });

    // Abrir Modal de Novo Jogo
    $('#jncBtnNewGame').on('click', function() {
      openGameModal();
    });

    // Fechar Modal
    $('#jncModalClose, #jncBtnCancelGame').on('click', function() {
      closeGameModal();
    });

    // Submit do Form de Jogo
    $('#jncFormGame').on('submit', function(e) {
      e.preventDefault();
      saveGame();
    });
  }

  function populateCategories() {
    const cats = [...new Set(games.map(g => g.categoria).filter(Boolean))];
    const $select = $('#jncFilterCategory');
    $select.find('option:gt(1)').remove();
    cats.forEach(c => {
      $select.append(`<option value="${c}">${c}</option>`);
    });
  }

  function renderGames() {
    const $grid = $('#jncGamesGrid');
    const search = ($('#jncSearchGame').val() || '').toLowerCase();
    const cat = $('#jncFilterCategory').val();

    let filtered = games.filter(g => {
      const matchSearch = (g.jogo || '').toLowerCase().includes(search) || (g.descricao || '').toLowerCase().includes(search);
      let matchCat = true;
      if (cat === 'Aquecimento') {
        matchCat = (g.aquecimento === 'sim');
      } else if (cat) {
        matchCat = (g.categoria === cat);
      }
      return matchSearch && matchCat;
    });

    if (!filtered.length) {
      $grid.html('<div class="jnc-empty-state">Nenhum jogo encontrado com os filtros aplicados.</div>');
      return;
    }

    let html = '';
    filtered.forEach(g => {
      const isVisible = g.visivel !== '0';
      html += `
        <div class="jnc-game-card" data-id="${g.id}">
          <div class="jnc-game-card__header">
            <h3 class="jnc-game-card__title">${g.jogo}</h3>
            <span class="jnc-game-card__cat">${g.categoria}</span>
          </div>

          <div class="jnc-game-card__tags">
            <span class="jnc-tag">👥 ${g.participantes}</span>
            ${g.mediador === 'sim' ? '<span class="jnc-tag">🎤 Mediador</span>' : ''}
            ${g.aquecimento === 'sim' ? '<span class="jnc-tag jnc-tag--accent">⚡ Aquecimento</span>' : ''}
            ${g.musica === 'sim' ? '<span class="jnc-tag">🎵 Música</span>' : ''}
          </div>

          <div class="jnc-game-card__desc">${g.descricao}</div>

          <div class="jnc-game-card__actions">
            <div>
              <button class="jnc-btn jnc-btn--sm ${isVisible ? 'jnc-btn--secondary' : 'jnc-btn--danger'} btn-toggle-vis" data-id="${g.id}">
                ${isVisible ? '👁️ Visível' : '🙈 Oculto'}
              </button>
            </div>
            <div style="display:flex; gap:6px;">
              <button class="jnc-btn jnc-btn--sm jnc-btn--secondary btn-edit-game" data-id="${g.id}">✏️ Editar</button>
              <button class="jnc-btn jnc-btn--sm jnc-btn--danger btn-delete-game" data-id="${g.id}">🗑️</button>
            </div>
          </div>
        </div>
      `;
    });

    $grid.html(html);

    // Wire-up dos botões
    $('.btn-edit-game').on('click', function() {
      const id = $(this).data('id');
      const game = games.find(g => String(g.id) === String(id));
      if (game) openGameModal(game);
    });

    $('.btn-delete-game').on('click', function() {
      const id = $(this).data('id');
      deleteGame(id);
    });

    $('.btn-toggle-vis').on('click', function() {
      const id = $(this).data('id');
      const game = games.find(g => String(g.id) === String(id));
      if (game) {
        game.visivel = (game.visivel === '0') ? '1' : '0';
        saveGameData(game);
      }
    });
  }

  function openGameModal(game) {
    if (game) {
      $('#jncModalTitle').text('Editar Jogo');
      $('#gameId').val(game.id);
      $('#gameName').val(game.jogo);
      $('#gameCategory').val(game.categoria);
      $('#gameParticipants').val(game.participantes);
      $('#gameMediador').prop('checked', game.mediador === 'sim');
      $('#gameAquecimento').prop('checked', game.aquecimento === 'sim');
      $('#gameMusica').prop('checked', game.musica === 'sim');
      $('#gameVisivel').prop('checked', game.visivel !== '0');
      $('#gameDescription').val(game.descricao);
    } else {
      $('#jncModalTitle').text('Novo Jogo');
      $('#gameId').val('');
      $('#jncFormGame')[0].reset();
      $('#gameVisivel').prop('checked', true);
    }
    $('#jncModalGame').fadeIn(200);
  }

  function closeGameModal() {
    $('#jncModalGame').fadeOut(200);
  }

  function saveGame() {
    const gameData = {
      id: $('#gameId').val(),
      jogo: $('#gameName').val(),
      categoria: $('#gameCategory').val(),
      participantes: $('#gameParticipants').val(),
      mediador: $('#gameMediador').is(':checked') ? 'sim' : 'não',
      aquecimento: $('#gameAquecimento').is(':checked') ? 'sim' : 'não',
      musica: $('#gameMusica').is(':checked') ? 'sim' : 'não',
      visivel: $('#gameVisivel').is(':checked') ? '1' : '0',
      descricao: $('#gameDescription').val(),
    };

    saveGameData(gameData, function() {
      closeGameModal();
    });
  }

  function saveGameData(gameData, callback) {
    $.ajax({
      url: DATA.rest_url + 'jogos',
      method: 'POST',
      headers: { 'X-WP-Nonce': DATA.nonce },
      data: gameData,
      success: function(res) {
        if (res.status === 'success') {
          if (gameData.id) {
            const idx = games.findIndex(g => String(g.id) === String(gameData.id));
            if (idx !== -1) games[idx] = { ...games[idx], ...gameData };
          } else {
            gameData.id = res.id;
            games.unshift(gameData);
          }
          populateCategories();
          renderGames();
          if (callback) callback();
        }
      },
      error: function(err) {
        alert('Erro ao salvar jogo: ' + (err.responseJSON ? err.responseJSON.message : 'Falha na requisição'));
      }
    });
  }

  function deleteGame(id) {
    if (!confirm('Tem certeza que deseja excluir este jogo?')) return;
    $.ajax({
      url: DATA.rest_url + 'jogos/' + id,
      method: 'DELETE',
      headers: { 'X-WP-Nonce': DATA.nonce },
      success: function(res) {
        games = games.filter(g => String(g.id) !== String(id));
        populateCategories();
        renderGames();
      },
      error: function(err) {
        alert('Erro ao excluir jogo');
      }
    });
  }

  /* ─────────────── GESTÃO DE ALEATORIEDADES ─────────────── */

  function initPromptsView() {
    if (!$('#jncPromptsList').length) return;

    updateCounts();
    renderPrompts();

    // Troca de Sub-aba
    $('.jnc-subtab').on('click', function() {
      $('.jnc-subtab').removeClass('is-active');
      $(this).addClass('is-active');
      currentSubTab = $(this).data('type');
      $('#promptType').val(currentSubTab);
      renderPrompts();
    });

    // Submit de Novo Prompt
    $('#jncFormAddPrompt').on('submit', function(e) {
      e.preventDefault();
      savePrompt();
    });

    // Busca de Prompts
    $('#jncSearchPrompt').on('input', function() {
      renderPrompts();
    });
  }

  function updateCounts() {
    $('#cntFrases').text((prompts.frases || []).length);
    $('#cntPersonagens').text((prompts.personagens || []).length);
    $('#cntLocais').text((prompts.locais || []).length);
    $('#cntFilmes').text((prompts.filmes || []).length);
    $('#cntAdjetivos').text((prompts.adjetivos || []).length);
  }

  function renderPrompts() {
    const $list = $('#jncPromptsList');
    const search = ($('#jncSearchPrompt').val() || '').toLowerCase();
    const items = prompts[currentSubTab] || [];

    const filtered = items.filter(i => (i.text || '').toLowerCase().includes(search));

    if (!filtered.length) {
      $list.html('<div class="jnc-empty-state">Nenhum item nesta categoria.</div>');
      return;
    }

    let html = '';
    filtered.forEach(item => {
      html += `
        <div class="jnc-prompt-item" data-id="${item.id}">
          <span class="jnc-prompt-item__text">${item.text}</span>
          <button class="jnc-btn jnc-btn--sm jnc-btn--danger btn-delete-prompt" data-id="${item.id}">🗑️</button>
        </div>
      `;
    });

    $list.html(html);

    $('.btn-delete-prompt').on('click', function() {
      const id = $(this).data('id');
      deletePrompt(id);
    });
  }

  function savePrompt() {
    const text = $('#promptText').val().trim();
    const typeMap = {
      frases: 'frase',
      personagens: 'personagem',
      locais: 'localizacao',
      filmes: 'filme',
      adjetivos: 'adjetivo'
    };
    const type = typeMap[currentSubTab] || 'frase';

    if (!text) return;

    $.ajax({
      url: DATA.rest_url + 'aleatoriedades',
      method: 'POST',
      headers: { 'X-WP-Nonce': DATA.nonce },
      data: { text: text, type: type },
      success: function(res) {
        if (res.status === 'success') {
          const newItem = { id: res.id, text: text, type: type };
          if (!prompts[currentSubTab]) prompts[currentSubTab] = [];
          prompts[currentSubTab].unshift(newItem);
          $('#promptText').val('');
          updateCounts();
          renderPrompts();
        }
      },
      error: function(err) {
        alert('Erro ao salvar item');
      }
    });
  }

  function deletePrompt(id) {
    if (!confirm('Tem certeza que deseja excluir este item?')) return;
    $.ajax({
      url: DATA.rest_url + 'aleatoriedades/' + id,
      method: 'DELETE',
      headers: { 'X-WP-Nonce': DATA.nonce },
      success: function(res) {
        if (prompts[currentSubTab]) {
          prompts[currentSubTab] = prompts[currentSubTab].filter(i => String(i.id) !== String(id));
        }
        updateCounts();
        renderPrompts();
      },
      error: function(err) {
        alert('Erro ao excluir item');
      }
    });
  }

  /* ─────────────── IMPORTADOR DE CSV ─────────────── */

  function initImportView() {
    $('#jncBtnStartImport').on('click', function() {
      const $btn = $(this);
      const $res = $('#jncImportResult');

      $btn.prop('disabled', true).text('⏳ Sincronizando CSVs...');
      $res.hide();

      $.ajax({
        url: DATA.ajax_url,
        method: 'POST',
        data: {
          action: 'jnc_run_import',
          nonce: DATA.nonce
        },
        success: function(res) {
          $btn.prop('disabled', false).text('🚀 Sincronizar CSVs para o WordPress Agora');
          if (res.success) {
            $res.removeClass('is-error').addClass('is-success').html('✅ ' + res.data.message).slideDown();
          } else {
            $res.removeClass('is-success').addClass('is-error').html('❌ ' + (res.data.message || 'Erro ao importar')).slideDown();
          }
        },
        error: function() {
          $btn.prop('disabled', false).text('🚀 Sincronizar CSVs para o WordPress Agora');
          $res.removeClass('is-success').addClass('is-error').html('❌ Erro na requisição AJAX').slideDown();
        }
      });
    });
  }

})(jQuery);
