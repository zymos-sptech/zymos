import userData from "../../MOCK_DATA/user.js";

function renderizarHeader() {
  const nameUser = document.getElementById("name-user");
  const subtitle = document.getElementById("subtitle");
  const plano = document.getElementById("badge-plano");
  const fabricas = document.getElementById("badge-fabricas");
  const tanques = document.getElementById("badge-tanques-total");

  nameUser.textContent = `Olá, ${userData.nome}`;
  subtitle.textContent = `Bem-vindo ao painel da ${userData.nome_empresa}.`;

   plano.textContent = `${userData.plano}`;
   fabricas.textContent = `${userData.unidades.length} fábricas ativas`;
   tanques.textContent = `${userData.totalTanques} tanques monitorados`;

}

document.addEventListener("DOMContentLoaded", () => {
  renderizarHeader();
});
