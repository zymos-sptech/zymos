const userData = {
  id: 1,
  nome: sessionStorage.getItem("NOME") || "Usuário Padrão",
  cargo: sessionStorage.getItem("CARGO") || "Administrador",
  email: sessionStorage.getItem("EMAIL") || "usuario@cervejaria.com.br",
  nome_empresa: "Cervejaria Horizonte",
  plano: "Padrão",
  unidades: [
    { id: 1, nome: "São Paulo" },
    { id: 2, nome: "São Francisco" },
    { id: 3, nome: "Belo Horizonte" },
  ],
  totalTanques: 6,
};

export default userData;
