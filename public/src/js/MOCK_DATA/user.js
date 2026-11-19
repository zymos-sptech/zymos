const userData = {
  id: 1,
  nome: sessionStorage.getItem("NOME") || "Usuário Padrão",
  cargo: sessionStorage.getItem("CARGO") || "Administrador",
  email: sessionStorage.getItem("EMAIL") || "usuario@cervejaria.com.br",
  nome_empresa: sessionStorage.getItem("NOME_EMPRESA") || "Sem empresa",
  plano: sessionStorage.getItem("PLANO"),
  unidades: sessionStorage.getItem("QTD_UNIDADE") || 0,
  totalTanques: sessionStorage.getItem("") || 0,
};

export default userData;
