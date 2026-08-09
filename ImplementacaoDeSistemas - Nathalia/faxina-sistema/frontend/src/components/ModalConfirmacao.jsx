export default function ModalConfirmacao({ aberto, titulo, mensagem, textoConfirmar = 'Confirmar', onConfirmar, onCancelar }) {
  if (!aberto) return null;

  return (
    <div className="modal-fundo aberto" onClick={(e) => { if (e.target === e.currentTarget) onCancelar(); }}>
      <div className="modal-caixa modal-confirmacao">
        <div className="icone-alerta-modal">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4" /><path d="M12 17h.01" />
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          </svg>
        </div>
        <h3>{titulo}</h3>
        <p className="modal-subtitulo">{mensagem}</p>
        <div className="modal-acoes">
          <button type="button" className="btn-secundario" onClick={onCancelar}>Cancelar</button>
          <button type="button" className="btn-perigo-solido" onClick={onConfirmar}>{textoConfirmar}</button>
        </div>
      </div>
    </div>
  );
}