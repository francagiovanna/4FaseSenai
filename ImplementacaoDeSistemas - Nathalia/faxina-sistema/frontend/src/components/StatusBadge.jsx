const CONFIG = {
  agendado: { rotulo: 'Agendado', classe: 'agendado' },
  concluido: { rotulo: 'Concluido', classe: 'concluido' },
  cancelado: { rotulo: 'Cancelado', classe: 'cancelado' },
};

export default function StatusBadge({ status }) {
  const config = CONFIG[status] || { rotulo: status, classe: 'agendado' };
  return <span className={`selo-status ${config.classe}`}>{config.rotulo}</span>;
}