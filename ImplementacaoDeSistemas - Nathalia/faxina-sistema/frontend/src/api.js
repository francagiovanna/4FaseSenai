const BASE_URL = '/api';

export function getToken() {
  return localStorage.getItem('faxina_token');
}

export function salvarSessao(token, nome, email) {
  localStorage.setItem('faxina_token', token);
  localStorage.setItem('faxina_nome', nome);
  localStorage.setItem('faxina_email', email);
}

export function encerrarSessao() {
  localStorage.removeItem('faxina_token');
  localStorage.removeItem('faxina_nome');
  localStorage.removeItem('faxina_email');
}

export function nomeUsuario() {
  return localStorage.getItem('faxina_nome') || 'Usuario';
}

export class ApiError extends Error {
  constructor(mensagem, status) {
    super(mensagem);
    this.status = status;
  }
}

export async function api(caminho, opcoes = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opcoes.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const resposta = await fetch(`${BASE_URL}${caminho}`, { ...opcoes, headers });
  const dados = await resposta.json().catch(() => ({}));

  if (!resposta.ok) {
    throw new ApiError(dados.erro || 'Ocorreu um erro inesperado.', resposta.status);
  }

  return dados;
}
