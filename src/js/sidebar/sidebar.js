import userData from "../MOCK_DATA/user.js";

const userName = document.getElementById("user-name");
const userRole = document.getElementById("user-role");
const userAvatar = document.getElementById("user-avatar");
const userAvatarClose = document.getElementById("user-avatar-close");

function renderizarDadosUser() {
  userName.textContent = userData.nome;
  userRole.textContent = userData.cargo;

  let nomeESobrenome = userData.nome.split(" ");
  let primeiroNome = nomeESobrenome[0].toUpperCase();
  let ultimoNome = nomeESobrenome[nomeESobrenome.length - 1].toUpperCase();

  userAvatar.textContent = `${primeiroNome.charAt(0)}${ultimoNome.charAt(0)}`;
  userAvatarClose.textContent = `${primeiroNome.charAt(0)}${ultimoNome.charAt(0)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarDadosUser();
});

window.closeSidebar = function () {
  let sidebarOpen = document.getElementById("sidebar-open");
  let sidebarClose = document.getElementById("sidebar-close");

  sidebarOpen.style.display = "none";
  sidebarClose.style.display = "flex";
};

window.openSidebar = function () {
  let sidebarOpen = document.getElementById("sidebar-open");
  let sidebarClose = document.getElementById("sidebar-close");

  sidebarOpen.style.display = "flex";
  sidebarClose.style.display = "none";
};

window.logout = function () {
  sessionStorage.removeItem("NOME_COMPLETO");
  sessionStorage.removeItem("CARGO");
  sessionStorage.removeItem("EMAIL");
  sessionStorage.removeItem("PASSWORD");

  window.location = "../../pages/login.html";
};
