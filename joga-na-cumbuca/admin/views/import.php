<?php if ( ! defined( 'ABSPATH' ) ) exit; 
$assets = JNC_URL . 'public/assets/';
?>

<div class="jnc-view">
    <div class="jnc-view__header">
        <div>
            <h1 class="jnc-view__title">Importar / Migrar CSVs</h1>
            <p class="jnc-view__sub">Sincronize os jogos e aleatoriedades dos arquivos CSV para o banco do WordPress.</p>
        </div>
    </div>

    <div class="jnc-card jnc-import-card">
        <div class="jnc-import-info">
            <img class="jnc-import-icon" src="<?php echo esc_url( $assets . 'seta-baixo.svg' ); ?>" width="32" height="32" alt="">
            <div>
                <h3>Sincronização em 1 Clique</h3>
                <p>Clique no botão abaixo para importar todos os jogos de <code>data/jogos.csv</code> (60 jogos) e todas as sugestões de <code>data/aleatoriedades.csv</code> (500 itens) para o banco do WordPress.</p>
                <p class="jnc-hint">Os itens que já existirem no banco serão atualizados sem duplicação.</p>
            </div>
        </div>

        <div class="jnc-import-actions">
            <button class="jnc-btn jnc-btn--primary jnc-btn--lg" id="jncBtnStartImport">
                Sincronizar CSVs para o WordPress Agora
            </button>
        </div>

        <div class="jnc-import-result" id="jncImportResult" style="display:none;"></div>
    </div>
</div>
