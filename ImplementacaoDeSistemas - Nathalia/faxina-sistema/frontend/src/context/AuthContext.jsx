import { createContext, useContext, useState, useCallback } from 'react';
import { api, getToken, salvarSessao, encerrarSessao, nomeUsuario, ApiError } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(getToken());
  const [nome, setNome] = useState(nomeUsuario());

  const entrar = useCallback(async (email, senha) => {
    const dados = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    });
    salvarSessao(dados.token, dados.nome, dados.email);
    setToken(dados.token);
    setNome(dados.nome);
  }, []);

  const sair = useCallback(() => {
    encerrarSessao();
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, nome, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error('useAuth precisa estar dentro de um AuthProvider.');
  return contexto;
}

export { ApiError };
