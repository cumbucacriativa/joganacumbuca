<?php if ( ! defined( 'ABSPATH' ) ) exit; 
$assets = JNC_URL . 'public/assets/';
?>

<div class="jnc-view">
    <div class="jnc-view__header">
        <div>
            <h1 class="jnc-view__title">Aleatoriedades & Frases</h1>
            <p class="jnc-view__sub">Gerencie as opções de sugestões aleatórias sorteadas durante os jogos.</p>
        </div>
    </div>

    <!-- Navegação de Sub-abas -->
    <div class="jnc-subtabs">
        <button class="jnc-subtab is-active" data-type="frases">Frases (<span id="cntFrases">0</span>)</button>
        <button class="jnc-subtab" data-type="personagens">Personagens (<span id="cntPersonagens">0</span>)</button>
        <button class="jnc-subtab" data-type="locais">Locais (<span id="cntLocais">0</span>)</button>
        <button class="jnc-subtab" data-type="filmes">Filmes / Livros (<span id="cntFilmes">0</span>)</button>
        <button class="jnc-subtab" data-type="adjetivos">Adjetivos (<span id="cntAdjetivos">0</span>)</button>
    </div>

    <!-- Form de adição rápida -->
    <div class="jnc-card jnc-prompt-add-card">
        <form id="jncFormAddPrompt" class="jnc-prompt-form">
            <input type="hidden" id="promptType" value="frases">
            <input type="text" id="promptText" class="jnc-input" placeholder="Digite uma nova frase ou item..." required>
            <button type="submit" class="jnc-btn jnc-btn--primary">+ Adicionar</button>
        </form>
    </div>

    <!-- Busca de Prompts -->
    <div class="jnc-toolbar">
        <div class="jnc-search">
            <img class="jnc-search__icon" src="<?php echo esc_url( $assets . 'lupa.svg' ); ?>" width="16" height="16" alt="">
            <input type="text" id="jncSearchPrompt" class="jnc-input" placeholder="Filtrar itens exibidos...">
        </div>
    </div>

    <!-- Lista de Itens -->
    <div class="jnc-prompts-list" id="jncPromptsList">
        <div class="jnc-empty-state">Carregando itens...</div>
    </div>
</div>
