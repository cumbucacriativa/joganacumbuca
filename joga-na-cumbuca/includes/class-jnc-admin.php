<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class JNC_Admin {

    public function __construct() {
        add_action( 'admin_menu', array( $this, 'register_menu' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );

        // Zero Visual WP: Esconder avisos nativos do WordPress nas telas do plugin
        add_action( 'admin_head', function () {
            $screen = get_current_screen();
            if ( ! $screen || strpos( $screen->id, 'joga-na-cumbuca' ) === false ) return;

            remove_all_actions( 'admin_notices' );
            remove_all_actions( 'all_admin_notices' );
            remove_all_actions( 'network_admin_notices' );
        } );
    }

    public function register_menu() {
        // Posição 51 no bloco reservado para plugins da casa
        $icon_svg = 'data:image/svg+xml;base64,' . base64_encode( '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="4" fill="#00FFAA" stroke="#23302D" stroke-width="2"/><circle cx="8.5" cy="8.5" r="1.5" fill="#23302D"/><circle cx="15.5" cy="15.5" r="1.5" fill="#23302D"/><circle cx="12" cy="12" r="1.5" fill="#23302D"/></svg>' );

        add_menu_page(
            'Joga na Cumbuca',
            'Joga na Cumbuca',
            'manage_options',
            'joga-na-cumbuca',
            array( $this, 'render_admin_page' ),
            $icon_svg,
            51
        );
    }

    public function enqueue_assets( $hook ) {
        if ( strpos( $hook, 'joga-na-cumbuca' ) === false ) return;

        wp_enqueue_style( 'jnc-admin-style', JNC_URL . 'admin/css/jnc-admin.css', array(), JNC_VERSION );
        wp_enqueue_script( 'jnc-admin-js', JNC_URL . 'admin/js/jnc-admin.js', array( 'jquery' ), JNC_VERSION, true );

        $jogos = JNC_CPT::get_all_games( false );
        $prompts = JNC_CPT::get_all_prompts();

        wp_localize_script( 'jnc-admin-js', 'JNC_ADMIN_DATA', array(
            'ajax_url'  => admin_url( 'admin-ajax.php' ),
            'rest_url'  => rest_url( 'jnc/v1/' ),
            'assets_url' => JNC_URL . 'public/assets/',
            'nonce'     => wp_create_nonce( 'wp_rest' ),
            'jogos'     => $jogos,
            'prompts'   => $prompts,
            'api_key'   => get_option( 'jnc_api_key', '' ),
        ) );
    }

    public function render_admin_page() {
        $tab = isset( $_GET['tab'] ) ? sanitize_text_field( $_GET['tab'] ) : 'games';
        $assets = JNC_URL . 'public/assets/';
        ?>
        <div class="jnc-app">
            <header class="jnc-topbar">
                <div class="jnc-topbar__brand">
                    <img class="jnc-topbar__logo" src="<?php echo esc_url( $assets . 'dado.svg' ); ?>" width="24" height="24" alt="Icone">
                    <span class="jnc-topbar__title">Joga na Cumbuca</span>
                    <span class="jnc-topbar__badge">v<?php echo esc_html( JNC_VERSION ); ?></span>
                </div>

                <nav class="jnc-nav">
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=joga-na-cumbuca&tab=games' ) ); ?>" class="jnc-nav__item <?php echo $tab === 'games' ? 'is-active' : ''; ?>">
                        <img src="<?php echo esc_url( $assets . 'dado.svg' ); ?>" width="16" height="16" alt="" class="jnc-icon"> Jogos de Improviso
                    </a>
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=joga-na-cumbuca&tab=prompts' ) ); ?>" class="jnc-nav__item <?php echo $tab === 'prompts' ? 'is-active' : ''; ?>">
                        <img src="<?php echo esc_url( $assets . 'mais.svg' ); ?>" width="16" height="16" alt="" class="jnc-icon"> Aleatoriedades & Frases
                    </a>
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=joga-na-cumbuca&tab=import' ) ); ?>" class="jnc-nav__item <?php echo $tab === 'import' ? 'is-active' : ''; ?>">
                        <img src="<?php echo esc_url( $assets . 'seta-baixo.svg' ); ?>" width="16" height="16" alt="" class="jnc-icon"> Importar CSV
                    </a>
                    <a href="<?php echo esc_url( admin_url( 'admin.php?page=joga-na-cumbuca&tab=settings' ) ); ?>" class="jnc-nav__item <?php echo $tab === 'settings' ? 'is-active' : ''; ?>">
                        <img src="<?php echo esc_url( $assets . 'casa-mais.svg' ); ?>" width="16" height="16" alt="" class="jnc-icon"> Configurações & API
                    </a>
                </nav>
            </header>

            <main class="jnc-content">
                <?php
                switch ( $tab ) {
                    case 'prompts':
                        include JNC_PATH . 'admin/views/prompts.php';
                        break;
                    case 'import':
                        include JNC_PATH . 'admin/views/import.php';
                        break;
                    case 'settings':
                        include JNC_PATH . 'admin/views/settings.php';
                        break;
                    case 'games':
                    default:
                        include JNC_PATH . 'admin/views/games.php';
                        break;
                }
                ?>
            </main>
        </div>
        <?php
    }
}
