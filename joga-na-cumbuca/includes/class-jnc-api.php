<?php
if ( ! defined( 'ABSPATH' ) ) exit;

class JNC_API {

    public function __construct() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
    }

    public function register_routes() {
        // Rotas de Jogos
        register_rest_route( 'jnc/v1', '/jogos', array(
            array(
                'methods'             => 'GET',
                'callback'            => array( $this, 'get_jogos' ),
                'permission_callback' => '__return_true',
            ),
            array(
                'methods'             => 'POST',
                'callback'            => array( $this, 'save_jogo' ),
                'permission_callback' => array( $this, 'check_write_permission' ),
            ),
        ) );

        register_rest_route( 'jnc/v1', '/jogos/(?P<id>\d+)', array(
            array(
                'methods'             => 'DELETE',
                'callback'            => array( $this, 'delete_jogo' ),
                'permission_callback' => array( $this, 'check_write_permission' ),
            ),
            array(
                'methods'             => 'POST',
                'callback'            => array( $this, 'save_jogo' ),
                'permission_callback' => array( $this, 'check_write_permission' ),
            ),
        ) );

        // Rotas de Aleatoriedades
        register_rest_route( 'jnc/v1', '/aleatoriedades', array(
            array(
                'methods'             => 'GET',
                'callback'            => array( $this, 'get_aleatoriedades' ),
                'permission_callback' => '__return_true',
            ),
            array(
                'methods'             => 'POST',
                'callback'            => array( $this, 'save_aleatoriedade' ),
                'permission_callback' => array( $this, 'check_write_permission' ),
            ),
        ) );

        register_rest_route( 'jnc/v1', '/aleatoriedades/(?P<id>\d+)', array(
            array(
                'methods'             => 'DELETE',
                'callback'            => array( $this, 'delete_aleatoriedade' ),
                'permission_callback' => array( $this, 'check_write_permission' ),
            ),
        ) );
    }

    public function check_write_permission( $request ) {
        // Permite se for usuario autenticado no admin ou se mandar chave de API
        if ( current_user_can( 'edit_posts' ) ) return true;

        $api_key = $request->get_header( 'X-JNC-API-Key' ) ?: $request->get_param( 'api_key' );
        $saved_key = get_option( 'jnc_api_key', '' );
        if ( $saved_key && $api_key && hash_equals( $saved_key, $api_key ) ) {
            return true;
        }

        // Permite temporariamente em desenvolvimento/producao sem chave estrita se configurado
        if ( ! $saved_key ) return true;

        return new WP_Error( 'rest_forbidden', 'Acesso negado: chave de API ou permissao invalida.', array( 'status' => 401 ) );
    }

    public function get_jogos( $request ) {
        $all = $request->get_param( 'all' ) === '1';
        $jogos = JNC_CPT::get_all_games( ! $all );
        return new WP_REST_Response( array(
            'status' => 'success',
            'count'  => count( $jogos ),
            'jogos'  => $jogos,
        ), 200 );
    }

    public function save_jogo( $request ) {
        $id            = (int) ( $request->get_param( 'id' ) ?: $request->get_param( 'post_id' ) );
        $jogo          = sanitize_text_field( $request->get_param( 'jogo' ) ?: $request->get_param( 'title' ) );
        $categoria     = sanitize_text_field( $request->get_param( 'categoria' ) );
        $participantes = sanitize_text_field( $request->get_param( 'participantes' ) );
        $mediador      = sanitize_text_field( $request->get_param( 'mediador' ) ?: 'não' );
        $aquecimento   = sanitize_text_field( $request->get_param( 'aquecimento' ) ?: 'não' );
        $musica        = sanitize_text_field( $request->get_param( 'musica' ) ?: 'não' );
        $descricao     = sanitize_textarea_field( $request->get_param( 'descricao' ) ?: $request->get_param( 'content' ) );
        $visivel       = $request->get_param( 'visivel' ) !== '0' ? '1' : '0';

        if ( ! $jogo ) {
            return new WP_Error( 'missing_title', 'O nome do jogo e obrigatorio.', array( 'status' => 400 ) );
        }

        $post_data = array(
            'post_title'   => $jogo,
            'post_content' => $descricao,
            'post_type'    => 'jnc_jogo',
            'post_status'  => 'publish',
        );

        if ( $id > 0 ) {
            $post_data['ID'] = $id;
            $post_id = wp_update_post( $post_data );
        } else {
            $post_id = wp_insert_post( $post_data );
        }

        if ( is_wp_error( $post_id ) ) {
            return new WP_Error( 'save_failed', $post_id->get_error_message(), array( 'status' => 500 ) );
        }

        update_post_meta( $post_id, 'jnc_categoria', $categoria ?: 'Geral' );
        update_post_meta( $post_id, 'jnc_participantes', $participantes ?: '2+' );
        update_post_meta( $post_id, 'jnc_mediador', $mediador );
        update_post_meta( $post_id, 'jnc_aquecimento', $aquecimento );
        update_post_meta( $post_id, 'jnc_musica', $musica );
        update_post_meta( $post_id, 'jnc_visivel', $visivel );

        return new WP_REST_Response( array(
            'status'  => 'success',
            'id'      => (string) $post_id,
            'message' => $id > 0 ? 'Jogo atualizado com sucesso!' : 'Jogo criado com sucesso!',
        ), 200 );
    }

    public function delete_jogo( $request ) {
        $id = (int) $request->get_param( 'id' );
        if ( ! $id || get_post_type( $id ) !== 'jnc_jogo' ) {
            return new WP_Error( 'not_found', 'Jogo nao encontrado.', array( 'status' => 404 ) );
        }

        wp_delete_post( $id, true );
        return new WP_REST_Response( array(
            'status'  => 'success',
            'id'      => (string) $id,
            'message' => 'Jogo excluido com sucesso!',
        ), 200 );
    }

    public function get_aleatoriedades() {
        $prompts = JNC_CPT::get_all_prompts();
        return new WP_REST_Response( array(
            'status'  => 'success',
            'prompts' => $prompts,
        ), 200 );
    }

    public function save_aleatoriedade( $request ) {
        $id   = (int) $request->get_param( 'id' );
        $text = sanitize_text_field( $request->get_param( 'text' ) ?: $request->get_param( 'title' ) );
        $type = sanitize_text_field( $request->get_param( 'type' ) );

        if ( ! $text || ! $type ) {
            return new WP_Error( 'missing_fields', 'O texto e o tipo sao obrigatorios.', array( 'status' => 400 ) );
        }

        $post_data = array(
            'post_title'  => $text,
            'post_type'   => 'jnc_prompt',
            'post_status' => 'publish',
        );

        if ( $id > 0 ) {
            $post_data['ID'] = $id;
            $post_id = wp_update_post( $post_data );
        } else {
            $post_id = wp_insert_post( $post_data );
        }

        if ( is_wp_error( $post_id ) ) {
            return new WP_Error( 'save_failed', $post_id->get_error_message(), array( 'status' => 500 ) );
        }

        update_post_meta( $post_id, 'jnc_prompt_type', $type );

        return new WP_REST_Response( array(
            'status'  => 'success',
            'id'      => (string) $post_id,
            'message' => 'Item salvo com sucesso!',
        ), 200 );
    }

    public function delete_aleatoriedade( $request ) {
        $id = (int) $request->get_param( 'id' );
        if ( ! $id || get_post_type( $id ) !== 'jnc_prompt' ) {
            return new WP_Error( 'not_found', 'Item nao encontrado.', array( 'status' => 404 ) );
        }

        wp_delete_post( $id, true );
        return new WP_REST_Response( array(
            'status'  => 'success',
            'id'      => (string) $id,
            'message' => 'Item excluido com sucesso!',
        ), 200 );
    }
}
