<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class JNC_Importer {

    public function __construct() {
        add_action( 'wp_ajax_jnc_run_import', array( $this, 'ajax_run_import' ) );
    }

    public static function auto_import_if_empty() {
        $count_jogos = wp_count_posts( 'jnc_jogo' );
        if ( empty( $count_jogos->publish ) ) {
            self::import_jogos_csv();
            self::import_aleatoriedades_csv();
        }
    }

    public function ajax_run_import() {
        if ( ! wp_verify_nonce( $_REQUEST['nonce'] ?? '', 'wp_rest' ) && ! wp_verify_nonce( $_REQUEST['nonce'] ?? '', 'jnc_admin_nonce' ) ) {
            wp_send_json_error( array( 'message' => 'Verificação de segurança falhou.' ) );
        }
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_send_json_error( array( 'message' => 'Permissão negada.' ) );
        }

        $imported_jogos = self::import_jogos_csv();
        $imported_prompts = self::import_aleatoriedades_csv();

        wp_send_json_success( array(
            'message' => "Importação concluída! {$imported_jogos} jogos e {$imported_prompts} aleatoriedades sincronizados.",
            'jogos_count' => $imported_jogos,
            'prompts_count' => $imported_prompts,
        ) );
    }

    public static function import_jogos_csv() {
        // Busca o jogos.csv da pasta data/ do projeto ou bundled
        $paths = array(
            JNC_PATH . '../data/jogos.csv',
            JNC_PATH . 'data/jogos.csv',
            get_template_directory() . '/joganacumbuca/data/jogos.csv',
        );

        $csv_path = '';
        foreach ( $paths as $p ) {
            if ( file_exists( $p ) ) {
                $csv_path = $p;
                break;
            }
        }

        if ( ! $csv_path ) return 0;

        $content = file_get_contents( $csv_path );
        $rows = self::parse_csv_string( $content );
        if ( empty( $rows ) ) return 0;

        $count = 0;
        foreach ( $rows as $r ) {
            $nome = trim( $r['jogo'] ?? '' );
            if ( ! $nome ) continue;

            // Verificar se o jogo ja existe pelo nome
            $existing = get_page_by_title( $nome, OBJECT, 'jnc_jogo' );
            $post_data = array(
                'post_title'   => $nome,
                'post_content' => trim( $r['descricao'] ?? '' ),
                'post_type'    => 'jnc_jogo',
                'post_status'  => 'publish',
            );

            if ( $existing ) {
                $post_id = $existing->ID;
                $post_data['ID'] = $post_id;
                wp_update_post( $post_data );
            } else {
                $post_id = wp_insert_post( $post_data );
            }

            if ( $post_id && ! is_wp_error( $post_id ) ) {
                update_post_meta( $post_id, 'jnc_categoria', trim( $r['categoria'] ?? 'Geral' ) );
                update_post_meta( $post_id, 'jnc_participantes', trim( $r['participantes'] ?? '2+' ) );
                update_post_meta( $post_id, 'jnc_mediador', trim( strtolower( $r['mediador'] ?? 'não' ) ) );
                update_post_meta( $post_id, 'jnc_aquecimento', trim( strtolower( $r['aquecimento'] ?? 'não' ) ) );
                update_post_meta( $post_id, 'jnc_musica', trim( strtolower( $r['musica'] ?? 'não' ) ) );
                update_post_meta( $post_id, 'jnc_visivel', ( trim( $r['visivel'] ?? '1' ) !== '0' ) ? '1' : '0' );
                $count++;
            }
        }

        return $count;
    }

    public static function import_aleatoriedades_csv() {
        $paths = array(
            JNC_PATH . '../data/aleatoriedades.csv',
            JNC_PATH . 'data/aleatoriedades.csv',
        );

        $csv_path = '';
        foreach ( $paths as $p ) {
            if ( file_exists( $p ) ) {
                $csv_path = $p;
                break;
            }
        }

        if ( ! $csv_path ) return 0;

        $content = file_get_contents( $csv_path );
        $rows = self::parse_csv_string( $content );
        if ( empty( $rows ) ) return 0;

        $column_map = array(
            'Personagem'                 => 'personagem',
            'Localizacao'                => 'localizacao',
            'Filme / Livro'              => 'filme',
            'Adjetivo / Característica'  => 'adjetivo',
            'Frase'                      => 'frase',
        );

        $count = 0;
        foreach ( $rows as $r ) {
            foreach ( $column_map as $csv_col => $prompt_type ) {
                $val = trim( $r[ $csv_col ] ?? '' );
                if ( ! $val ) continue;

                // Checa duplicidade basica
                $existing = get_posts( array(
                    'post_type'      => 'jnc_prompt',
                    'title'          => $val,
                    'posts_per_page' => 1,
                    'meta_query'     => array(
                        array( 'key' => 'jnc_prompt_type', 'value' => $prompt_type ),
                    ),
                ) );

                if ( ! empty( $existing ) ) continue;

                $post_id = wp_insert_post( array(
                    'post_title'  => $val,
                    'post_type'   => 'jnc_prompt',
                    'post_status' => 'publish',
                ) );

                if ( $post_id && ! is_wp_error( $post_id ) ) {
                    update_post_meta( $post_id, 'jnc_prompt_type', $prompt_type );
                    $count++;
                }
            }
        }

        return $count;
    }

    private static function parse_csv_string( $content ) {
        $lines = explode( "\n", str_replace( "\r", "", $content ) );
        $header = null;
        $data = array();

        foreach ( $lines as $line ) {
            if ( ! trim( $line ) ) continue;
            $row = str_getcsv( $line, ',', '"' );
            if ( ! $header ) {
                $header = array_map( 'trim', $row );
                continue;
            }

            if ( count( $row ) === count( $header ) ) {
                $data[] = array_combine( $header, array_map( 'trim', $row ) );
            }
        }

        return $data;
    }
}
