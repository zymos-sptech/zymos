import request from "../request.js";

/**
 * Dados locais (sessionStorage)
 * Como não há rotas GET para usuário/empresa no backend ainda, lemos do cache local.
 */
export function getUsuario() {
  const nome = sessionStorage.getItem('NOME') || 'Usuário';
  const plano = sessionStorage.getItem('PLANO') || '';
  return { nome, plano };
}

export function getEmpresa() {
  const nome = sessionStorage.getItem('NOME_EMPRESA') || 'Sua Empresa';
  const plano = sessionStorage.getItem('PLANO') || '';
  return { nome, plano };
}

/**
 * Funções de busca no Backend
 * Mapeadas exatamente conforme as rotas fornecidas.
 */
export async function getUnidades() {
  const idEmpresa = sessionStorage.getItem('ID_EMPRESA');
  return request(`/unidades/empresa/${idEmpresa}`);
}

export async function getTanques() {
  const idEmpresa = sessionStorage.getItem('ID_EMPRESA');
  return request(`/tanques/empresa/${idEmpresa}`);
}

export async function getLotes() {
  const idEmpresa = sessionStorage.getItem('ID_EMPRESA');
  return request(`/lotes/empresa/${idEmpresa}`);
}

export async function getProducoes() {
  return request(`/producoes`);
}

export async function getLeiturasSensores() {
  return request(`/leiturasSensor/listar`);
}

export async function getAlertas() {
  const idEmpresa = sessionStorage.getItem('ID_EMPRESA');
  return request(`/alertas/empresa/${idEmpresa}`);
}

/**
 * Função agregadora
 * Dispara todas as requisições necessárias em paralelo e retorna o pacote de dados.
 */
export async function carregarPanorama() {
  try {
    const [
      usuario,
      empresa,
      unidades,
      tanques,
      lotes,
      producoes,
      leiturasSensores,
      alertas,
    ] = await Promise.all([
      getUsuario(),
      getEmpresa(),
      getUnidades(),
      getTanques(),
      getLotes(),
      getProducoes(),
      getLeiturasSensores(),
      getAlertas(),
    ]);

    // Validações simples para garantir que o backend não retorne null
    return {
      usuario: usuario || { nome: "Usuário", plano: "" },
      empresa: empresa || { nome: "Sua Empresa", plano: "" },
      unidades: unidades || [],
      tanques: tanques || [],
      lotes: lotes || [],
      producoes: producoes || [],
      leiturasSensores: leiturasSensores || [],
      alertas: alertas || [],
    };
  } catch (error) {
    console.error('Erro ao carregar panorama:', error);
    throw error;
  }
}