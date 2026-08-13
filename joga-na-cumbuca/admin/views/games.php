<?php if ( ! defined( 'ABSPATH' ) ) exit; 
$assets = JNC_URL . 'public/assets/';
?>

<div class="jnc-view">
    <div class="jnc-view__header">
        <div>
            <h1 class="jnc-view__title">Jogos de Improviso</h1>
            <p class="jnc-view__sub">Gerencie todos os jogos cadastrados no banco do WordPress.</p>
        </div>
        <button class="jnc-btn jnc-btn--primary" id="jncBtnNewGame">
            <img src="<?php echo esc_url( $assets . 'mais.svg' ); ?>" width="16" height="16" alt=""> Novo Jogo
        </button>
    </div>

    <!-- Barra de busca e filtros -->
    <div class="jnc-toolbar">
        <div class="jnc-search">
            <img class="jnc-search__icon" src="<?php echo esc_url( $assets . 'lupa.svg' ); ?>" width="16" height="16" alt="">
            <input type="text" id="jncSearchGame" class="jnc-input" placeholder="Buscar jogo por nome ou descrição...">
        </div>
        <select id="jncFilterCategory" class="jnc-select">
            <option value="">Todas as Categorias</option>
            <option value="Aquecimento">Aquecimento</option>
            <option value="Duplas">Duplas</option>
            <option value="Grupos">Grupos</option>
            <option value="Plateia">Plateia</option>
            <option value="Todos">Todos</option>
            <option value="Geral">Geral</option>
        </select>
    </div>

    <!-- Lista de Jogos (Grid/Cards) -->
    <div class="jnc-games-grid" id="jncGamesGrid">
        <div class="jnc-empty-state">Carregando jogos...</div>
    </div>
</div>

<!-- Modal Adicionar / Editar Jogo -->
<div class="jnc-modal-overlay" id="jncModalGame" style="display:none;">
    <div class="jnc-modal">
        <header class="jnc-modal__header">
            <h2 class="jnc-modal__title" id="jncModalTitle">Novo Jogo</h2>
            <button class="jnc-modal__close" id="jncModalClose">&times;</button>
        </header>

        <form id="jncFormGame" class="jnc-form">
            <input type="hidden" id="gameId" value="">

            <div class="jnc-form-group">
                <label for="gameName" class="jnc-label">Nome do Jogo *</label>
                <input type="text" id="gameName" class="jnc-input" placeholder="Ex: Congela" required>
            </div>

            <div class="jnc-form-row">
                <div class="jnc-form-group">
                    <label for="gameCategory" class="jnc-label">Categoria *</label>
                    <select id="gameCategory" class="jnc-select" required>
                        <option value="Duplas">Duplas</option>
                        <option value="Grupos">Grupos</option>
                        <option value="Plateia">Plateia</option>
                        <option value="Todos">Todos</option>
                        <option value="Geral">Geral</option>
                    </select>
                </div>
                <div class="jnc-form-group">
                    <label for="gameParticipants" class="jnc-label">Participantes *</label>
                    <input type="text" id="gameParticipants" class="jnc-input" placeholder="Ex: 2+, Todos" required>
                </div>
            </div>

            <div class="jnc-form-group">
                <label class="jnc-label">Flags / Características</label>
                <div class="jnc-checkbox-group">
                    <label class="jnc-checkbox"><input type="checkbox" id="gameMediador"> Precisa de Mediador?</label>
                    <label class="jnc-checkbox"><input type="checkbox" id="gameAquecimento"> É Aquecimento?</label>
                    <label class="jnc-checkbox"><input type="checkbox" id="gameMusica"> Tem Música?</label>
                    <label class="jnc-checkbox"><input type="checkbox" id="gameVisivel" checked> Visível no App?</label>
                </div>
            </div>

            <div class="jnc-form-group">
                <label for="gameDescription" class="jnc-label">Descrição / Regras do Jogo *</label>
                <textarea id="gameDescription" class="jnc-textarea" rows="5" placeholder="Explique como o jogo funciona..." required></textarea>
            </div>

            <footer class="jnc-modal__footer">
                <button type="button" class="jnc-btn jnc-btn--secondary" id="jncBtnCancelGame">Cancelar</button>
                <button type="submit" class="jnc-btn jnc-btn--primary">Salvar Jogo</button>
            </footer>
        </form>
    </div>
</div>
