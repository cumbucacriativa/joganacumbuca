<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class JNC_Shortcode {

    public function __construct() {
        add_shortcode( 'joga_na_cumbuca', array( $this, 'render_shortcode' ) );
    }

    public function render_shortcode() {
        // Carrega CSS e JS do app no frontend
        wp_enqueue_style( 'jnc-app-style', JNC_URL . 'public/css/style.css', array(), JNC_VERSION );
        wp_enqueue_script( 'jnc-app-js', JNC_URL . 'public/js/app.js', array(), JNC_VERSION, true );

        // Injeta os dados do banco WP direto no JS (0ms de carregamento inicial)
        $jogos = JNC_CPT::get_all_games( true );
        $prompts = JNC_CPT::get_all_prompts();

        wp_localize_script( 'jnc-app-js', 'JNC_WP_DATA', array(
            'rest_url' => rest_url( 'jnc/v1/' ),
            'jogos'    => $jogos,
            'prompts'  => $prompts,
            'nonce'    => wp_create_nonce( 'wp_rest' ),
        ) );

        ob_start();
        ?>
        <div id="jnc-app-root">
            <!-- App estático mobile-first renderizado via public/js/app.js -->
            <div class="screen" id="screen">
                <div class="topbar">
                    <img class="logo" src="<?php echo esc_url( JNC_URL . 'public/assets/logo-completo.svg' ); ?>" alt="Joga na Cumbuca">
                </div>
                
                <div class="cat-pill" id="catPill">
                    <span class="cat-pill__text" id="catLabel">Carregando jogos...</span>
                </div>

                <div class="deck" id="deck"></div>

                <div class="options-drawer" id="optionsDrawer">
                    <div class="drawer-handle" id="drawerHandle">
                        <span class="handle-bar"></span>
                        <span class="handle-text">OPÇÕES</span>
                    </div>

                    <div class="drawer-content">
                        <div class="section-title">SUGESTÕES ALEATÓRIAS</div>

                        <div class="option-row">
                            <span class="option-label">Personagem:</span>
                            <span class="option-val" id="valPersonagem">-</span>
                        </div>
                        <div class="option-row">
                            <span class="option-label">Local:</span>
                            <span class="option-val" id="valLocal">-</span>
                        </div>
                        <div class="option-row">
                            <span class="option-label">Filme/Livro:</span>
                            <span class="option-val" id="valFilme">-</span>
                        </div>
                        <div class="option-row">
                            <span class="option-label">Adjetivo:</span>
                            <span class="option-val" id="valAdjetivo">-</span>
                        </div>
                        <div class="option-row">
                            <span class="option-label">Frase:</span>
                            <span class="option-val" id="valFrase">-</span>
                        </div>

                        <button class="btn-trocar-tudo" id="btnTrocarTudo">
                            <span>Sorteie opções</span>
                        </button>

                        <div class="drawer-footer">
                            <a class="footer-link" id="btnVerRegras" href="#">Ver Regras Completa</a>
                            <a class="footer-link" id="btnMinhaCumbuca" href="#">Minha Cumbuca (<span id="countMinhaCumbuca">0</span>)</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
