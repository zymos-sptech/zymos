window.passwordVisible = function () {
  let inputPassword = document.getElementById("iptPassword");
  let iconVisible = document.getElementById("iconPasswordVisible");
  let iconInvisible = document.getElementById("iconPasswordInvisible");

  iconVisible.style.display = "block";
  iconInvisible.style.display = "none";
  inputPassword.type = "text";
};

window.passwordInvisible = function () {
  let inputPassword = document.getElementById("iptPassword");
  let iconVisible = document.getElementById("iconPasswordVisible");
  let iconInvisible = document.getElementById("iconPasswordInvisible");

  iconVisible.style.display = "none";
  iconInvisible.style.display = "block";
  inputPassword.type = "password";
};

const email = document.getElementById("iptEmail");
const password = document.getElementById("iptPassword");

window.handleFormLogin = () => {
  const SESSION_EMAIL = sessionStorage.getItem("EMAIL");
  const SESSION_PASSWORD = sessionStorage.getItem("PASSWORD");

  if (!SESSION_EMAIL || !SESSION_PASSWORD) {
    return alert(
      "Nenhum usuário cadastrado nesta sessão. Por favor, ative sua conta primeiro!",
    );
  }

  if (
    email.value.trim() !== SESSION_EMAIL ||
    password.value !== SESSION_PASSWORD
  ) {
    return alert("Email ou senha inválido");
  }

  window.location = "../pages/dashboard/visao-geral.html";
};
