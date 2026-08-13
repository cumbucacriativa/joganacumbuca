<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class JNC_CPT {

    public function __construct() {
        add_action( 'init', array( __CLASS__, 'register' ) );
        add_action( 'save_post_jnc_jogo', array( __CLASS__, 'purge_cache' ) );
        add_action( 'deleted_post', array( __CLASS__, 'purge_cache' ) );
    }

    public static function purge_cache() {
        if ( function_exists( 'w3tc_flush_posts' ) ) {
            @w3tc_flush_posts();
        }
        wp_cache_flush();
    }

    public static function register() {
        // CPT 1: Jogos de Improviso
        register_post_type( 'jnc_jogo', array(
            'labels' => array(
                'name'               => 'Jogos de Improviso',
                'singular_name'      => 'Jogo de Improviso',
                'add_new'            => 'Adicionar Jogo',
                'add_new_item'       => 'Adicionar Novo Jogo',
                'edit_item'          => 'Editar Jogo',
                'new_item'           => 'Novo Jogo',
                'view_item'          => 'Ver Jogo',
                'search_items'       => 'Pesquisar Jogos',
                'not_found'          => 'Nenhum jogo encontrado',
                'not_found_in_trash' => 'Nenhum jogo na lixeira',
            ),
            'public'              => true,
            'publicly_queryable'  => false,
            'show_ui'             => false, // Esconde menu padrao do WP (usamos o painel Zero Visual WP)
            'show_in_menu'        => false,
            'query_var'           => true,
            'rewrite'             => false,
            'capability_type'     => 'post',
            'has_archive'         => false,
            'hierarchical'        => false,
            'supports'            => array( 'title', 'editor', 'custom-fields' ),
            'show_in_rest'        => true,
            'rest_base'           => 'jnc_jogos',
        ) );

        // CPT 2: Aleatoriedades (Personagens, Locais, Filmes, Adjetivos, Frases)
        register_post_type( 'jnc_prompt', array(
            'labels' => array(
                'name'               => 'Aleatoriedades',
                'singular_name'      => 'Aleatoriedade',
                'add_new'            => 'Adicionar Item',
                'add_new_item'       => 'Adicionar Nova Aleatoriedade',
                'edit_item'          => 'Editar Aleatoriedade',
                'new_item'           => 'Nova Aleatoriedade',
                'search_items'       => 'Pesquisar Aleatoriedades',
                'not_found'          => 'Nenhum item encontrado',
            ),
            'public'              => true,
            'publicly_queryable'  => false,
            'show_ui'             => false,
            'show_in_menu'        => false,
            'query_var'           => true,
            'rewrite'             => false,
            'capability_type'     => 'post',
            'has_archive'         => false,
            'hierarchical'        => false,
            'supports'            => array( 'title', 'custom-fields' ),
            'show_in_rest'        => true,
            'rest_base'           => 'jnc_prompts',
        ) );
    }

    /**
     * Helper para buscar todos os jogos como array formatado
     */
    public static function get_all_games( $only_visible = false ) {
        $meta_query = array();
        if ( $only_visible ) {
            $meta_query[] = array(
                'key'     => 'jnc_visivel',
                'value'   => '0',
                'compare' => '!=',
            );
        }

        $posts = get_posts( array(
            'post_type'      => 'jnc_jogo',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
            'orderby'        => 'title',
            'order'          => 'ASC',
            'meta_query'     => $meta_query,
        ) );

        $jogos = array();
        foreach ( $posts as $p ) {
            $jogos[] = array(
                'id'            => (string) $p->ID,
                'jogo'          => $p->post_title,
                'categoria'     => get_post_meta( $p->ID, 'jnc_categoria', true ) ?: 'Geral',
                'participantes' => get_post_meta( $p->ID, 'jnc_participantes', true ) ?: '2+',
                'mediador'      => get_post_meta( $p->ID, 'jnc_mediador', true ) ?: 'não',
                'aquecimento'   => get_post_meta( $p->ID, 'jnc_aquecimento', true ) ?: 'não',
                'musica'         => get_post_meta( $p->ID, 'jnc_musica', true ) ?: 'não',
                'descricao'      => $p->post_content,
                'visivel'        => get_post_meta( $p->ID, 'jnc_visivel', true ) !== '0' ? '1' : '0',
            );
        }
        return $jogos;
    }

    /**
     * Helper para buscar todas as aleatoriedades agrupadas por tipo
     */
    public static function get_all_prompts() {
        $posts = get_posts( array(
            'post_type'      => 'jnc_prompt',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
            'orderby'        => 'ID',
            'order'          => 'ASC',
        ) );

        $result = array(
            'personagens' => array(),
            'locais'      => array(),
            'filmes'      => array(),
            'adjetivos'   => array(),
            'frases'      => array(),
        );

        foreach ( $posts as $p ) {
            $type = get_post_meta( $p->ID, 'jnc_prompt_type', true );
            $item = array(
                'id'    => (string) $p->ID,
                'text'  => $p->post_title,
                'type'  => $type,
            );

            if ( isset( $result[ $type ] ) ) {
                $result[ $type ][] = $item;
            } elseif ( 'personagem' === $type ) {
                $result['personagens'][] = $item;
            } elseif ( 'localizacao' === $type ) {
                $result['locais'][] = $item;
            } elseif ( 'filme' === $type ) {
                $result['filmes'][] = $item;
            } elseif ( 'adjetivo' === $type ) {
                $result['adjetivos'][] = $item;
            } elseif ( 'frase' === $type ) {
                $result['frases'][] = $item;
            }
        }

        return $result;
    }
}
