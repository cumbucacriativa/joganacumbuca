<?php if ( ! defined( 'ABSPATH' ) ) exit; 
$assets = JNC_URL . 'public/assets/';
?>

<div class="jnc-view">
    <div class="jnc-view__header">
        <div>
            <h1 class="jnc-view__title">Configurações & API REST</h1>
            <p class="jnc-view__sub">Instruções de exibição no site e integração com o n8n ou automações externas.</p>
        </div>
    </div>

    <!-- Card Shortcode -->
    <div class="jnc-card">
        <h3>Exibir o App no Site (Shortcode)</h3>
        <p>Para exibir a interface completa do Joga na Cumbuca em qualquer página ou post do WordPress, insira o shortcode:</p>
        <div class="jnc-code-box">
            <code>[joga_na_cumbuca]</code>
            <button class="jnc-btn jnc-btn--sm" onclick="navigator.clipboard.writeText('[joga_na_cumbuca]'); alert('Shortcode copiado!');">Copiar</button>
        </div>
    </div>

    <!-- Card REST API para n8n -->
    <div class="jnc-card">
        <h3>Integração com n8n & API REST</h3>
        <p>O n8n e outras ferramentas externas podem ler, criar, editar e excluir jogos e frases diretamente por estas rotas REST:</p>
        
        <table class="jnc-table">
            <thead>
                <tr>
                    <th>Método</th>
                    <th>Endpoint REST</th>
                    <th>Descrição</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><span class="jnc-badge jnc-badge--get">GET</span></td>
                    <td><code>/wp-json/jnc/v1/jogos</code></td>
                    <td>Retorna todos os jogos cadastrados</td>
                </tr>
                <tr>
                    <td><span class="jnc-badge jnc-badge--post">POST</span></td>
                    <td><code>/wp-json/jnc/v1/jogos</code></td>
                    <td>Cria ou atualiza um jogo no banco</td>
                </tr>
                <tr>
                    <td><span class="jnc-badge jnc-badge--delete">DELETE</span></td>
                    <td><code>/wp-json/jnc/v1/jogos/{id}</code></td>
                    <td>Exclui um jogo do banco</td>
                </tr>
                <tr>
                    <td><span class="jnc-badge jnc-badge--get">GET</span></td>
                    <td><code>/wp-json/jnc/v1/aleatoriedades</code></td>
                    <td>Retorna as sugestões e frases agrupadas</td>
                </tr>
                <tr>
                    <td><span class="jnc-badge jnc-badge--post">POST</span></td>
                    <td><code>/wp-json/jnc/v1/aleatoriedades</code></td>
                    <td>Cria ou edita uma frase/sugestão</td>
                </tr>
                <tr>
                    <td><span class="jnc-badge jnc-badge--delete">DELETE</span></td>
                    <td><code>/wp-json/jnc/v1/aleatoriedades/{id}</code></td>
                    <td>Exclui uma frase/sugestão</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
