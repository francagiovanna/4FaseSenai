import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { token, entrar } = useAuth();
  const navegar = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Ja logado: pula direto para o painel.
  if (token) return <Navigate to="/" replace />;

  async function handleSubmit(evento) {
    evento.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Preencha e-mail e senha para continuar.');
      return;
    }

    setCarregando(true);
    try {
      await entrar(email, senha);
      navegar('/', { replace: true });
    } catch (falha) {
      // RF 4.1: informa o motivo da falha e mantem o usuario na tela de login.
      setErro(falha.message);
      setSenha('');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="tela-login">
      <div className="login-marca">
        <span className="selo">Faxina App</span>
        <div className="login-conteudo">
          <h1>Toda a agenda da equipe de limpeza, num so lugar.</h1>
          <p>Organize clientes, profissionais e horarios sem risco de agendamentos duplicados.</p>
        </div>
      </div>

      <div className="login-form-wrap">
        <div className="login-card">
          <h2>Entrar</h2>
          <p className="subtitulo">Acesse com sua conta cadastrada na empresa.</p>

          <div className={`alerta erro ${erro ? 'mostrar' : ''}`}>{erro}</div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="campo">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                placeholder="voce@faxinapp.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="campo">
              <label htmlFor="senha">Senha</label>
              <input
                type="password"
                id="senha"
                placeholder="********"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primario" style={{ width: '100%' }} disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p style={{ color: 'var(--cor-texto-muted)', fontSize: '12.5px', marginTop: '18px' }}>
            Conta de teste: ana.souza@faxinapp.com &middot; senha 123456
          </p>
        </div>
      </div>
    </div>
  );
}
