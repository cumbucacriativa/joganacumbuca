<?php
/**
 * Plugin Name: Joga na Cumbuca
 * Plugin URI:  https://cumbucacriativa.gt.tc/joganacumbuca/
 * Description: Gerenciador de cartas aleatórias e jogos de improviso teatral da Cumbuca Criativa.
 * Version:     1.0.0
 * Author:      Cumbuca Criativa & Lava MKT
 * Text Domain: joga-na-cumbuca
 * Requires at least: 5.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) exit;

if ( defined( 'JNC_VERSION' ) ) return;

define( 'JNC_VERSION', '1.0.0' );
define( 'JNC_PATH', plugin_dir_path( __FILE__ ) );
define( 'JNC_URL', plugin_dir_url( __FILE__ ) );

// Suprimir avisos nativos do WP no painel do plugin (Zero Visual WP)
add_action( 'script_loader_tag', function ( $tag, $handle ) {
    if ( strpos( $handle, 'jnc-' ) === 0 && strpos( $tag, 'data-no-optimize' ) === false ) {
        $tag = str_replace( ' src=', ' data-no-optimize="1" src=', $tag );
    }
    return $tag;
}, 10, 2 );

add_filter( 'style_loader_tag', function ( $tag, $handle ) {
    if ( strpos( $handle, 'jnc-' ) === 0 && strpos( $tag, 'data-no-optimize' ) === false ) {
        $tag = str_replace( ' href=', ' data-no-optimize="1" href=', $tag );
    }
    return $tag;
}, 10, 2 );

require_once JNC_PATH . 'includes/class-jnc-cpt.php';
require_once JNC_PATH . 'includes/class-jnc-api.php';
require_once JNC_PATH . 'includes/class-jnc-admin.php';
require_once JNC_PATH . 'includes/class-jnc-importer.php';
require_once JNC_PATH . 'includes/class-jnc-shortcode.php';

add_action( 'plugins_loaded', function () {
    new JNC_CPT();
    new JNC_API();
    new JNC_Admin();
    new JNC_Importer();
    new JNC_Shortcode();
} );

register_activation_hook( __FILE__, function () {
    JNC_CPT::register();
    flush_rewrite_rules();
    
    // Auto-importar CSVs se o banco estiver vazio na ativação
    JNC_Importer::auto_import_if_empty();
} );

register_deactivation_hook( __FILE__, function () {
    flush_rewrite_rules();
} );
