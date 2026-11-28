// URL base do backend
const APP_HOST = window.APP_HOST || 'localhost';
const APP_PORT = window.APP_PORT || '3333';
const BASE_URL = `http://${APP_HOST}:${APP_PORT}`;

/**
 * Wrapper genérico para requisições com tratamento de timeout e erro 401 (NÃO AUTORIZADO).
 */

export default async function request(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: defaultHeaders,
    });

    clearTimeout(timeoutId);

    // Caso o backend implemente autenticação futuramente
    if (response.status === 401) {
      sessionStorage.clear();
      window.location.href = '/login.html';
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Tempo limite de requisição excedido. Verifique sua conexão.');
    }
    throw error;
  }
}

